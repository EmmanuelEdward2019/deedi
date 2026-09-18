-- ============================================================
-- Idempotent migrations for databases created before a change.
-- Safe to run repeatedly; applied by `npm run db:setup`.
-- ============================================================

-- Team roles ------------------------------------------------------------
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Normalise any legacy role value before the constraint goes on.
UPDATE admin_users SET role = 'owner' WHERE role NOT IN ('owner', 'manager');

-- Guarantee at least one owner, so team management can never be locked out.
UPDATE admin_users SET role = 'owner'
WHERE id = (SELECT id FROM admin_users ORDER BY id LIMIT 1)
  AND NOT EXISTS (SELECT 1 FROM admin_users WHERE role = 'owner');

ALTER TABLE admin_users ALTER COLUMN role SET DEFAULT 'manager';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_role_check'
  ) THEN
    ALTER TABLE admin_users
      ADD CONSTRAINT admin_users_role_check CHECK (role IN ('owner', 'manager'));
  END IF;
END $$;

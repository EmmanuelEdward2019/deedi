-- ============================================================
-- Deedi Ltd — database schema (Neon Postgres)
-- ============================================================

-- Roles: 'owner' has full control including team management and deletion.
--        'manager' can create and edit content and handle enquiries.
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('owner','manager')),
  password_hash TEXT NOT NULL,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS properties (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  summary          TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  listing_type     TEXT NOT NULL DEFAULT 'sale' CHECK (listing_type IN ('sale','rent')),
  status           TEXT NOT NULL DEFAULT 'available'
                   CHECK (status IN ('available','under_offer','let_agreed','sold','draft')),
  price            NUMERIC(12,2) NOT NULL DEFAULT 0,
  price_qualifier  TEXT,
  rent_period      TEXT,
  bedrooms         INTEGER NOT NULL DEFAULT 0,
  bathrooms        INTEGER NOT NULL DEFAULT 0,
  receptions       INTEGER NOT NULL DEFAULT 0,
  floor_area_sqft  INTEGER,
  property_type    TEXT NOT NULL DEFAULT 'House',
  tenure           TEXT,
  epc_rating       TEXT,
  address_line     TEXT NOT NULL DEFAULT '',
  city             TEXT NOT NULL DEFAULT '',
  region           TEXT NOT NULL DEFAULT '',
  postcode         TEXT NOT NULL DEFAULT '',
  latitude         NUMERIC(9,6),
  longitude        NUMERIC(9,6),
  features         TEXT[] NOT NULL DEFAULT '{}',
  images           TEXT[] NOT NULL DEFAULT '{}',
  hero_image       TEXT NOT NULL DEFAULT '',
  featured         BOOLEAN NOT NULL DEFAULT false,
  meta_title       TEXT,
  meta_description TEXT,
  views            INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS properties_status_idx   ON properties (status);
CREATE INDEX IF NOT EXISTS properties_listing_idx  ON properties (listing_type);
CREATE INDEX IF NOT EXISTS properties_city_idx     ON properties (city);
CREATE INDEX IF NOT EXISTS properties_price_idx    ON properties (price);
CREATE INDEX IF NOT EXISTS properties_featured_idx ON properties (featured, created_at DESC);

CREATE TABLE IF NOT EXISTS artworks (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  artist           TEXT NOT NULL DEFAULT 'Deedi Studio',
  summary          TEXT NOT NULL DEFAULT '',
  description      TEXT NOT NULL DEFAULT '',
  category         TEXT NOT NULL DEFAULT 'Originals',
  medium           TEXT NOT NULL DEFAULT 'Mixed media',
  status           TEXT NOT NULL DEFAULT 'available'
                   CHECK (status IN ('available','reserved','sold','draft')),
  price            NUMERIC(12,2),
  price_on_request BOOLEAN NOT NULL DEFAULT false,
  width_cm         INTEGER,
  height_cm        INTEGER,
  year             INTEGER,
  edition          TEXT,
  framed           BOOLEAN NOT NULL DEFAULT true,
  frame_detail     TEXT,
  images           TEXT[] NOT NULL DEFAULT '{}',
  hero_image       TEXT NOT NULL DEFAULT '',
  featured         BOOLEAN NOT NULL DEFAULT false,
  meta_title       TEXT,
  meta_description TEXT,
  views            INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS artworks_status_idx   ON artworks (status);
CREATE INDEX IF NOT EXISTS artworks_category_idx ON artworks (category);
CREATE INDEX IF NOT EXISTS artworks_featured_idx ON artworks (featured, created_at DESC);

CREATE TABLE IF NOT EXISTS blog_posts (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  excerpt          TEXT NOT NULL DEFAULT '',
  content          TEXT NOT NULL DEFAULT '',
  cover_image      TEXT,
  category         TEXT NOT NULL DEFAULT 'Insights',
  tags             TEXT[] NOT NULL DEFAULT '{}',
  author           TEXT NOT NULL DEFAULT 'Deedi Ltd',
  author_role      TEXT,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  featured         BOOLEAN NOT NULL DEFAULT false,
  reading_minutes  INTEGER NOT NULL DEFAULT 4,
  meta_title       TEXT,
  meta_description TEXT,
  focus_keyword    TEXT,
  canonical_url    TEXT,
  og_image         TEXT,
  views            INTEGER NOT NULL DEFAULT 0,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_status_idx    ON blog_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_category_idx  ON blog_posts (category);
CREATE INDEX IF NOT EXISTS blog_tags_idx      ON blog_posts USING GIN (tags);

CREATE TABLE IF NOT EXISTS contact_messages (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  subject      TEXT NOT NULL DEFAULT 'General enquiry',
  enquiry_type TEXT NOT NULL DEFAULT 'general',
  message      TEXT NOT NULL,
  source_page  TEXT,
  related_ref  TEXT,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  admin_note   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_status_idx ON contact_messages (status, created_at DESC);

CREATE TABLE IF NOT EXISTS gallery_items (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  caption    TEXT,
  image      TEXT NOT NULL,
  collection TEXT NOT NULL DEFAULT 'Property',
  tags       TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  source     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

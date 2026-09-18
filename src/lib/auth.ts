import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import type { AdminRole, AdminUser } from "@/lib/types";

const COOKIE = "deedi_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export interface Session {
  sub: number;
  email: string;
  name: string;
  role: AdminRole;
  exp: number;
}

/** Shortest password we will accept when one is set or changed. */
export const PASSWORD_MIN_LENGTH = 10;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error("SESSION_SECRET must be set to a random string of 32+ characters.");
  }
  return value;
}

const enc = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmac(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

/** Constant-time string compare, so signature checks don't leak timing. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function signSession(session: Session) {
  const payload = toBase64Url(enc.encode(JSON.stringify(session)));
  return `${payload}.${await hmac(payload)}`;
}

async function verifyToken(token: string): Promise<Session | null> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, await hmac(payload))) return null;

  try {
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Session;
    if (session.exp < Date.now() / 1000) return null;
    return session;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */

export async function verifyCredentials(email: string, password: string) {
  const rows = (await sql`
    SELECT * FROM admin_users WHERE lower(email) = lower(${email}) LIMIT 1
  `) as AdminUser[];

  const user = rows[0];
  // Always run a hash comparison so a missing user and a wrong password
  // take a similar amount of time.
  const hash = user?.password_hash ?? "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi";
  const ok = await bcrypt.compare(password, hash);
  return ok && user ? user : null;
}

export async function createSession(user: AdminUser) {
  const session: Session = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  };

  await sql`UPDATE admin_users SET last_login_at = now() WHERE id = ${user.id}`;

  const store = await cookies();
  store.set(COOKIE, await signSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/**
 * Memoised per request: the layout, the page and any server action in the same
 * render all share one verification instead of repeating it.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? verifyToken(token) : null;
});

/** Guards an admin route; redirects to the login screen when signed out. */
export async function requireAdmin(returnTo = "/admin"): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`);
  return session;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

/**
 * Guards an owner-only route. The role is re-read from the database rather than
 * trusted from the cookie, so a demotion takes effect on the next request
 * instead of when the old session happens to expire.
 */
export async function requireOwner(returnTo = "/admin"): Promise<Session> {
  const session = await requireAdmin(returnTo);
  if ((await currentRole()) !== "owner") redirect("/admin?denied=owner");
  return { ...session, role: "owner" };
}

/**
 * Current role straight from the database, for gating UI and actions.
 * Memoised per request — the dashboard layout and the page both need it, and
 * each uncached call was a separate round trip to Neon.
 */
export const currentRole = cache(async (): Promise<AdminRole | null> => {
  const session = await getSession();
  if (!session) return null;

  const rows = await sql<{ role: AdminRole }>`
    SELECT role FROM admin_users WHERE id = ${session.sub} LIMIT 1
  `;
  return rows[0]?.role ?? null;
});

/** Checks a password against the stored hash for one account. */
export async function passwordMatches(userId: number, password: string) {
  const rows = await sql<{ password_hash: string }>`
    SELECT password_hash FROM admin_users WHERE id = ${userId} LIMIT 1
  `;
  if (!rows[0]) return false;
  return bcrypt.compare(password, rows[0].password_hash);
}

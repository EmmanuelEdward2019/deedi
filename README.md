# Deedi Ltd — Property & Art

A production-ready Next.js 16 site for a combined property management and art
business, backed by Neon Postgres.

- **Public site** — welcome page, property listings, art collection, gallery,
  SEO blog, services, about, contact
- **Admin dashboard** — manage properties, artwork, journal posts, gallery
  images and enquiries
- **WhatsApp live chat** — floating widget that hands off to WhatsApp
- **Contact form** — submissions land in the admin inbox

---

## 1. Set up the database

Create a project at [neon.tech](https://neon.tech), then copy the **pooled**
connection string from *Connection Details*.

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```ini
DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require"
SESSION_SECRET="<a long random string>"     # openssl rand -base64 32
ADMIN_EMAIL="admin@deedi.co.uk"
ADMIN_PASSWORD="<choose a strong password>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Create the tables and load the sample content:

```bash
npm install
npm run db:setup     # creates the schema
npm run db:seed      # 7 properties, 7 artworks, 6 posts, 14 gallery items, 5 enquiries
```

`npm run db:reset` drops everything and rebuilds from scratch.
Both scripts are safe to re-run — every insert upserts on its natural key.

## 2. Run it

```bash
npm run dev          # http://localhost:3000
```

Sign in to the dashboard at `/admin/login` with the `ADMIN_EMAIL` and
`ADMIN_PASSWORD` you set above.

---

## Before going live

| What | Where |
| --- | --- |
| **WhatsApp number** (currently a placeholder) | `src/lib/site.ts` → `contact.whatsapp` |
| Phone, email, address, opening hours | `src/lib/site.ts` → `contact` |
| Social media links | `src/lib/site.ts` → `social` |
| Headline statistics | `src/lib/site.ts` → `stats` |
| Production URL | `NEXT_PUBLIC_SITE_URL` env var |
| Image uploads | `BLOB_READ_WRITE_TOKEN` — add a Vercel Blob store |
| Brand colours | `src/app/globals.css` → `@theme` |

The WhatsApp number must be digits only in international format with no `+`,
e.g. `447700900000`.

---

## Project structure

```
src/
  app/
    (site)/            public pages — share the header, footer and chat widget
      page.tsx           welcome / overview
      properties/        listings + [slug] detail
      art/               collection + [slug] detail
      gallery/           filterable masonry gallery
      blog/              journal + [slug] article
      services/  about/  contact/  privacy/  terms/
    admin/
      login/             unguarded sign-in
      (dashboard)/       guarded — overview, properties, art, blog, gallery,
                         messages, team (owners), account
    api/
      contact/           enquiry form → contact_messages
      subscribe/         newsletter → subscribers
    sitemap.ts  robots.ts  icon.svg
  components/
    admin/               dashboard UI, forms, rich editor, SEO panel
    ...                  cards, galleries, forms, header, footer, chat widget
  lib/
    db.ts                Neon client (parameterised tagged templates)
    queries.ts           all reads, deduped per request
    actions.ts           server actions for every write
    auth.ts              HMAC-signed session cookie, bcrypt passwords
    site.ts              brand, contact details, navigation
    format.ts  media.ts  rate-limit.ts  types.ts
scripts/
  schema.sql       fresh-install definition
  migrations.sql   idempotent alterations for existing databases
  setup-db.mjs  seed.mjs  seed-*.mjs
public/images/
  properties/  art/  brand/
```

## Roles and accounts

Two roles, set per account:

| | Owner | Account manager |
| --- | :---: | :---: |
| Add and edit properties, artwork, journal, gallery | ✓ | ✓ |
| Handle enquiries (read, reply, archive) | ✓ | ✓ |
| Delete listings, posts, gallery images, enquiries | ✓ | — |
| Add, edit and remove team accounts | ✓ | — |

The first account created by `npm run db:seed` is an owner. Owners add colleagues
at **/admin/team**, where they can also change someone's role or set a new
password if that person is locked out.

Everyone signed in can change their own name and password at **/admin/account**.

Two safeguards prevent a lockout: the last remaining owner cannot be demoted or
deleted, and nobody can delete their own account from the team page.

Role checks are enforced in the server actions, not just hidden in the UI — a
manager replaying an owner-only request is redirected rather than obeyed. Roles
are re-read from the database on each request, so a change takes effect
immediately rather than when the old session expires.

## Content management

Everything on the public site is editable from `/admin`:

- **Properties** — price, status, specification, features, address, images, SEO
- **Artwork** — artist, medium, dimensions, edition, framing, price or POA
- **Journal** — WordPress-style editor with a Visual/Text toggle, a search-result
  preview and focus-keyphrase checks
- **Gallery** — images grouped into collections, with display ordering
- **Enquiries** — read, reply by email or WhatsApp, add internal notes, archive
- **Team** (owners only) — add colleagues, set roles, reset passwords

Images can be uploaded from your device (drag-and-drop or file picker), picked
from anything in `public/images`, or added by URL. Uploads accept JPG, PNG,
WebP, AVIF and GIF up to 8MB.

### Where uploads are stored

Vercel's filesystem is read-only, so deployed uploads go to **Vercel Blob**.
Add a Blob store under the project's **Storage** tab; Vercel injects
`BLOB_READ_WRITE_TOKEN` automatically on the next deploy.

Copy that same token into `.env.local` so local uploads go to the same place.
Without it, uploads fall back to `public/images/uploads`, which only `next dev`
serves — and because local and production share one Neon database, a locally
uploaded image would be recorded as a URL that production cannot resolve.

## Fonts

Inter and Playfair Display are **self-hosted** from `src/app/fonts` as variable
woff2 files (latin subset, ~86KB total), loaded with `next/font/local`.

Nothing is fetched from Google at build or at runtime, so builds are
reproducible and work offline, a Google Fonts outage cannot fail a deploy, and
no visitor data reaches a third party. Metric-matched fallbacks (`size-adjust`,
`ascent-override`) prevent layout shift before the webfont loads.

To change a weight range or add a subset, replace the woff2 files and update
the `localFont` calls in `src/app/layout.tsx`.

## SEO

- Per-page `metadata` with canonical URLs, Open Graph and Twitter cards
- JSON-LD: `RealEstateAgent`, `SingleFamilyResidence` / `Apartment`,
  `VisualArtwork`, `BlogPosting`, `BreadcrumbList`, `ItemList`, `Service`
- `sitemap.xml` generated from the database, `robots.txt` excluding `/admin`
- Per-post meta title, description, focus keyphrase, canonical and OG image

## Security

- Two roles: owners have full control, managers cannot delete or manage the team
- Admin sessions are HMAC-SHA256 signed, HTTP-only, 8-hour cookies
- Passwords hashed with bcrypt; sign-in compares in constant time
- Every query uses bound parameters — no string interpolation of user input
- Public forms are honeypot-protected and rate limited per IP
- `/admin` and `/api` are excluded from `robots.txt`

## Deploy

Works on any Node host. On Vercel, set `DATABASE_URL`, `SESSION_SECRET` and
`NEXT_PUBLIC_SITE_URL` as environment variables, then:

```bash
npm run build
npm start
```

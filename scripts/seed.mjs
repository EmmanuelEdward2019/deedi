/**
 * Seeds sample properties, artworks, blog posts, gallery items, enquiries
 * and the first admin account.
 *
 *   node --env-file=.env.local scripts/seed.mjs
 *
 * Safe to re-run: every insert upserts on its natural key.
 */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { properties } from "./seed-properties.mjs";
import { artworks } from "./seed-artworks.mjs";
import { posts } from "./seed-posts.mjs";
import { galleryItems, messages, subscribers } from "./seed-misc.mjs";

if (!process.env.DATABASE_URL) {
  console.error("\n  ✖ DATABASE_URL is not set. Add it to .env.local first.\n");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@deedi.co.uk";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "DeediAdmin2026!";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Deedi Administrator";

/** Words per minute used for the reading-time estimate. */
function readingMinutes(html) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function seedAdmin() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await sql`
    INSERT INTO admin_users (email, name, role, password_hash)
    VALUES (${ADMIN_EMAIL}, ${ADMIN_NAME}, 'owner', ${hash})
    ON CONFLICT (email) DO UPDATE
      SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash
  `;
  console.log(`  ✔ admin account — ${ADMIN_EMAIL}`);
}

async function seedProperties() {
  for (const p of properties) {
    await sql`
      INSERT INTO properties (
        slug, title, summary, description, listing_type, status, price,
        price_qualifier, rent_period, bedrooms, bathrooms, receptions,
        floor_area_sqft, property_type, tenure, epc_rating, address_line,
        city, region, postcode, latitude, longitude, features, images,
        hero_image, featured, meta_title, meta_description
      ) VALUES (
        ${p.slug}, ${p.title}, ${p.summary}, ${p.description}, ${p.listing_type},
        ${p.status}, ${p.price}, ${p.price_qualifier}, ${p.rent_period},
        ${p.bedrooms}, ${p.bathrooms}, ${p.receptions}, ${p.floor_area_sqft},
        ${p.property_type}, ${p.tenure}, ${p.epc_rating}, ${p.address_line},
        ${p.city}, ${p.region}, ${p.postcode}, ${p.latitude}, ${p.longitude},
        ${p.features}, ${p.images}, ${p.hero_image}, ${p.featured},
        ${p.meta_title}, ${p.meta_description}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title, summary = EXCLUDED.summary,
        description = EXCLUDED.description, listing_type = EXCLUDED.listing_type,
        status = EXCLUDED.status, price = EXCLUDED.price,
        price_qualifier = EXCLUDED.price_qualifier, rent_period = EXCLUDED.rent_period,
        bedrooms = EXCLUDED.bedrooms, bathrooms = EXCLUDED.bathrooms,
        receptions = EXCLUDED.receptions, floor_area_sqft = EXCLUDED.floor_area_sqft,
        property_type = EXCLUDED.property_type, tenure = EXCLUDED.tenure,
        epc_rating = EXCLUDED.epc_rating, address_line = EXCLUDED.address_line,
        city = EXCLUDED.city, region = EXCLUDED.region, postcode = EXCLUDED.postcode,
        latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude,
        features = EXCLUDED.features, images = EXCLUDED.images,
        hero_image = EXCLUDED.hero_image, featured = EXCLUDED.featured,
        meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
        updated_at = now()
    `;
  }
  console.log(`  ✔ ${properties.length} properties`);
}

async function seedArtworks() {
  for (const a of artworks) {
    await sql`
      INSERT INTO artworks (
        slug, title, artist, summary, description, category, medium, status,
        price, price_on_request, width_cm, height_cm, year, edition, framed,
        frame_detail, images, hero_image, featured, meta_title, meta_description
      ) VALUES (
        ${a.slug}, ${a.title}, ${a.artist}, ${a.summary}, ${a.description},
        ${a.category}, ${a.medium}, ${a.status}, ${a.price}, ${a.price_on_request},
        ${a.width_cm}, ${a.height_cm}, ${a.year}, ${a.edition}, ${a.framed},
        ${a.frame_detail}, ${a.images}, ${a.hero_image}, ${a.featured},
        ${a.meta_title}, ${a.meta_description}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title, artist = EXCLUDED.artist, summary = EXCLUDED.summary,
        description = EXCLUDED.description, category = EXCLUDED.category,
        medium = EXCLUDED.medium, status = EXCLUDED.status, price = EXCLUDED.price,
        price_on_request = EXCLUDED.price_on_request, width_cm = EXCLUDED.width_cm,
        height_cm = EXCLUDED.height_cm, year = EXCLUDED.year, edition = EXCLUDED.edition,
        framed = EXCLUDED.framed, frame_detail = EXCLUDED.frame_detail,
        images = EXCLUDED.images, hero_image = EXCLUDED.hero_image,
        featured = EXCLUDED.featured, meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description, updated_at = now()
    `;
  }
  console.log(`  ✔ ${artworks.length} artworks`);
}

async function seedPosts() {
  for (const p of posts) {
    await sql`
      INSERT INTO blog_posts (
        slug, title, excerpt, content, cover_image, category, tags, author,
        author_role, status, featured, reading_minutes, meta_title,
        meta_description, focus_keyword, og_image, published_at
      ) VALUES (
        ${p.slug}, ${p.title}, ${p.excerpt}, ${p.content}, ${p.cover_image},
        ${p.category}, ${p.tags}, ${p.author}, ${p.author_role}, ${p.status},
        ${p.featured}, ${readingMinutes(p.content)}, ${p.meta_title},
        ${p.meta_description}, ${p.focus_keyword}, ${p.cover_image},
        ${p.published_at}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content,
        cover_image = EXCLUDED.cover_image, category = EXCLUDED.category,
        tags = EXCLUDED.tags, author = EXCLUDED.author, author_role = EXCLUDED.author_role,
        status = EXCLUDED.status, featured = EXCLUDED.featured,
        reading_minutes = EXCLUDED.reading_minutes, meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description, focus_keyword = EXCLUDED.focus_keyword,
        og_image = EXCLUDED.og_image, published_at = EXCLUDED.published_at,
        updated_at = now()
    `;
  }
  console.log(`  ✔ ${posts.length} blog posts`);
}

async function seedGallery() {
  await sql`DELETE FROM gallery_items`;
  for (const g of galleryItems) {
    await sql`
      INSERT INTO gallery_items (title, caption, image, collection, tags, sort_order)
      VALUES (${g.title}, ${g.caption}, ${g.image}, ${g.collection}, ${g.tags}, ${g.sort_order})
    `;
  }
  console.log(`  ✔ ${galleryItems.length} gallery items`);
}

async function seedMessages() {
  const existing = await sql`SELECT COUNT(*)::int AS count FROM contact_messages`;
  if (existing[0].count > 0) {
    console.log("  • enquiries already present — skipped");
    return;
  }
  for (const [index, m] of messages.entries()) {
    // Spread the sample enquiries across the past fortnight.
    const daysAgo = (index + 1) * 2;
    await sql`
      INSERT INTO contact_messages (
        name, email, phone, subject, enquiry_type, message,
        source_page, related_ref, status, created_at
      ) VALUES (
        ${m.name}, ${m.email}, ${m.phone}, ${m.subject}, ${m.enquiry_type},
        ${m.message}, ${m.source_page}, ${m.related_ref}, ${m.status},
        now() - (${daysAgo} || ' days')::interval
      )
    `;
  }
  console.log(`  ✔ ${messages.length} sample enquiries`);
}

async function seedSubscribers() {
  for (const s of subscribers) {
    await sql`
      INSERT INTO subscribers (email, source) VALUES (${s.email}, ${s.source})
      ON CONFLICT (email) DO NOTHING
    `;
  }
  console.log(`  ✔ ${subscribers.length} subscribers`);
}

async function main() {
  console.log("\n  Seeding Deedi Ltd…\n");
  await seedAdmin();
  await seedProperties();
  await seedArtworks();
  await seedPosts();
  await seedGallery();
  await seedMessages();
  await seedSubscribers();
  console.log("\n  Done. Sign in at /admin/login\n");
  console.log(`    email:    ${ADMIN_EMAIL}`);
  console.log(`    password: ${ADMIN_PASSWORD}\n`);
}

main().catch((error) => {
  console.error("\n  ✖ seed failed:", error.message, "\n");
  process.exit(1);
});

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import {
  PASSWORD_MIN_LENGTH,
  createSession,
  currentRole,
  destroySession,
  hashPassword,
  passwordMatches,
  requireAdmin,
  requireOwner,
  verifyCredentials,
} from "@/lib/auth";
import { readingTime, slugify, stripHtml, truncate } from "@/lib/format";

export interface ActionState {
  error?: string;
  success?: string;
}

/* ------------------------------------------------------------------ */
/* form helpers                                                        */
/* ------------------------------------------------------------------ */

function str(data: FormData, key: string, fallback = "") {
  const value = data.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function nullable(data: FormData, key: string) {
  const value = str(data, key);
  return value === "" ? null : value;
}

function int(data: FormData, key: string, fallback = 0) {
  const value = Number(str(data, key));
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

function nullableInt(data: FormData, key: string) {
  const raw = str(data, key);
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.trunc(value) : null;
}

function decimal(data: FormData, key: string, fallback = 0) {
  const value = Number(str(data, key).replace(/[£,\s]/g, ""));
  return Number.isFinite(value) ? value : fallback;
}

function nullableDecimal(data: FormData, key: string) {
  const raw = str(data, key).replace(/[£,\s]/g, "");
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function bool(data: FormData, key: string) {
  return data.get(key) === "on" || data.get(key) === "true";
}

/** Splits a textarea of one-per-line (or comma separated) values into an array. */
function list(data: FormData, key: string) {
  return str(data, key)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* auth                                                                */
/* ------------------------------------------------------------------ */

export async function loginAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  const email = str(data, "email");
  const password = str(data, "password");
  const next = str(data, "next") || "/admin";

  if (!email || !password) {
    return { error: "Enter your email address and password." };
  }

  try {
    const user = await verifyCredentials(email, password);
    if (!user) return { error: "Those details don't match an account." };
    await createSession(user);
  } catch (error) {
    console.error("[deedi] login failed:", error);
    return {
      error:
        "Could not reach the database. Check DATABASE_URL and SESSION_SECRET in .env.local.",
    };
  }

  // Only relative paths, so a crafted ?next= cannot bounce to another origin.
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* properties                                                          */
/* ------------------------------------------------------------------ */

export async function savePropertyAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = nullableInt(data, "id");
  const title = str(data, "title");
  if (!title) return { error: "A title is required." };

  const slug = slugify(str(data, "slug") || title);
  const images = list(data, "images");
  const heroImage = str(data, "hero_image") || images[0] || "";

  if (!heroImage) return { error: "Add at least one image." };

  const values = {
    slug,
    title,
    summary: str(data, "summary"),
    description: str(data, "description"),
    listing_type: str(data, "listing_type", "sale"),
    status: str(data, "status", "available"),
    price: decimal(data, "price"),
    price_qualifier: nullable(data, "price_qualifier"),
    rent_period: nullable(data, "rent_period"),
    bedrooms: int(data, "bedrooms"),
    bathrooms: int(data, "bathrooms"),
    receptions: int(data, "receptions"),
    floor_area_sqft: nullableInt(data, "floor_area_sqft"),
    property_type: str(data, "property_type", "House"),
    tenure: nullable(data, "tenure"),
    epc_rating: nullable(data, "epc_rating"),
    address_line: str(data, "address_line"),
    city: str(data, "city"),
    region: str(data, "region", "Greater Manchester"),
    postcode: str(data, "postcode"),
    features: list(data, "features"),
    images,
    hero_image: heroImage,
    featured: bool(data, "featured"),
    meta_title: nullable(data, "meta_title"),
    meta_description: nullable(data, "meta_description"),
  };

  try {
    if (id) {
      await sql`
        UPDATE properties SET
          slug = ${values.slug}, title = ${values.title}, summary = ${values.summary},
          description = ${values.description}, listing_type = ${values.listing_type},
          status = ${values.status}, price = ${values.price},
          price_qualifier = ${values.price_qualifier}, rent_period = ${values.rent_period},
          bedrooms = ${values.bedrooms}, bathrooms = ${values.bathrooms},
          receptions = ${values.receptions}, floor_area_sqft = ${values.floor_area_sqft},
          property_type = ${values.property_type}, tenure = ${values.tenure},
          epc_rating = ${values.epc_rating}, address_line = ${values.address_line},
          city = ${values.city}, region = ${values.region}, postcode = ${values.postcode},
          features = ${values.features}, images = ${values.images},
          hero_image = ${values.hero_image}, featured = ${values.featured},
          meta_title = ${values.meta_title}, meta_description = ${values.meta_description},
          updated_at = now()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO properties (
          slug, title, summary, description, listing_type, status, price,
          price_qualifier, rent_period, bedrooms, bathrooms, receptions,
          floor_area_sqft, property_type, tenure, epc_rating, address_line,
          city, region, postcode, features, images, hero_image, featured,
          meta_title, meta_description
        ) VALUES (
          ${values.slug}, ${values.title}, ${values.summary}, ${values.description},
          ${values.listing_type}, ${values.status}, ${values.price},
          ${values.price_qualifier}, ${values.rent_period}, ${values.bedrooms},
          ${values.bathrooms}, ${values.receptions}, ${values.floor_area_sqft},
          ${values.property_type}, ${values.tenure}, ${values.epc_rating},
          ${values.address_line}, ${values.city}, ${values.region}, ${values.postcode},
          ${values.features}, ${values.images}, ${values.hero_image}, ${values.featured},
          ${values.meta_title}, ${values.meta_description}
        )
      `;
    }
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("properties_slug_key")) {
      return { error: `The URL slug "${slug}" is already used by another property.` };
    }
    console.error("[deedi] save property failed:", error);
    return { error: "Could not save this property. Please try again." };
  }

  revalidatePath("/properties");
  revalidatePath(`/properties/${slug}`);
  revalidatePath("/admin/properties");
  revalidatePath("/");
  redirect("/admin/properties?saved=1");
}

export async function deletePropertyAction(data: FormData) {
  // Deleting is owner-only; managers edit and archive instead.
  await requireOwner();
  const id = nullableInt(data, "id");
  if (!id) return;

  await sql`DELETE FROM properties WHERE id = ${id}`;
  revalidatePath("/properties");
  revalidatePath("/admin/properties");
  revalidatePath("/");
}

/* ------------------------------------------------------------------ */
/* artworks                                                            */
/* ------------------------------------------------------------------ */

export async function saveArtworkAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = nullableInt(data, "id");
  const title = str(data, "title");
  if (!title) return { error: "A title is required." };

  const slug = slugify(str(data, "slug") || title);
  const images = list(data, "images");
  const heroImage = str(data, "hero_image") || images[0] || "";

  if (!heroImage) return { error: "Add at least one image." };

  const values = {
    slug,
    title,
    artist: str(data, "artist", "Deedi Studio"),
    summary: str(data, "summary"),
    description: str(data, "description"),
    category: str(data, "category", "Originals"),
    medium: str(data, "medium", "Mixed media"),
    status: str(data, "status", "available"),
    price: nullableDecimal(data, "price"),
    price_on_request: bool(data, "price_on_request"),
    width_cm: nullableInt(data, "width_cm"),
    height_cm: nullableInt(data, "height_cm"),
    year: nullableInt(data, "year"),
    edition: nullable(data, "edition"),
    framed: bool(data, "framed"),
    frame_detail: nullable(data, "frame_detail"),
    images,
    hero_image: heroImage,
    featured: bool(data, "featured"),
    meta_title: nullable(data, "meta_title"),
    meta_description: nullable(data, "meta_description"),
  };

  try {
    if (id) {
      await sql`
        UPDATE artworks SET
          slug = ${values.slug}, title = ${values.title}, artist = ${values.artist},
          summary = ${values.summary}, description = ${values.description},
          category = ${values.category}, medium = ${values.medium}, status = ${values.status},
          price = ${values.price}, price_on_request = ${values.price_on_request},
          width_cm = ${values.width_cm}, height_cm = ${values.height_cm},
          year = ${values.year}, edition = ${values.edition}, framed = ${values.framed},
          frame_detail = ${values.frame_detail}, images = ${values.images},
          hero_image = ${values.hero_image}, featured = ${values.featured},
          meta_title = ${values.meta_title}, meta_description = ${values.meta_description},
          updated_at = now()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO artworks (
          slug, title, artist, summary, description, category, medium, status,
          price, price_on_request, width_cm, height_cm, year, edition, framed,
          frame_detail, images, hero_image, featured, meta_title, meta_description
        ) VALUES (
          ${values.slug}, ${values.title}, ${values.artist}, ${values.summary},
          ${values.description}, ${values.category}, ${values.medium}, ${values.status},
          ${values.price}, ${values.price_on_request}, ${values.width_cm},
          ${values.height_cm}, ${values.year}, ${values.edition}, ${values.framed},
          ${values.frame_detail}, ${values.images}, ${values.hero_image},
          ${values.featured}, ${values.meta_title}, ${values.meta_description}
        )
      `;
    }
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("artworks_slug_key")) {
      return { error: `The URL slug "${slug}" is already used by another artwork.` };
    }
    console.error("[deedi] save artwork failed:", error);
    return { error: "Could not save this artwork. Please try again." };
  }

  revalidatePath("/art");
  revalidatePath(`/art/${slug}`);
  revalidatePath("/admin/art");
  revalidatePath("/");
  redirect("/admin/art?saved=1");
}

export async function deleteArtworkAction(data: FormData) {
  // Deleting is owner-only; managers edit and archive instead.
  await requireOwner();
  const id = nullableInt(data, "id");
  if (!id) return;

  await sql`DELETE FROM artworks WHERE id = ${id}`;
  revalidatePath("/art");
  revalidatePath("/admin/art");
  revalidatePath("/");
}

/* ------------------------------------------------------------------ */
/* blog                                                                */
/* ------------------------------------------------------------------ */

export async function savePostAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = nullableInt(data, "id");
  const title = str(data, "title");
  if (!title) return { error: "A title is required." };

  const content = str(data, "content");
  if (stripHtml(content).length < 20) {
    return { error: "Add some content before saving." };
  }

  const slug = slugify(str(data, "slug") || title);
  const status = str(data, "status", "draft");
  const excerpt = str(data, "excerpt") || truncate(stripHtml(content), 180);
  const publishedRaw = str(data, "published_at");

  const values = {
    slug,
    title,
    excerpt,
    content,
    cover_image: nullable(data, "cover_image"),
    category: str(data, "category", "Insights"),
    tags: list(data, "tags").map((tag) => tag.toLowerCase()),
    author: str(data, "author", "Deedi Ltd"),
    author_role: nullable(data, "author_role"),
    status,
    featured: bool(data, "featured"),
    reading_minutes: readingTime(content),
    meta_title: nullable(data, "meta_title"),
    meta_description: nullable(data, "meta_description") ?? truncate(excerpt, 158),
    focus_keyword: nullable(data, "focus_keyword"),
    canonical_url: nullable(data, "canonical_url"),
    og_image: nullable(data, "og_image") ?? nullable(data, "cover_image"),
    // Publishing without a date stamps it now; drafts keep whatever was set.
    published_at:
      publishedRaw || (status === "published" ? new Date().toISOString() : null),
  };

  try {
    if (id) {
      await sql`
        UPDATE blog_posts SET
          slug = ${values.slug}, title = ${values.title}, excerpt = ${values.excerpt},
          content = ${values.content}, cover_image = ${values.cover_image},
          category = ${values.category}, tags = ${values.tags}, author = ${values.author},
          author_role = ${values.author_role}, status = ${values.status},
          featured = ${values.featured}, reading_minutes = ${values.reading_minutes},
          meta_title = ${values.meta_title}, meta_description = ${values.meta_description},
          focus_keyword = ${values.focus_keyword}, canonical_url = ${values.canonical_url},
          og_image = ${values.og_image}, published_at = ${values.published_at},
          updated_at = now()
        WHERE id = ${id}
      `;
    } else {
      await sql`
        INSERT INTO blog_posts (
          slug, title, excerpt, content, cover_image, category, tags, author,
          author_role, status, featured, reading_minutes, meta_title,
          meta_description, focus_keyword, canonical_url, og_image, published_at
        ) VALUES (
          ${values.slug}, ${values.title}, ${values.excerpt}, ${values.content},
          ${values.cover_image}, ${values.category}, ${values.tags}, ${values.author},
          ${values.author_role}, ${values.status}, ${values.featured},
          ${values.reading_minutes}, ${values.meta_title}, ${values.meta_description},
          ${values.focus_keyword}, ${values.canonical_url}, ${values.og_image},
          ${values.published_at}
        )
      `;
    }
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("blog_posts_slug_key")) {
      return { error: `The URL slug "${slug}" is already used by another post.` };
    }
    console.error("[deedi] save post failed:", error);
    return { error: "Could not save this post. Please try again." };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  revalidatePath("/");
  redirect("/admin/blog?saved=1");
}

export async function deletePostAction(data: FormData) {
  // Deleting is owner-only; managers edit and archive instead.
  await requireOwner();
  const id = nullableInt(data, "id");
  if (!id) return;

  await sql`DELETE FROM blog_posts WHERE id = ${id}`;
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

/* ------------------------------------------------------------------ */
/* messages                                                            */
/* ------------------------------------------------------------------ */

const MESSAGE_STATUSES = new Set(["new", "read", "replied", "archived"]);

export async function updateMessageAction(data: FormData) {
  await requireAdmin();

  const id = nullableInt(data, "id");
  const status = str(data, "status");
  if (!id || !MESSAGE_STATUSES.has(status)) return;

  await sql`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`;
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function saveMessageNoteAction(data: FormData) {
  await requireAdmin();

  const id = nullableInt(data, "id");
  if (!id) return;

  await sql`UPDATE contact_messages SET admin_note = ${nullable(data, "admin_note")} WHERE id = ${id}`;
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(data: FormData) {
  // Deleting is owner-only; managers edit and archive instead.
  await requireOwner();

  const id = nullableInt(data, "id");
  if (!id) return;

  await sql`DELETE FROM contact_messages WHERE id = ${id}`;
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

/* ------------------------------------------------------------------ */
/* gallery                                                             */
/* ------------------------------------------------------------------ */

export async function saveGalleryItemAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = nullableInt(data, "id");
  const title = str(data, "title");
  const image = str(data, "image");

  if (!title || !image) return { error: "A title and an image are both required." };

  const values = {
    title,
    caption: nullable(data, "caption"),
    image,
    collection: str(data, "collection", "Property"),
    tags: list(data, "tags"),
    sort_order: int(data, "sort_order"),
  };

  if (id) {
    await sql`
      UPDATE gallery_items SET
        title = ${values.title}, caption = ${values.caption}, image = ${values.image},
        collection = ${values.collection}, tags = ${values.tags},
        sort_order = ${values.sort_order}
      WHERE id = ${id}
    `;
  } else {
    await sql`
      INSERT INTO gallery_items (title, caption, image, collection, tags, sort_order)
      VALUES (${values.title}, ${values.caption}, ${values.image},
              ${values.collection}, ${values.tags}, ${values.sort_order})
    `;
  }

  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: "Saved." };
}

export async function deleteGalleryItemAction(data: FormData) {
  // Deleting is owner-only; managers edit and archive instead.
  await requireOwner();
  const id = nullableInt(data, "id");
  if (!id) return;

  await sql`DELETE FROM gallery_items WHERE id = ${id}`;
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}


/* ------------------------------------------------------------------ */
/* team & account                                                      */
/* ------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared password rules for every place a password is set. */
function checkPassword(password: string, confirm: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[a-z]/i.test(password) || !/[0-9]/.test(password)) {
    return "Include at least one letter and one number.";
  }
  if (password !== confirm) {
    return "The two passwords don't match.";
  }
  return null;
}

/** Owner adds a colleague. Managers can edit content but not delete or manage the team. */
export async function createTeamMemberAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireOwner("/admin/team");

  const name = str(data, "name");
  const email = str(data, "email").toLowerCase();
  const role = str(data, "role", "manager");
  const password = str(data, "password");
  const confirm = str(data, "confirm_password");

  if (!name) return { error: "Enter their name." };
  if (!EMAIL_PATTERN.test(email)) return { error: "Enter a valid email address." };
  if (role !== "owner" && role !== "manager") return { error: "Pick a valid role." };

  const problem = checkPassword(password, confirm);
  if (problem) return { error: problem };

  try {
    await sql`
      INSERT INTO admin_users (email, name, role, password_hash)
      VALUES (${email}, ${name}, ${role}, ${await hashPassword(password)})
    `;
  } catch (error) {
    if ((error as Error).message.includes("admin_users_email_key")) {
      return { error: `${email} already has an account.` };
    }
    console.error("[deedi] create team member failed:", error);
    return { error: "Could not create that account. Please try again." };
  }

  revalidatePath("/admin/team");
  return { success: `${name} can now sign in.` };
}

/** Owner changes a colleague's name or role. */
export async function updateTeamMemberAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  const session = await requireOwner("/admin/team");

  const id = nullableInt(data, "id");
  const name = str(data, "name");
  const role = str(data, "role");

  if (!id) return { error: "That account no longer exists." };
  if (!name) return { error: "Enter their name." };
  if (role !== "owner" && role !== "manager") return { error: "Pick a valid role." };

  // Never let the last owner be demoted — that would lock everyone out of team management.
  if (role !== "owner") {
    const owners = await sql<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM admin_users WHERE role = 'owner' AND id <> ${id}
    `;
    if ((owners[0]?.count ?? 0) === 0) {
      return { error: "There must always be at least one owner." };
    }
  }

  await sql`UPDATE admin_users SET name = ${name}, role = ${role} WHERE id = ${id}`;

  revalidatePath("/admin/team");
  return {
    success:
      id === session.sub && role !== "owner"
        ? "Saved. You have removed your own owner access."
        : "Saved.",
  };
}

/** Owner sets a new password for a colleague who has been locked out. */
export async function resetMemberPasswordAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireOwner("/admin/team");

  const id = nullableInt(data, "id");
  const password = str(data, "password");
  const confirm = str(data, "confirm_password");

  if (!id) return { error: "That account no longer exists." };

  const problem = checkPassword(password, confirm);
  if (problem) return { error: problem };

  await sql`
    UPDATE admin_users SET password_hash = ${await hashPassword(password)} WHERE id = ${id}
  `;

  revalidatePath("/admin/team");
  return { success: "Password updated. Share it with them securely." };
}

/** Owner removes a colleague's access. */
export async function deleteTeamMemberAction(data: FormData) {
  const session = await requireOwner("/admin/team");

  const id = nullableInt(data, "id");
  if (!id || id === session.sub) return;

  const owners = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count FROM admin_users WHERE role = 'owner' AND id <> ${id}
  `;
  if ((owners[0]?.count ?? 0) === 0) return;

  await sql`DELETE FROM admin_users WHERE id = ${id}`;
  revalidatePath("/admin/team");
}

/** Anyone signed in changes their own password. */
export async function changePasswordAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  const session = await requireAdmin("/admin/account");

  const current = str(data, "current_password");
  const password = str(data, "password");
  const confirm = str(data, "confirm_password");

  if (!(await passwordMatches(session.sub, current))) {
    return { error: "Your current password is not correct." };
  }
  if (current === password) {
    return { error: "Choose a password different from your current one." };
  }

  const problem = checkPassword(password, confirm);
  if (problem) return { error: problem };

  await sql`
    UPDATE admin_users SET password_hash = ${await hashPassword(password)}
    WHERE id = ${session.sub}
  `;

  revalidatePath("/admin/account");
  return { success: "Password changed." };
}

/** Anyone signed in updates their own display name. */
export async function updateOwnProfileAction(
  _previous: ActionState,
  data: FormData,
): Promise<ActionState> {
  const session = await requireAdmin("/admin/account");

  const name = str(data, "name");
  if (!name) return { error: "Enter your name." };

  await sql`UPDATE admin_users SET name = ${name} WHERE id = ${session.sub}`;

  // Refresh the cookie so the sidebar shows the new name straight away.
  const rows = await sql<{
    id: number;
    email: string;
    name: string;
    role: "owner" | "manager";
    password_hash: string;
    last_login_at: string | null;
    created_at: string;
  }>`SELECT * FROM admin_users WHERE id = ${session.sub}`;

  if (rows[0]) await createSession(rows[0]);

  revalidatePath("/admin");
  revalidatePath("/admin/account");
  return { success: "Name updated." };
}

/** True when the signed-in account may delete content. */
export async function canDelete() {
  return (await currentRole()) === "owner";
}

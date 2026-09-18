import { cache } from "react";
import { sql } from "@/lib/db";
import type {
  AdminUser,
  Artwork,
  BlogPost,
  ContactMessage,
  GalleryItem,
  Property,
} from "@/lib/types";

/** Swallows a missing-table / missing-connection error so the site still renders. */
async function safe<T>(run: () => Promise<T[]>): Promise<T[]> {
  try {
    return await run();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[deedi] database query failed:", (error as Error).message);
    }
    return [];
  }
}

/** Builds an incrementing `$n` placeholder list for dynamic filters. */
function filterBuilder(initial: string[] = []) {
  const where = [...initial];
  const params: unknown[] = [];
  return {
    where,
    params,
    add(clause: string, value: unknown) {
      params.push(value);
      where.push(clause.replace("?", `$${params.length}`));
    },
    addRaw(build: (placeholder: string) => string, value: unknown) {
      params.push(value);
      where.push(build(`$${params.length}`));
    },
    sql() {
      return where.join(" AND ");
    },
  };
}

/* ------------------------------------------------------------------ */
/* properties                                                          */
/* ------------------------------------------------------------------ */

export interface PropertyFilters {
  listing?: string;
  type?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
  sort?: string;
  limit?: number;
}

const PROPERTY_SORTS: Record<string, string> = {
  "price-asc": "price ASC",
  "price-desc": "price DESC",
  "beds-desc": "bedrooms DESC, price DESC",
  oldest: "created_at ASC",
};

export const getProperties = cache(async (filters: PropertyFilters = {}) =>
  safe<Property>(() => {
    const f = filterBuilder(["status <> 'draft'"]);

    if (filters.listing) f.add("listing_type = ?", filters.listing);
    if (filters.type) f.add("property_type = ?", filters.type);
    if (filters.city) f.add("city = ?", filters.city);
    if (filters.minPrice) f.add("price >= ?", filters.minPrice);
    if (filters.maxPrice) f.add("price <= ?", filters.maxPrice);
    if (filters.bedrooms) f.add("bedrooms >= ?", filters.bedrooms);
    if (filters.search) {
      f.addRaw(
        (p) =>
          `(title ILIKE ${p} OR address_line ILIKE ${p} OR city ILIKE ${p} OR postcode ILIKE ${p} OR summary ILIKE ${p})`,
        `%${filters.search}%`,
      );
    }

    const order = PROPERTY_SORTS[filters.sort ?? ""] ?? "featured DESC, created_at DESC";
    const limit = filters.limit ? ` LIMIT ${Number(filters.limit)}` : "";

    return sql.query<Property>(
      `SELECT * FROM properties WHERE ${f.sql()} ORDER BY ${order}${limit}`,
      f.params,
    );
  }),
);

export const getFeaturedProperties = cache(async (limit = 6) =>
  safe<Property>(
    () => sql<Property>`
      SELECT * FROM properties
      WHERE status <> 'draft'
      ORDER BY featured DESC, created_at DESC
      LIMIT ${limit}
    `,
  ),
);

export const getPropertyBySlug = cache(async (slug: string) => {
  const rows = await safe<Property>(
    () => sql<Property>`SELECT * FROM properties WHERE slug = ${slug} LIMIT 1`,
  );
  return rows[0] ?? null;
});

export const getRelatedProperties = cache(async (id: number, city: string, limit = 3) =>
  safe<Property>(
    () => sql<Property>`
      SELECT * FROM properties
      WHERE id <> ${id} AND status <> 'draft'
      ORDER BY (city = ${city}) DESC, featured DESC, created_at DESC
      LIMIT ${limit}
    `,
  ),
);

export const getPropertyFacets = cache(async () => {
  const [cities, types] = await Promise.all([
    safe<{ city: string }>(
      () => sql<{ city: string }>`
        SELECT DISTINCT city FROM properties WHERE status <> 'draft' ORDER BY city
      `,
    ),
    safe<{ property_type: string }>(
      () => sql<{ property_type: string }>`
        SELECT DISTINCT property_type FROM properties WHERE status <> 'draft' ORDER BY property_type
      `,
    ),
  ]);
  return {
    cities: cities.map((c) => c.city),
    types: types.map((t) => t.property_type),
  };
});

/* ------------------------------------------------------------------ */
/* artworks                                                            */
/* ------------------------------------------------------------------ */

export interface ArtFilters {
  category?: string;
  medium?: string;
  status?: string;
  search?: string;
  sort?: string;
  limit?: number;
}

const ART_SORTS: Record<string, string> = {
  "price-asc": "price ASC NULLS LAST",
  "price-desc": "price DESC NULLS LAST",
  "title-asc": "title ASC",
  oldest: "created_at ASC",
};

export const getArtworks = cache(async (filters: ArtFilters = {}) =>
  safe<Artwork>(() => {
    const f = filterBuilder(["status <> 'draft'"]);

    if (filters.category) f.add("category = ?", filters.category);
    if (filters.medium) f.add("medium = ?", filters.medium);
    if (filters.status) f.add("status = ?", filters.status);
    if (filters.search) {
      f.addRaw(
        (p) => `(title ILIKE ${p} OR artist ILIKE ${p} OR summary ILIKE ${p} OR medium ILIKE ${p})`,
        `%${filters.search}%`,
      );
    }

    const order = ART_SORTS[filters.sort ?? ""] ?? "featured DESC, created_at DESC";
    const limit = filters.limit ? ` LIMIT ${Number(filters.limit)}` : "";

    return sql.query<Artwork>(
      `SELECT * FROM artworks WHERE ${f.sql()} ORDER BY ${order}${limit}`,
      f.params,
    );
  }),
);

export const getFeaturedArtworks = cache(async (limit = 6) =>
  safe<Artwork>(
    () => sql<Artwork>`
      SELECT * FROM artworks
      WHERE status <> 'draft'
      ORDER BY featured DESC, created_at DESC
      LIMIT ${limit}
    `,
  ),
);

export const getArtworkBySlug = cache(async (slug: string) => {
  const rows = await safe<Artwork>(
    () => sql<Artwork>`SELECT * FROM artworks WHERE slug = ${slug} LIMIT 1`,
  );
  return rows[0] ?? null;
});

export const getRelatedArtworks = cache(async (id: number, category: string, limit = 3) =>
  safe<Artwork>(
    () => sql<Artwork>`
      SELECT * FROM artworks
      WHERE id <> ${id} AND status <> 'draft'
      ORDER BY (category = ${category}) DESC, featured DESC, created_at DESC
      LIMIT ${limit}
    `,
  ),
);

export const getArtFacets = cache(async () => {
  const [categories, mediums] = await Promise.all([
    safe<{ category: string }>(
      () => sql<{ category: string }>`
        SELECT DISTINCT category FROM artworks WHERE status <> 'draft' ORDER BY category
      `,
    ),
    safe<{ medium: string }>(
      () => sql<{ medium: string }>`
        SELECT DISTINCT medium FROM artworks WHERE status <> 'draft' ORDER BY medium
      `,
    ),
  ]);
  return {
    categories: categories.map((c) => c.category),
    mediums: mediums.map((m) => m.medium),
  };
});

/* ------------------------------------------------------------------ */
/* blog                                                                */
/* ------------------------------------------------------------------ */

export const getPosts = cache(
  async (opts: { category?: string; search?: string; limit?: number; tag?: string } = {}) =>
    safe<BlogPost>(() => {
      const f = filterBuilder(["status = 'published'"]);

      if (opts.category) f.add("category = ?", opts.category);
      if (opts.tag) f.addRaw((p) => `${p} = ANY(tags)`, opts.tag);
      if (opts.search) {
        f.addRaw((p) => `(title ILIKE ${p} OR excerpt ILIKE ${p})`, `%${opts.search}%`);
      }

      const limit = opts.limit ? ` LIMIT ${Number(opts.limit)}` : "";
      return sql.query<BlogPost>(
        `SELECT * FROM blog_posts WHERE ${f.sql()}
         ORDER BY featured DESC, published_at DESC NULLS LAST${limit}`,
        f.params,
      );
    }),
);

export const getPostBySlug = cache(async (slug: string) => {
  const rows = await safe<BlogPost>(
    () => sql<BlogPost>`
      SELECT * FROM blog_posts WHERE slug = ${slug} AND status = 'published' LIMIT 1
    `,
  );
  return rows[0] ?? null;
});

export const getRelatedPosts = cache(async (id: number, category: string, limit = 3) =>
  safe<BlogPost>(
    () => sql<BlogPost>`
      SELECT * FROM blog_posts
      WHERE id <> ${id} AND status = 'published'
      ORDER BY (category = ${category}) DESC, published_at DESC
      LIMIT ${limit}
    `,
  ),
);

export const getPostCategories = cache(async () =>
  safe<{ category: string; count: number }>(
    () => sql<{ category: string; count: number }>`
      SELECT category, COUNT(*)::int AS count FROM blog_posts
      WHERE status = 'published' GROUP BY category ORDER BY count DESC
    `,
  ),
);

export const getPostTags = cache(async () => {
  const rows = await safe<{ tag: string }>(
    () => sql<{ tag: string }>`
      SELECT DISTINCT unnest(tags) AS tag FROM blog_posts
      WHERE status = 'published' ORDER BY tag
    `,
  );
  return rows.map((r) => r.tag);
});

/* ------------------------------------------------------------------ */
/* gallery                                                             */
/* ------------------------------------------------------------------ */

export const getGalleryItems = cache(async (collection?: string) =>
  safe<GalleryItem>(() =>
    collection
      ? sql<GalleryItem>`
          SELECT * FROM gallery_items WHERE collection = ${collection} ORDER BY sort_order, id
        `
      : sql<GalleryItem>`SELECT * FROM gallery_items ORDER BY sort_order, id`,
  ),
);

export const getGalleryCollections = cache(async () => {
  const rows = await safe<{ collection: string }>(
    () => sql<{ collection: string }>`
      SELECT DISTINCT collection FROM gallery_items ORDER BY collection
    `,
  );
  return rows.map((r) => r.collection);
});

/* ------------------------------------------------------------------ */
/* admin                                                               */
/* ------------------------------------------------------------------ */

interface Tally {
  total: number;
  active: number;
}

export async function getAdminStats() {
  const [props, art, posts, messages] = await Promise.all([
    safe<Tally>(
      () => sql<Tally>`
        SELECT COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE status = 'available')::int AS active
        FROM properties
      `,
    ),
    safe<Tally>(
      () => sql<Tally>`
        SELECT COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE status = 'available')::int AS active
        FROM artworks
      `,
    ),
    safe<Tally>(
      () => sql<Tally>`
        SELECT COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE status = 'published')::int AS active
        FROM blog_posts
      `,
    ),
    safe<Tally>(
      () => sql<Tally>`
        SELECT COUNT(*)::int AS total,
               COUNT(*) FILTER (WHERE status = 'new')::int AS active
        FROM contact_messages
      `,
    ),
  ]);

  const empty: Tally = { total: 0, active: 0 };
  return {
    properties: props[0] ?? empty,
    artworks: art[0] ?? empty,
    posts: posts[0] ?? empty,
    messages: messages[0] ?? empty,
  };
}

export async function getAllProperties() {
  return safe<Property>(() => sql<Property>`SELECT * FROM properties ORDER BY updated_at DESC`);
}

export async function getAllArtworks() {
  return safe<Artwork>(() => sql<Artwork>`SELECT * FROM artworks ORDER BY updated_at DESC`);
}

export async function getAllPosts() {
  return safe<BlogPost>(() => sql<BlogPost>`SELECT * FROM blog_posts ORDER BY updated_at DESC`);
}

export async function getMessages(status?: string) {
  return safe<ContactMessage>(() =>
    status && status !== "all"
      ? sql<ContactMessage>`
          SELECT * FROM contact_messages WHERE status = ${status} ORDER BY created_at DESC
        `
      : sql<ContactMessage>`SELECT * FROM contact_messages ORDER BY created_at DESC`,
  );
}

export async function getRecentMessages(limit = 5) {
  return safe<ContactMessage>(
    () => sql<ContactMessage>`
      SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ${limit}
    `,
  );
}

export async function getPropertyById(id: number) {
  const rows = await safe<Property>(
    () => sql<Property>`SELECT * FROM properties WHERE id = ${id}`,
  );
  return rows[0] ?? null;
}

export async function getArtworkById(id: number) {
  const rows = await safe<Artwork>(() => sql<Artwork>`SELECT * FROM artworks WHERE id = ${id}`);
  return rows[0] ?? null;
}

export async function getPostById(id: number) {
  const rows = await safe<BlogPost>(
    () => sql<BlogPost>`SELECT * FROM blog_posts WHERE id = ${id}`,
  );
  return rows[0] ?? null;
}


/* ------------------------------------------------------------------ */
/* team                                                                */
/* ------------------------------------------------------------------ */

export type TeamMember = Omit<AdminUser, "password_hash">;

export async function getTeamMembers() {
  return safe<TeamMember>(
    () => sql<TeamMember>`
      SELECT id, email, name, role, last_login_at, created_at
      FROM admin_users
      ORDER BY (role = 'owner') DESC, name
    `,
  );
}

export async function getTeamMemberById(id: number) {
  const rows = await safe<TeamMember>(
    () => sql<TeamMember>`
      SELECT id, email, name, role, last_login_at, created_at
      FROM admin_users WHERE id = ${id}
    `,
  );
  return rows[0] ?? null;
}

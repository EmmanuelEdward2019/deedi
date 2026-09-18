export type ListingType = "sale" | "rent";
export type PropertyStatus = "available" | "under_offer" | "let_agreed" | "sold" | "draft";
export type ArtStatus = "available" | "reserved" | "sold" | "draft";
export type PostStatus = "draft" | "published";
export type MessageStatus = "new" | "read" | "replied" | "archived";

/** "owner" has full control; "manager" can create and edit but not delete or manage the team. */
export type AdminRole = "owner" | "manager";

/**
 * Postgres timestamps arrive from the Neon driver as Date objects, but are
 * plain strings once a payload has crossed a server/client boundary. Anything
 * reading a timestamp must cope with both.
 */
export type Timestamp = string | Date;

export interface Property {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  listing_type: ListingType;
  status: PropertyStatus;
  price: number;
  price_qualifier: string | null;
  rent_period: string | null;
  bedrooms: number;
  bathrooms: number;
  receptions: number;
  floor_area_sqft: number | null;
  property_type: string;
  tenure: string | null;
  epc_rating: string | null;
  address_line: string;
  city: string;
  region: string;
  postcode: string;
  latitude: string | null;
  longitude: string | null;
  features: string[];
  images: string[];
  hero_image: string;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Artwork {
  id: number;
  slug: string;
  title: string;
  artist: string;
  summary: string;
  description: string;
  category: string;
  medium: string;
  status: ArtStatus;
  price: number | null;
  price_on_request: boolean;
  width_cm: number | null;
  height_cm: number | null;
  year: number | null;
  edition: string | null;
  framed: boolean;
  frame_detail: string | null;
  images: string[];
  hero_image: string;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  author_role: string | null;
  status: PostStatus;
  featured: boolean;
  reading_minutes: number;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_image: string | null;
  views: number;
  published_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  enquiry_type: string;
  message: string;
  source_page: string | null;
  related_ref: string | null;
  status: MessageStatus;
  admin_note: string | null;
  created_at: Timestamp;
}

export interface GalleryItem {
  id: number;
  title: string;
  caption: string | null;
  image: string;
  collection: string;
  tags: string[];
  sort_order: number;
  created_at: Timestamp;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  password_hash: string;
  last_login_at: Timestamp | null;
  created_at: Timestamp;
}

export interface Subscriber {
  id: number;
  email: string;
  source: string | null;
  created_at: Timestamp;
}

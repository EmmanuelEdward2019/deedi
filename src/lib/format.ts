/**
 * Dates are presented in UK time regardless of where the code runs, so a post
 * published on the 28th never renders as the 27th because the host region
 * happens to sit behind UTC.
 */
const UK_TIME_ZONE = "Europe/London";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "POA";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "POA";
  return gbp.format(n);
}

export function formatRent(value: number | string, period: string | null) {
  const base = formatPrice(value);
  return period ? `${base} ${period}` : base;
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: UK_TIME_ZONE,
  });
}

export function formatShortDate(value: string | Date | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: UK_TIME_ZONE,
  });
}

export function formatRelative(value: string | Date | null | undefined) {
  if (!value) return "";
  const then = new Date(value).getTime();
  const mins = Math.round((Date.now() - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatShortDate(value);
}

/**
 * Machine-readable ISO 8601, for <time dateTime>, Open Graph and JSON-LD.
 * Accepts the Date objects the database driver returns as well as strings.
 */
export function toISO(value: string | Date | null | undefined) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function formatNumber(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(n) ? new Intl.NumberFormat("en-GB").format(n) : "0";
}

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  under_offer: "Under Offer",
  let_agreed: "Let Agreed",
  sold: "Sold",
  reserved: "Reserved",
  draft: "Draft",
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
  published: "Published",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Strips HTML down to readable text — used for excerpts and meta descriptions. */
export function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTime(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function truncate(value: string, length = 160) {
  const clean = value.trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length - 1).replace(/\s+\S*$/, "")}…`;
}

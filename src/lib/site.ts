/** Single source of truth for brand, contact details and navigation. */

const FALLBACK_URL = "https://deedi.co.uk";

/**
 * Normalises NEXT_PUBLIC_SITE_URL into an absolute origin.
 *
 * A bare domain ("deediltd.co.uk") is the easy mistake to make when filling in
 * a hosting dashboard, and `new URL()` throws on it — which would otherwise
 * fail the whole build. Assume https, drop any trailing slash, and fall back to
 * the canonical domain if the value is unusable.
 */
function siteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_URL;

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(withScheme);
    return `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}`;
  } catch {
    return FALLBACK_URL;
  }
}

export const site = {
  name: "Deedi Ltd",
  legalName: "Deedi Limited",
  tagline: "Property. Art. Lasting Value.",
  description:
    "Deedi Ltd manages, lets and sells residential property across Greater Manchester and the North West, and curates original art for the spaces people live and work in.",
  url: siteUrl(),
  locale: "en_GB",
  currency: "GBP",

  contact: {
    phone: "+44 1204 900 200",
    phoneHref: "tel:+441204900200",
    whatsapp: "447440000000", // digits only, international format
    whatsappMessage: "Hello Deedi Ltd, I'd like to enquire about",
    email: "hello@deedi.co.uk",
    salesEmail: "sales@deedi.co.uk",
    address: {
      street: "Churchgate House, Knowsley Street",
      city: "Bolton",
      region: "Greater Manchester",
      postcode: "BL1 2AS",
      country: "United Kingdom",
    },
    hours: [
      { days: "Monday – Friday", time: "9:00am – 6:00pm" },
      { days: "Saturday", time: "10:00am – 3:00pm" },
      { days: "Sunday", time: "Closed" },
    ],
  },

  social: {
    instagram: "https://instagram.com/deedi.ltd",
    facebook: "https://facebook.com/deediltd",
    linkedin: "https://linkedin.com/company/deedi-ltd",
    x: "https://x.com/deediltd",
  },

  /**
   * Trustpilot TrustBox widgets. Both values come from Trustpilot Business →
   * Integrations → TrustBox. Until the business unit ID is set, no widget —
   * and no Trustpilot script — is rendered anywhere on the site.
   */
  trustpilot: {
    businessUnitId: process.env.NEXT_PUBLIC_TRUSTPILOT_BUSINESS_UNIT_ID?.trim() ?? "",
    reviewUrl: `https://uk.trustpilot.com/review/${
      process.env.NEXT_PUBLIC_TRUSTPILOT_DOMAIN?.trim() || "deedi.co.uk"
    }`,
  },

  stats: [
    { value: "450+", label: "Properties under management" },
    { value: "18", label: "Years in the North West" },
    { value: "98%", label: "Occupancy across portfolio" },
    { value: "300+", label: "Original works placed" },
  ],
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Property" },
  { href: "/art", label: "Art" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerNav = {
  Property: [
    { href: "/properties", label: "Browse properties" },
    { href: "/properties?listing=sale", label: "For sale" },
    { href: "/properties?listing=rent", label: "To let" },
    { href: "/services#management", label: "Property management" },
    { href: "/services#investment", label: "Investment & sourcing" },
  ],
  Art: [
    { href: "/art", label: "Art collection" },
    { href: "/art?category=Originals", label: "Original works" },
    { href: "/art?category=Limited%20Edition", label: "Limited editions" },
    { href: "/services#interiors", label: "Interior decoration" },
    { href: "/services#commission", label: "Commissions" },
  ],
  Company: [
    { href: "/about", label: "About Deedi" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Journal" },
    { href: "/contact", label: "Contact us" },
    { href: "/privacy", label: "Privacy policy" },
    { href: "/terms", label: "Terms of use" },
  ],
} as const;

/** Builds a prefilled WhatsApp deep link. */
export function whatsappLink(context?: string) {
  const text = context
    ? `${site.contact.whatsappMessage} ${context}.`
    : `${site.contact.whatsappMessage} your services.`;
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

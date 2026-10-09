import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { RevealProvider } from "@/components/reveal";
import { site } from "@/lib/site";
import "./globals.css";

/*
  Fonts are self-hosted rather than fetched from Google at build time: it keeps
  builds reproducible and offline-capable, removes a third-party request for
  visitors, and avoids a build failure whenever fonts.googleapis.com hiccups.

  Both files are variable (the full weight axis in one file) and carry the latin
  subset, which covers every character this site renders. Symbols such as arrows
  fall back to a system font, exactly as they did when served by Google, whose
  Inter subsets do not include them either.
*/
const inter = localFont({
  src: [{ path: "./fonts/inter-latin.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "sans-serif"],
});

const playfair = localFont({
  src: [{ path: "./fonts/playfair-display-latin.woff2", weight: "400 900", style: "normal" }],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "property management Bolton",
    "letting agent Greater Manchester",
    "houses for sale Bolton",
    "buy to let investment North West",
    "original art for sale UK",
    "bespoke art and interior decoration",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/images/properties/bolton-aerial.jpeg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/images/properties/bolton-aerial.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1d42",
  width: "device-width",
  initialScale: 1,
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.legalName,
  url: site.url,
  logo: `${site.url}/images/brand/deedi-emblem.png`,
  image: `${site.url}/images/properties/bolton-aerial.jpeg`,
  description: site.description,
  telephone: site.contact.phone,
  email: [site.contact.email, site.contact.infoEmail],
  priceRange: "££",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address.street,
    addressLocality: site.contact.address.city,
    addressRegion: site.contact.address.region,
    postalCode: site.contact.address.postcode,
    addressCountry: "GB",
  },
  areaServed: ["Bolton", "Salford", "Manchester", "Greater Manchester", "North West England"],
  sameAs: Object.values(site.social),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "15:00",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
      Browser extensions (Grammarly, password managers, dark-mode tools) inject
      attributes onto <html> and <body> before React hydrates. suppressHydrationWarning
      applies one level deep only, so genuine mismatches inside the app still surface.
    */
    <html
      lang="en-GB"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          // Structured data for search engines — static, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
        <RevealProvider />
        {children}
      </body>
    </html>
  );
}

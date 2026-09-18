import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { RevealProvider } from "@/components/reveal";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
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
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
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
  logo: `${site.url}/images/brand/deedi-logo.png`,
  image: `${site.url}/images/properties/bolton-aerial.jpeg`,
  description: site.description,
  telephone: site.contact.phone,
  email: site.contact.email,
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

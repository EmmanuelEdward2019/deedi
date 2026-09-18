import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/media-gallery";
import { PropertyCard } from "@/components/property-card";
import { EnquiryForm } from "@/components/enquiry-form";
import {
  Badge,
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
  StatusBadge,
} from "@/components/ui";
import {
  Bath,
  Bed,
  Check,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Shield,
  Sofa,
  WhatsApp,
} from "@/components/icons";
import { getProperties, getPropertyBySlug, getRelatedProperties } from "@/lib/queries";
import { formatPrice, formatRent, truncate } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const properties = await getProperties({});
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };

  const price =
    property.listing_type === "rent"
      ? formatRent(property.price, property.rent_period)
      : formatPrice(property.price);

  const title = property.meta_title ?? `${property.title}, ${property.city} — ${price}`;
  const description = property.meta_description ?? truncate(property.summary, 158);

  return {
    title,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${site.url}/properties/${property.slug}`,
      images: [{ url: property.hero_image, width: 1200, height: 900, alt: property.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [property.hero_image] },
  };
}

export default async function PropertyDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const related = await getRelatedProperties(property.id, property.city);

  const price =
    property.listing_type === "rent"
      ? formatRent(property.price, property.rent_period)
      : formatPrice(property.price);

  const specs = [
    { Icon: Bed, label: "Bedrooms", value: property.bedrooms },
    { Icon: Bath, label: "Bathrooms", value: property.bathrooms },
    { Icon: Sofa, label: "Receptions", value: property.receptions },
    {
      Icon: Ruler,
      label: "Floor area",
      value: property.floor_area_sqft ? `${property.floor_area_sqft.toLocaleString("en-GB")} sq ft` : null,
    },
  ].filter((spec) => spec.value !== 0 && spec.value !== null);

  const details = [
    { label: "Property type", value: property.property_type },
    { label: "Tenure", value: property.tenure },
    { label: "EPC rating", value: property.epc_rating },
    { label: "Postcode", value: property.postcode },
    { label: "Status", value: null },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": property.listing_type === "rent" ? "Apartment" : "SingleFamilyResidence",
    name: property.title,
    description: truncate(property.summary, 300),
    url: `${site.url}/properties/${property.slug}`,
    image: property.images.map((image) => `${site.url}${image}`),
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address_line,
      addressLocality: property.city,
      addressRegion: property.region,
      postalCode: property.postcode,
      addressCountry: "GB",
    },
    ...(property.floor_area_sqft
      ? { floorSize: { "@type": "QuantitativeValue", value: property.floor_area_sqft, unitCode: "FTK" } }
      : {}),
    offers: {
      "@type": "Offer",
      price: Number(property.price),
      priceCurrency: "GBP",
      availability:
        property.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      seller: { "@type": "RealEstateAgent", name: site.legalName },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Property", item: `${site.url}/properties` },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: `${site.url}/properties/${property.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb bar */}
      <div className="border-b border-sand-200 bg-sand-50">
        <Container>
          <nav aria-label="Breadcrumb" className="py-4">
            <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] text-slate-500">
              <li>
                <Link href="/" className="transition-colors hover:text-gold-600">
                  Home
                </Link>
              </li>
              <li className="text-gold-500">/</li>
              <li>
                <Link href="/properties" className="transition-colors hover:text-gold-600">
                  Property
                </Link>
              </li>
              <li className="text-gold-500">/</li>
              <li className="text-navy-800">{property.title}</li>
            </ol>
          </nav>
        </Container>
      </div>

      <Section tone="light" className="py-10 sm:py-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            {/* ---------------- main column ---------------- */}
            <div className="lg:col-span-8">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Badge tone="navy">{property.listing_type === "rent" ? "To Let" : "For Sale"}</Badge>
                <StatusBadge status={property.status} />
                {property.featured && <Badge tone="gold">Featured</Badge>}
              </div>

              <h1 className="font-display text-3xl leading-tight text-navy-900 balance sm:text-4xl lg:text-[2.75rem]">
                {property.title}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-[0.9375rem] text-slate-600">
                <MapPin className="size-4 text-gold-500" />
                {property.address_line}, {property.city}, {property.postcode}
              </p>

              <div className="mt-8">
                <MediaGallery images={property.images} alt={property.title} />
              </div>

              {/* Key specs */}
              <dl className="mt-8 grid grid-cols-2 gap-px border border-sand-200 bg-sand-200 sm:grid-cols-4">
                {specs.map(({ Icon, label, value }) => (
                  <div key={label} className="bg-white px-5 py-6 text-center">
                    <Icon className="mx-auto size-5 text-royal-600" />
                    <dd className="font-display mt-3 text-xl text-navy-900">{value}</dd>
                    <dt className="mt-1 text-[0.6875rem] tracking-[0.12em] text-slate-500 uppercase">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>

              {/* Description */}
              <div className="mt-12">
                <Eyebrow className="rule-gold">About this property</Eyebrow>
                <p className="mt-6 text-lg leading-relaxed text-navy-800 pretty">{property.summary}</p>
                <div
                  className="prose-deedi mt-6"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div className="mt-12">
                  <Eyebrow className="rule-gold">Key features</Eyebrow>
                  <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {property.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[0.9375rem] text-navy-800">
                        <Check className="mt-0.5 size-4 shrink-0 text-gold-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Details table */}
              <div className="mt-12">
                <Eyebrow className="rule-gold">Property details</Eyebrow>
                <dl className="mt-6 divide-y divide-sand-200 border-y border-sand-200">
                  {details.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-6 py-3.5">
                      <dt className="text-sm text-slate-500">{row.label}</dt>
                      <dd className="text-sm font-medium text-navy-900">
                        {row.label === "Status" ? <StatusBadge status={property.status} /> : (row.value ?? "—")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* ---------------- sidebar ---------------- */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="surface-navy p-7">
                  <p className="text-[0.6875rem] tracking-[0.14em] text-gold-300 uppercase">
                    {property.listing_type === "rent" ? "Rent" : property.price_qualifier ?? "Price"}
                  </p>
                  <p className="font-display mt-2 text-4xl text-white">{price}</p>

                  {property.listing_type === "rent" && (
                    <p className="mt-2 text-xs text-white/50">
                      Deposit and referencing terms confirmed on application.
                    </p>
                  )}

                  <div className="my-6 h-px bg-white/15" />

                  <div className="space-y-2.5">
                    <a
                      href={whatsappLink(`${property.title} in ${property.city}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2.5 bg-[#25D366] px-5 py-3.5 text-[0.75rem] font-semibold tracking-[0.13em] text-white uppercase transition-colors hover:bg-[#1eb855]"
                    >
                      <WhatsApp className="size-4" />
                      Enquire on WhatsApp
                    </a>
                    <a
                      href={site.contact.phoneHref}
                      className="flex w-full items-center justify-center gap-2.5 bg-gold-500 px-5 py-3.5 text-[0.75rem] font-semibold tracking-[0.13em] text-white uppercase transition-colors hover:bg-gold-600"
                    >
                      <Phone className="size-4" />
                      {site.contact.phone}
                    </a>
                    <a
                      href={`mailto:${site.contact.salesEmail}?subject=${encodeURIComponent(property.title)}`}
                      className="flex w-full items-center justify-center gap-2.5 border border-white/25 px-5 py-3.5 text-[0.75rem] font-semibold tracking-[0.13em] text-white uppercase transition-colors hover:border-gold-400 hover:text-gold-300"
                    >
                      <Mail className="size-4" />
                      Email us
                    </a>
                  </div>

                  <p className="mt-6 flex items-start gap-2.5 text-xs leading-relaxed text-white/45">
                    <Shield className="mt-px size-4 shrink-0 text-gold-400" />
                    Client money protected. Member of a government-approved redress scheme.
                  </p>
                </div>

                <div className="mt-6 border border-sand-200 bg-sand-50 p-7">
                  <h2 className="font-display text-xl text-navy-900">Book a viewing</h2>
                  <p className="mt-1.5 text-sm text-slate-600">
                    Tell us when suits and we will confirm by return.
                  </p>
                  <div className="mt-5">
                    <EnquiryForm
                      enquiryType="property"
                      relatedRef={property.slug}
                      subject={`Viewing request — ${property.title}`}
                      defaultMessage={`I'd like to arrange a viewing of ${property.title}, ${property.city}.`}
                      submitLabel="Request viewing"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="sand">
          <Container>
            <SectionHeading
              eyebrow="You may also like"
              title="Similar properties"
              action={
                <ButtonLink href="/properties" tone="outline" arrow>
                  All properties
                </ButtonLink>
              }
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} className="reveal" />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

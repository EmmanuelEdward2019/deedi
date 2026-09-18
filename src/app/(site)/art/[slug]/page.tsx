import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaGallery } from "@/components/media-gallery";
import { ArtCard } from "@/components/art-card";
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
import { Frame, Mail, Phone, Shield, Sparkle, WhatsApp } from "@/components/icons";
import { getArtworkBySlug, getArtworks, getRelatedArtworks } from "@/lib/queries";
import { formatPrice, truncate } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const artworks = await getArtworks({});
  return artworks.map((artwork) => ({ slug: artwork.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return { title: "Artwork not found" };

  const title = artwork.meta_title ?? `${artwork.title} by ${artwork.artist}`;
  const description = artwork.meta_description ?? truncate(artwork.summary, 158);

  return {
    title,
    description,
    alternates: { canonical: `/art/${artwork.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${site.url}/art/${artwork.slug}`,
      images: [{ url: artwork.hero_image, width: 1200, height: 1500, alt: artwork.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [artwork.hero_image] },
  };
}

export default async function ArtworkDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) notFound();

  const related = await getRelatedArtworks(artwork.id, artwork.category);
  const price = artwork.price_on_request ? "Price on request" : formatPrice(artwork.price);

  const details = [
    { label: "Artist", value: artwork.artist },
    { label: "Medium", value: artwork.medium },
    {
      label: "Dimensions",
      value:
        artwork.width_cm && artwork.height_cm
          ? `${artwork.width_cm} × ${artwork.height_cm} cm`
          : null,
    },
    { label: "Year", value: artwork.year },
    { label: "Edition", value: artwork.edition },
    { label: "Framing", value: artwork.frame_detail ?? (artwork.framed ? "Framed" : "Unframed") },
    { label: "Category", value: artwork.category },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    description: truncate(artwork.summary, 300),
    url: `${site.url}/art/${artwork.slug}`,
    image: artwork.images.map((image) => `${site.url}${image}`),
    artform: artwork.category,
    artMedium: artwork.medium,
    creator: { "@type": "Person", name: artwork.artist },
    ...(artwork.year ? { dateCreated: String(artwork.year) } : {}),
    ...(artwork.width_cm
      ? { width: { "@type": "QuantitativeValue", value: artwork.width_cm, unitCode: "CMT" } }
      : {}),
    ...(artwork.height_cm
      ? { height: { "@type": "QuantitativeValue", value: artwork.height_cm, unitCode: "CMT" } }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      ...(artwork.price ? { price: Number(artwork.price) } : {}),
      availability:
        artwork.status === "available"
          ? "https://schema.org/InStock"
          : artwork.status === "sold"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/LimitedAvailability",
      seller: { "@type": "Organization", name: site.legalName },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

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
                <Link href="/art" className="transition-colors hover:text-gold-600">
                  Art
                </Link>
              </li>
              <li className="text-gold-500">/</li>
              <li className="text-navy-800">{artwork.title}</li>
            </ol>
          </nav>
        </Container>
      </div>

      <Section tone="light" className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <MediaGallery images={artwork.images} alt={artwork.title} aspect="aspect-[4/5]" />
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <Badge tone="navy">{artwork.category}</Badge>
                  <StatusBadge status={artwork.status} />
                </div>

                <h1 className="font-display text-3xl leading-tight text-navy-900 balance sm:text-4xl lg:text-[2.75rem]">
                  {artwork.title}
                </h1>
                <p className="mt-2 text-[1.0625rem] text-slate-500">{artwork.artist}</p>

                <p className="font-display mt-6 text-3xl text-gold-600">{price}</p>

                <p className="mt-6 text-[1.0625rem] leading-relaxed text-navy-800 pretty">
                  {artwork.summary}
                </p>

                <dl className="mt-8 divide-y divide-sand-200 border-y border-sand-200">
                  {details
                    .filter((row) => row.value)
                    .map((row) => (
                      <div key={row.label} className="flex items-start justify-between gap-6 py-3">
                        <dt className="text-sm text-slate-500">{row.label}</dt>
                        <dd className="max-w-[60%] text-right text-sm font-medium text-navy-900">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                </dl>

                <div className="mt-8 space-y-2.5">
                  <a
                    href={whatsappLink(`"${artwork.title}" by ${artwork.artist}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 bg-[#25D366] px-5 py-4 text-[0.75rem] font-semibold tracking-[0.13em] text-white uppercase transition-colors hover:bg-[#1eb855]"
                  >
                    <WhatsApp className="size-4" />
                    Enquire on WhatsApp
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={site.contact.phoneHref}
                      className="flex items-center justify-center gap-2 bg-navy-900 px-4 py-4 text-[0.75rem] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-navy-800"
                    >
                      <Phone className="size-4" />
                      Call
                    </a>
                    <a
                      href={`mailto:${site.contact.salesEmail}?subject=${encodeURIComponent(artwork.title)}`}
                      className="flex items-center justify-center gap-2 border border-navy-900/20 px-4 py-4 text-[0.75rem] font-semibold tracking-[0.12em] text-navy-900 uppercase transition-colors hover:border-gold-500 hover:text-gold-600"
                    >
                      <Mail className="size-4" />
                      Email
                    </a>
                  </div>
                </div>

                <ul className="mt-8 space-y-3 border-t border-sand-200 pt-6 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <Frame className="mt-0.5 size-4 shrink-0 text-gold-500" />
                    Framed, delivered and hung by us across the North West.
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="mt-0.5 size-4 shrink-0 text-gold-500" />
                    Certificate of authenticity supplied with every original.
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkle className="mt-0.5 size-4 shrink-0 text-gold-500" />
                    Free placement consultation before you commit.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Long description */}
          <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow className="rule-gold">About the work</Eyebrow>
              <div
                className="prose-deedi mt-6"
                dangerouslySetInnerHTML={{ __html: artwork.description }}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="border border-sand-200 bg-sand-50 p-7">
                <h2 className="font-display text-xl text-navy-900">Enquire about this piece</h2>
                <p className="mt-1.5 text-sm text-slate-600">
                  Availability, viewing in person, or a similar commission.
                </p>
                <div className="mt-5">
                  <EnquiryForm
                    enquiryType="art"
                    relatedRef={artwork.slug}
                    subject={`Enquiry — ${artwork.title}`}
                    defaultMessage={`I'm interested in "${artwork.title}" by ${artwork.artist}.`}
                    submitLabel="Send enquiry"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="sand">
          <Container>
            <SectionHeading
              eyebrow="More from the collection"
              title="You may also like"
              action={
                <ButtonLink href="/art" tone="outline" arrow>
                  All artwork
                </ButtonLink>
              }
            />
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArtCard key={item.id} artwork={item} className="reveal" />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

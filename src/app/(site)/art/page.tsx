import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ArtCard } from "@/components/art-card";
import { ArtFilters } from "@/components/art-filters";
import {
  ButtonLink,
  Container,
  EmptyState,
  Section,
  SectionHeading,
} from "@/components/ui";
import { Diamond, Frame, Palette, Sparkle } from "@/components/icons";
import { getArtFacets, getArtworks } from "@/lib/queries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Original Art, Limited Editions & Commissions",
  description:
    "Original paintings, collage, sculptural relief and limited edition prints — framed, delivered and installed across the North West by Deedi Ltd.",
  alternates: { canonical: "/art" },
  openGraph: {
    title: "Art Collection | Deedi Ltd",
    description:
      "Original artwork and limited editions for homes and commercial spaces, with framing and installation included.",
    images: ["/images/art/lion-relief.jpeg"],
  },
};

export const revalidate = 120;

const PILLARS = [
  {
    Icon: Palette,
    title: "Original Art",
    copy: "One-of-one works from artists we represent directly.",
  },
  {
    Icon: Frame,
    title: "Framing & Install",
    copy: "Specified, framed and hung by us — included locally.",
  },
  {
    Icon: Sparkle,
    title: "Commissions",
    copy: "Portraits and pieces made for your space and scale.",
  },
  {
    Icon: Diamond,
    title: "Provenance",
    copy: "Certificates, edition numbers and artist documentation.",
  },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ArtPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const [artworks, facets] = await Promise.all([
    getArtworks({
      category: first(params.category),
      medium: first(params.medium),
      sort: first(params.sort),
      search: first(params.search),
    }),
    getArtFacets(),
  ]);

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Art Collection — Deedi Ltd",
    url: `${site.url}/art`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: artworks.length,
      itemListElement: artworks.slice(0, 20).map((artwork, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${site.url}/art/${artwork.slug}`,
        name: artwork.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      {/* Split hero, echoing the bespoke-art reference layout */}
      <section className="surface-navy relative overflow-hidden">
        <Container className="relative grid items-center gap-12 py-24 lg:grid-cols-2 lg:gap-16 lg:py-32">
          <div>
            <p className="eyebrow text-gold-300">
              Bespoke art sales &amp; interior decoration
            </p>
            <h1 className="font-display mt-6 text-[2.75rem] leading-[1.05] font-medium tracking-[-0.02em] text-white balance sm:text-6xl">
              Extraordinary Art.
              <span className="block text-gold-400">Beautiful Spaces.</span>
            </h1>
            <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-white/70 pretty">
              Original works, limited editions and commissions — chosen for the room they are
              going into, framed properly and hung by us.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#collection" tone="gold" size="lg" arrow>
                Explore the collection
              </ButtonLink>
              <ButtonLink href="/services#commission" tone="outlineLight" size="lg">
                Commission a piece
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden shadow-2xl lg:aspect-[4/4.4]">
              <Image
                src="/images/art/lion-relief.jpeg"
                alt="Sentinel — carved timber lion relief"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-44 overflow-hidden border-4 border-navy-900 shadow-xl sm:block lg:-left-10 lg:w-56">
              <div className="relative aspect-square">
                <Image
                  src="/images/art/stallion-mosaic.jpeg"
                  alt="Northern Stallion"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <section className="surface-navy border-t border-white/10">
        <Container>
          <div className="grid divide-y divide-white/10 md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {PILLARS.map(({ Icon, title, copy }) => (
              <div key={title} className="reveal px-2 py-10 text-center lg:px-8">
                <Icon className="mx-auto size-8 text-gold-400" strokeWidth={1.2} />
                <h2 className="mt-5 text-[0.8125rem] font-semibold tracking-[0.16em] text-white uppercase">
                  {title}
                </h2>
                <p className="mx-auto mt-3 max-w-[24ch] text-sm leading-relaxed text-white/55">{copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Collection */}
      <Section tone="light" id="collection">
        <Container>
          <SectionHeading
            eyebrow="Featured art collection"
            title="Art for every space"
            intro="A curated selection of original paintings, collage, sculptural relief and limited edition prints."
            className="reveal"
          />

          <div className="mt-10">
            <ArtFilters
              categories={facets.categories}
              mediums={facets.mediums}
              total={artworks.length}
            />
          </div>

          <div className="mt-12">
            {artworks.length === 0 ? (
              <EmptyState
                title="Nothing matches those filters"
                message="Our collection moves quickly and we hold work that is not yet listed. Tell us what you are looking for and we will send options."
                action={
                  <ButtonLink href="/contact" tone="gold" arrow>
                    Talk to our curator
                  </ButtonLink>
                }
              />
            ) : (
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {artworks.map((artwork, index) => (
                  <ArtCard
                    key={artwork.id}
                    artwork={artwork}
                    priority={index < 3}
                    className="reveal"
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* About the art side */}
      <Section tone="navy" className="py-0 sm:py-0 lg:py-0">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[22rem] lg:min-h-[32rem]">
            <Image
              src="/images/art/still-waters-classic.jpeg"
              alt="Still Waters, Gallery Edition, hung in a hallway"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
            <div className="reveal max-w-lg">
              <p className="eyebrow rule-gold text-gold-300">About us</p>
              <h2 className="font-display mt-5 text-3xl leading-[1.15] font-medium text-white balance sm:text-4xl">
                Art that inspires.
                <span className="block text-gold-400">Interiors that feel like home.</span>
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-white/65 pretty">
                We work with a small group of artists and a framer we have used for a decade.
                That means we can tell you where a piece came from, get it framed to the
                millimetre, and hang it ourselves.
              </p>
              <ul className="mt-8 space-y-3 text-[0.9375rem] text-white/70">
                {[
                  "Free placement consultation across the North West",
                  "Framing specified to the room, not to a catalogue",
                  "Delivery, fixing and installation included locally",
                  "Certificates of authenticity with every original",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 bg-gold-500" />
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <ButtonLink href="/contact" tone="gold" arrow>
                  Book a consultation
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

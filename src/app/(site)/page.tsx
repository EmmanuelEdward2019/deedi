import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PropertyCard } from "@/components/property-card";
import { ArtCard } from "@/components/art-card";
import { PropertySearch } from "@/components/property-search";
import { TrustpilotWidget } from "@/components/trustpilot";
import {
  ButtonLink,
  Container,
  Eyebrow,
  GoldRule,
  Section,
  SectionHeading,
  TextLink,
} from "@/components/ui";
import {
  Building,
  Chart,
  Frame,
  Home as HomeIcon,
  Key,
  Palette,
  Quote,
  Sparkle,
  Users,
} from "@/components/icons";
import {
  getFeaturedArtworks,
  getFeaturedProperties,
  getPosts,
  getPropertyFacets,
} from "@/lib/queries";
import { formatShortDate } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export const revalidate = 300;

/**
 * The three strands under the hero title, set as a divided rule — the client's
 * replacements for the sample's "Expertise / Value / Long-term Growth".
 */
const HERO_STRANDS = [
  "Property Sales & Rents",
  "Asset & Project Management",
  "Art Sales & Interior Decorations",
];

const PILLARS = [
  {
    Icon: HomeIcon,
    title: "Property Management",
    copy: "Maximising your property's potential.",
  },
  {
    Icon: Chart,
    title: "Investment Portfolio",
    copy: "Strategic opportunities for lasting returns.",
  },
  {
    Icon: Building,
    title: "Project & Asset Management",
    copy: "Refurbishment, compliance and asset planning.",
  },
  {
    Icon: Palette,
    title: "Art & Interior Decoration",
    copy: "Original work, framing and interior styling.",
  },
];

/**
 * The two city panels that sit beside the pillars. Imagery is taken from the
 * client's approved sample, not photographs of particular listings.
 */
const CITIES = [
  {
    name: "Manchester",
    tagline: "Modern Living. Stronger Returns.",
    image: "/images/home/manchester-waterside.jpeg",
    href: "/properties?city=Manchester",
  },
  {
    name: "Liverpool",
    tagline: "A City of Opportunity.",
    image: "/images/home/liverpool-waterfront.jpeg",
    href: "/properties?city=Liverpool",
  },
];

/**
 * The three captioned images below the city panels.
 *
 * The sample's middle panel used a stock photograph of agents mid-handshake.
 * We have no such photography, and inventing it would put people on the site
 * who do not work here — so this band leads on the work itself instead.
 */
const DISCIPLINES = [
  {
    title: "Quality Art",
    copy: "Original work. Framed, delivered and hung.",
    image: "/images/art/still-waters-classic.jpeg",
    href: "/art",
  },
  {
    title: "Professional Management",
    copy: "Peace of mind for property owners and tenants.",
    image: "/images/home/canal-apartments.jpeg",
    href: "/services#management",
  },
  {
    // TODO(client): swap for the painting / decorating photography being sent over.
    title: "Interior Decoration & Works",
    copy: "Refurbishment, painting and interior decor.",
    image: "/images/home/interior-living-room.jpeg",
    href: "/services#interiors",
  },
];

/** The four portfolio tiles — Manchester and Liverpool, alternating. */
const PORTFOLIO_CITIES = [
  {
    city: "Manchester",
    area: "City Centre & Ancoats",
    image: "/images/home/manchester-city-centre.jpeg",
  },
  {
    city: "Liverpool",
    area: "City Centre & Waterfront",
    image: "/images/home/liverpool-three-graces.jpeg",
  },
  {
    city: "Manchester",
    area: "Castlefield & Salford Quays",
    image: "/images/home/manchester-castlefield.jpeg",
  },
  {
    city: "Liverpool",
    area: "Baltic Triangle & Beyond",
    image: "/images/home/liverpool-baltic-triangle.jpeg",
  },
];

const SERVICES = [
  {
    Icon: Key,
    title: "Lettings & Tenant Find",
    copy: "Marketing, referencing and move-in, with an eleven-day average void.",
    href: "/services#lettings",
  },
  {
    Icon: Building,
    title: "Block & Portfolio Management",
    copy: "Mixed-use blocks and multi-property portfolios under one schedule.",
    href: "/services#management",
  },
  {
    Icon: Users,
    title: "Sales & Valuations",
    copy: "Honest pricing, proper photography and a chain we keep moving.",
    href: "/services#sales",
  },
  {
    Icon: Frame,
    title: "Art Sales & Commissions",
    copy: "Originals, limited editions and commissioned work from our artists.",
    href: "/services#commission",
  },
  {
    Icon: Sparkle,
    title: "Interior Decoration",
    copy: "Placement, framing and styling for homes and commercial spaces.",
    href: "/services#interiors",
  },
  {
    Icon: Chart,
    title: "Investment Sourcing",
    copy: "Off-market lots with tenancy schedules and net yield modelling.",
    href: "/services#investment",
  },
];

export default async function HomePage() {
  const [properties, artworks, posts, facets] = await Promise.all([
    getFeaturedProperties(6),
    getFeaturedArtworks(4),
    getPosts({ limit: 3 }),
    getPropertyFacets(),
  ]);

  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="relative isolate overflow-hidden bg-navy-950">
        {/*
          A 3.6:1 panorama — Manchester's towers on the left, Liverpool's
          waterfront on the right. Narrow screens can only show a slice of it,
          so they anchor on the Liver Building rather than the empty centre.
        */}
        <Image
          src="/images/home/hero-manchester-liverpool.jpeg"
          alt="Manchester skyline and the Liverpool waterfront at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_center] lg:object-center"
        />
        {/* Lighter than a full scrim so the sunset keeps its colour. */}
        <div className="absolute inset-0 bg-navy-950/45 lg:bg-transparent lg:bg-gradient-to-b lg:from-navy-950/25 lg:via-navy-950/5 lg:to-navy-950/35" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_40%_62%_at_center,rgb(5_13_31/0.5),transparent)] lg:block" />

        {/*
          Short on desktop so both skylines stay in frame, as in the sample;
          taller on mobile, where the search band below must clear the fixed
          WhatsApp button.
        */}
        <Container className="relative flex min-h-[66vh] flex-col items-center justify-center py-20 text-center lg:min-h-[28rem] lg:py-12">
          <Eyebrow tone="white" className="flex items-center gap-3">
            Manchester <span className="text-gold-500/60">|</span> Liverpool{" "}
            <span className="text-gold-500/60">|</span> England
          </Eyebrow>

          <h1 className="font-display mt-5 max-w-4xl text-[2.5rem] leading-[1.08] font-medium tracking-[-0.02em] text-white balance [text-shadow:0_2px_24px_rgb(5_13_31/0.45)] sm:text-6xl">
            Property and Investment
            <span className="block">Management Portfolio</span>
          </h1>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-white/90 uppercase sm:text-xs">
            {HERO_STRANDS.map((strand, index) => (
              <li key={strand} className="flex items-center gap-4">
                {/* Separator only once the strands sit on one line. */}
                {index > 0 ? <span className="hidden text-gold-500/60 sm:inline">/</span> : null}
                {strand}
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-white/80 pretty sm:text-base">
            Premium property management and investment opportunities in Manchester and
            Liverpool — alongside original art for the spaces people live and work in.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/properties" tone="gold" arrow>
              View our properties
            </ButtonLink>
            <ButtonLink href="/art" tone="outlineLight">
              View art collection
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ---- search: kept from the previous homepage, slimmed to a band ---- */}
      <section className="border-b border-sand-200 bg-sand-50 py-6">
        <Container>
          <PropertySearch cities={facets.cities} />
        </Container>
      </section>

      {/* ==================== PILLARS + CITY PANELS ====================== */}
      {/* Sample fuses a dark four-icon panel to two city images on one row. */}
      <section className="surface-navy relative">
        <GoldRule />
        <div className="grid lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)]">
          <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {PILLARS.map(({ Icon, title, copy }) => (
              <div key={title} className="reveal bg-navy-900 px-4 py-10 text-center lg:px-5 lg:py-14">
                <Icon className="mx-auto size-8 text-gold-400" strokeWidth={1.2} />
                <h3 className="mt-5 text-[0.6875rem] leading-snug font-semibold tracking-[0.14em] text-white uppercase">
                  {title}
                </h3>
                <p className="mx-auto mt-3 max-w-[20ch] text-[0.8125rem] leading-relaxed text-white/55">
                  {copy}
                </p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2">
            {CITIES.map((city) => (
              <Link
                key={city.name}
                href={city.href}
                className="img-zoom group relative flex min-h-[15rem] items-end overflow-hidden lg:min-h-[19rem]"
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 27vw"
                  className="object-cover"
                />
                <div className="scrim absolute inset-0" />
                <div className="relative p-6 lg:p-8">
                  <h3 className="text-sm font-semibold tracking-[0.14em] text-white uppercase">
                    {city.name}
                  </h3>
                  <p className="mt-1.5 text-[0.8125rem] text-white/75">{city.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= DISCIPLINES BAND ======================== */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3">
        {DISCIPLINES.map((panel) => (
          <Link
            key={panel.title}
            href={panel.href}
            className="img-zoom group relative flex min-h-[15rem] items-end overflow-hidden lg:min-h-[17rem]"
          >
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="scrim absolute inset-0" />
            <div className="relative p-6 lg:p-8">
              <h3 className="text-sm font-semibold tracking-[0.14em] text-white uppercase">
                {panel.title}
              </h3>
              <p className="mt-1.5 max-w-[34ch] text-[0.8125rem] leading-relaxed text-white/75">
                {panel.copy}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* ====================== INVEST IN ICONIC CITIES =================== */}
      <Section tone="light">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,22%)_minmax(0,1fr)] lg:items-center lg:gap-12">
            <div className="reveal">
              <Eyebrow>Our portfolio</Eyebrow>
              <h2 className="font-display mt-4 text-4xl leading-[1.1] font-medium tracking-[-0.015em] text-navy-900 balance lg:text-[2.75rem]">
                Invest in
                <span className="block">Iconic Cities</span>
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-600 pretty">
                From stylish city apartments to high-yield investment opportunities, our
                portfolio spans the best of Manchester and Liverpool.
              </p>
              <p className="mt-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-gold-600 uppercase">
                England · United Kingdom
              </p>
              <div className="mt-7">
                <ButtonLink href="/properties" tone="gold" arrow>
                  View our properties
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PORTFOLIO_CITIES.map((tile) => (
                <Link
                  key={`${tile.city}-${tile.area}`}
                  href={`/properties?city=${encodeURIComponent(tile.city)}`}
                  className="img-zoom reveal group relative flex aspect-[4/3] items-end overflow-hidden"
                >
                  <Image
                    src={tile.image}
                    alt={`${tile.city} — ${tile.area}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                  />
                  <div className="scrim absolute inset-0" />
                  <div className="relative p-5">
                    <h3 className="text-[0.8125rem] font-semibold tracking-[0.14em] text-white uppercase">
                      {tile.city}
                    </h3>
                    <p className="mt-1 text-xs text-white/75">{tile.area}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ======================= FEATURED PROPERTIES ====================== */}
      <Section tone="sand">
        <Container>
          <SectionHeading
            eyebrow="Available now"
            title={
              <>
                Homes and investments
                <br className="hidden sm:block" /> across the North West
              </>
            }
            intro="A live selection from the portfolio — full details, floor plans and viewings on request."
            action={
              <ButtonLink href="/properties" tone="outline" arrow>
                View all properties
              </ButtonLink>
            }
            className="reveal"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                priority={index < 3}
                className="reveal"
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* ============================= STATS ============================= */}
      <section className="relative overflow-hidden bg-navy-900 py-16 lg:py-20">
        <Image
          src="/images/properties/terraced-streets.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-navy-950/75" />
        <Container className="relative">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {site.stats.map((stat) => (
              <div key={stat.label} className="reveal text-center">
                <p className="font-display text-5xl font-medium text-gold-400 lg:text-6xl">{stat.value}</p>
                <p className="mx-auto mt-3 max-w-[18ch] text-[0.8125rem] leading-relaxed tracking-wide text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================== ART FEATURE ========================== */}
      <Section tone="light">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reveal lg:col-span-5">
              <SectionHeading
                eyebrow="The collection"
                title="Art that changes the room, not just the wall."
                intro="Originals, limited editions and commissioned work from artists we represent directly. Every piece is framed to specification, delivered and hung by us across the North West."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/art" tone="gold" arrow>
                  View the collection
                </ButtonLink>
                <ButtonLink href="/services#commission" tone="outline">
                  Commission a piece
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-6 sm:grid-cols-2">
                {artworks.slice(0, 4).map((artwork, index) => (
                  <ArtCard
                    key={artwork.id}
                    artwork={artwork}
                    className={index % 2 === 1 ? "reveal sm:mt-12" : "reveal"}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ============================ SERVICES =========================== */}
      <Section tone="navy">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Two disciplines, one standard."
            intro="Everything below is delivered in-house, by people you can call by name."
            align="center"
            tone="light"
            className="reveal"
          />

          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ Icon, title, copy, href }) => (
              <Link
                key={title}
                href={href}
                className="reveal group bg-navy-900 p-8 transition-colors duration-500 hover:bg-navy-800 lg:p-10"
              >
                <Icon className="size-7 text-gold-400 transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.2} />
                <h3 className="font-display mt-6 text-xl text-white">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/55">{copy}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* =========================== TESTIMONIAL ========================== */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <Image
          src="/images/art/still-waters-classic.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-navy-950/85" />
        <Container className="relative">
          <div className="reveal mx-auto max-w-3xl text-center">
            <Quote className="mx-auto size-10 text-gold-500/70" />
            <blockquote className="font-display mt-8 text-2xl leading-[1.45] text-white balance sm:text-3xl lg:text-[2.125rem]">
              “We moved nine properties across to Deedi after years of chasing our old agent.
              Six months in, every compliance file is current, voids are down and I have stopped
              thinking about it. That is what I was paying for all along.”
            </blockquote>
            <footer className="mt-8">
              <p className="text-sm font-semibold tracking-wide text-gold-300">Martin Doyle</p>
              <p className="mt-1 text-[0.8125rem] text-white/50">Portfolio landlord · Farnworth &amp; Little Lever</p>
            </footer>
            <TrustpilotWidget variant="mini" theme="dark" className="mx-auto mt-10 max-w-[18rem]" />
          </div>
        </Container>
      </section>

      {/* ============================= JOURNAL ============================ */}
      {posts.length > 0 && (
        <Section tone="sand">
          <Container>
            <SectionHeading
              eyebrow="The journal"
              title="Notes from the market"
              intro="Yield data, compliance changes and the occasional opinion about framing."
              action={
                <ButtonLink href="/blog" tone="outline" arrow>
                  Read the journal
                </ButtonLink>
              }
              className="reveal"
            />

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="reveal group flex flex-col">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="img-zoom relative block aspect-[16/10] overflow-hidden bg-navy-900"
                  >
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="flex flex-1 flex-col pt-5">
                    <p className="flex items-center gap-3 text-[0.6875rem] tracking-[0.14em] text-gold-600 uppercase">
                      {post.category}
                      <span className="text-sand-200">/</span>
                      <span className="text-slate-400 normal-case tracking-normal">
                        {formatShortDate(post.published_at)}
                      </span>
                    </p>
                    <h3 className="font-display mt-3 text-xl leading-snug text-navy-900">
                      <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-gold-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {post.excerpt}
                    </p>
                    <div className="mt-4">
                      <TextLink href={`/blog/${post.slug}`}>Read more</TextLink>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/*
        The sample's closing "Your Property. Our Priority." band is already
        served site-wide by the footer CTA, so it is not repeated here.
      */}
    </>
  );
}

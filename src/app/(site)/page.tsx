import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PropertyCard } from "@/components/property-card";
import { ArtCard } from "@/components/art-card";
import { PropertySearch } from "@/components/property-search";
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
  Shield,
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

const PILLARS = [
  {
    Icon: HomeIcon,
    title: "Property Management",
    copy: "Full management, compliance and tenant care across 450 homes.",
  },
  {
    Icon: Chart,
    title: "Investment Portfolio",
    copy: "Sourcing, appraisal and acquisition built on real yield data.",
  },
  {
    Icon: Palette,
    title: "Original Art",
    copy: "Commissioned and collected work, framed and installed.",
  },
  {
    Icon: Shield,
    title: "Local Expertise",
    copy: "Eighteen years in Bolton, Salford and Greater Manchester.",
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
      <section className="relative min-h-[88vh] overflow-hidden bg-navy-950 lg:min-h-[92vh]">
        <Image
          src="/images/properties/bolton-aerial.jpeg"
          alt="Bolton town centre from above"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/55 to-navy-950/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-transparent to-transparent" />

        <Container className="relative flex min-h-[88vh] flex-col justify-center py-28 lg:min-h-[92vh]">
          <div className="max-w-3xl">
            <Eyebrow tone="white" className="flex items-center gap-3">
              Bolton <span className="text-gold-500/50">|</span> Salford{" "}
              <span className="text-gold-500/50">|</span> Manchester
            </Eyebrow>

            <h1 className="font-display mt-6 text-[2.75rem] leading-[1.05] font-medium tracking-[-0.02em] text-white balance sm:text-6xl lg:text-7xl">
              Property &amp; Art
              <span className="block text-gold-400">for the North West.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 pretty">
              We manage, let and sell homes across Greater Manchester — and place original
              art in the spaces people actually live in.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/properties" tone="gold" size="lg" arrow>
                Browse properties
              </ButtonLink>
              <ButtonLink href="/art" tone="outlineLight" size="lg">
                View art collection
              </ButtonLink>
            </div>
          </div>

          <div className="mt-14 max-w-4xl">
            <PropertySearch cities={facets.cities} />
          </div>
        </Container>
      </section>

      {/* ============================ PILLARS ============================= */}
      <section className="surface-navy relative">
        <GoldRule />
        <Container>
          <div className="grid divide-y divide-white/10 md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {PILLARS.map(({ Icon, title, copy }) => (
              <div key={title} className="reveal px-2 py-10 text-center lg:px-8">
                <Icon className="mx-auto size-8 text-gold-400" strokeWidth={1.2} />
                <h3 className="mt-5 text-[0.8125rem] font-semibold tracking-[0.16em] text-white uppercase">
                  {title}
                </h3>
                <p className="mx-auto mt-3 max-w-[22ch] text-sm leading-relaxed text-white/55">{copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ========================= TWO DISCIPLINES ======================== */}
      <Section tone="light" className="py-0 sm:py-0 lg:py-0">
        <div className="grid lg:grid-cols-2">
          {[
            {
              href: "/properties",
              image: "/images/properties/new-build-townhouses.jpeg",
              eyebrow: "Division one",
              title: "Property",
              copy: "Management, lettings, sales and investment across Greater Manchester.",
              cta: "Explore property",
            },
            {
              href: "/art",
              image: "/images/art/lion-relief.jpeg",
              eyebrow: "Division two",
              title: "Art",
              copy: "Original works, limited editions and commissions, framed and installed.",
              cta: "Explore art",
            },
          ].map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              className="img-zoom group relative flex min-h-[26rem] items-end overflow-hidden lg:min-h-[34rem]"
            >
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="scrim absolute inset-0" />
              <div className="relative w-full p-8 lg:p-12">
                <Eyebrow tone="white">{panel.eyebrow}</Eyebrow>
                <h2 className="font-display mt-3 text-4xl text-white lg:text-5xl">{panel.title}</h2>
                <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-white/70">{panel.copy}</p>
                <span className="mt-6 inline-flex items-center gap-2 border-b border-gold-400/50 pb-1 text-[0.75rem] font-semibold tracking-[0.14em] text-gold-300 uppercase transition-colors group-hover:border-gold-400 group-hover:text-white">
                  {panel.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ======================= FEATURED PROPERTIES ====================== */}
      <Section tone="sand">
        <Container>
          <SectionHeading
            eyebrow="Our portfolio"
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
    </>
  );
}

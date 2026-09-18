import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ButtonLink, Container, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { Chart, Frame, Home, Shield, Users } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Deedi Ltd — Property & Art in Greater Manchester",
  description:
    "Eighteen years managing, letting and selling property across Bolton and Greater Manchester, alongside a curated art and interior decoration practice.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Deedi Ltd",
    description: "Property management, investment and original art across the North West.",
    images: ["/images/properties/bolton-high-street.jpeg"],
  },
};

const VALUES = [
  {
    Icon: Shield,
    title: "Compliance first",
    copy: "Every managed property carries a current gas, electrical and EPC file. No exceptions, no surprises at renewal.",
  },
  {
    Icon: Users,
    title: "People you can name",
    copy: "One point of contact per landlord and per tenant. You will not be passed round a call centre.",
  },
  {
    Icon: Chart,
    title: "Numbers, not narratives",
    copy: "We quote net yields, real void periods and honest asking prices — even when the honest number is lower.",
  },
  {
    Icon: Frame,
    title: "Made to last",
    copy: "From a boiler specification to a frame moulding, we choose the thing that will still be right in ten years.",
  },
];

const TIMELINE = [
  {
    year: "2008",
    title: "Founded in Bolton",
    copy: "Started with four terraced houses on Halliwell Road and a single van.",
  },
  {
    year: "2014",
    title: "Full management launched",
    copy: "Brought lettings, compliance and maintenance in-house rather than subcontracting.",
  },
  {
    year: "2019",
    title: "Investment & sourcing",
    copy: "Began sourcing off-market portfolio lots for private investors across the North West.",
  },
  {
    year: "2023",
    title: "Deedi Art founded",
    copy: "Started representing artists directly and offering framing, placement and installation.",
  },
  {
    year: "2026",
    title: "450 properties, 300 works",
    copy: "Managing across Bolton, Salford and Manchester, with art placed in homes and offices nationwide.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Two businesses, run the way we would want ours run."
        intro="Deedi Ltd manages property and places art. Different disciplines, the same standard of care."
        image="/images/properties/bolton-high-street.jpeg"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
        ]}
      />

      {/* Story */}
      <Section tone="light">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/properties/bolton-aerial.jpeg"
                  alt="Bolton town centre"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-4 -bottom-6 hidden w-48 overflow-hidden border-4 border-white shadow-xl lg:block">
                <div className="relative aspect-square">
                  <Image
                    src="/images/art/adorned-portrait.jpeg"
                    alt="Adorned"
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="reveal">
              <SectionHeading
                eyebrow="Our story"
                title="Started with four houses on Halliwell Road."
              />
              <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-slate-600 pretty">
                <p>
                  Deedi began in 2008 with a small portfolio of terraces in Bolton and a simple
                  observation: most letting agents were good at finding tenants and poor at
                  everything that happened afterwards.
                </p>
                <p>
                  So we built the other half first. Compliance, maintenance, inspections and
                  renewals came in-house before we ever advertised for management business. Eighteen
                  years on, that is still the part we are judged on.
                </p>
                <p>
                  The art side started because our landlords kept asking who had chosen the pieces
                  in our own office. We now represent a small group of artists directly, and we
                  frame, deliver and hang everything ourselves.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/services" tone="gold" arrow>
                  What we do
                </ButtonLink>
                <ButtonLink href="/contact" tone="outline">
                  Talk to us
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats */}
      <section className="surface-navy py-16 lg:py-20">
        <Container>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {site.stats.map((stat) => (
              <div key={stat.label} className="reveal text-center">
                <p className="font-display text-5xl font-medium text-gold-400">{stat.value}</p>
                <p className="mx-auto mt-3 max-w-[18ch] text-[0.8125rem] leading-relaxed text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <Section tone="sand">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="Four things we do not compromise on."
            align="center"
            className="reveal"
          />
          <div className="mt-14 grid gap-px bg-sand-200 sm:grid-cols-2">
            {VALUES.map(({ Icon, title, copy }) => (
              <div key={title} className="reveal bg-white p-8 lg:p-10">
                <Icon className="size-7 text-gold-500" strokeWidth={1.2} />
                <h3 className="font-display mt-6 text-xl text-navy-900">{title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section tone="light">
        <Container>
          <SectionHeading eyebrow="Milestones" title="Eighteen years, briefly." className="reveal" />
          <ol className="mt-14 grid gap-px bg-sand-200 lg:grid-cols-5">
            {TIMELINE.map((entry) => (
              <li key={entry.year} className="reveal bg-white p-7">
                <p className="font-display text-3xl text-gold-500">{entry.year}</p>
                <h3 className="mt-4 text-sm font-semibold tracking-wide text-navy-900">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{entry.copy}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Coverage */}
      <Section tone="navy">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal">
              <Eyebrow tone="white" className="rule-gold">
                Where we work
              </Eyebrow>
              <h2 className="font-display mt-5 text-3xl leading-[1.15] font-medium text-white balance sm:text-4xl">
                Bolton first, Greater Manchester throughout.
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-white/65 pretty">
                We manage day-to-day within roughly forty minutes of the office, which is what makes
                same-week maintenance possible. Sales, sourcing and art placement reach further.
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.9375rem] text-white/70">
                {[
                  "Bolton",
                  "Salford",
                  "Manchester",
                  "Bury",
                  "Farnworth",
                  "Little Lever",
                  "Horwich",
                  "Radcliffe",
                ].map((place) => (
                  <li key={place} className="flex items-center gap-3">
                    <span className="size-1.5 shrink-0 bg-gold-500" />
                    {place}
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal grid grid-cols-2 gap-4">
              {[
                "/images/properties/new-build-townhouses.jpeg",
                "/images/properties/terraced-streets.jpeg",
                "/images/properties/suburban-estate.jpeg",
                "/images/properties/town-centre-regeneration.jpeg",
              ].map((image, index) => (
                <div
                  key={image}
                  className={`relative aspect-[4/5] overflow-hidden ${index % 2 === 1 ? "mt-8" : ""}`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Closing */}
      <Section tone="light" className="py-16 lg:py-20">
        <Container>
          <div className="reveal mx-auto max-w-2xl text-center">
            <Home className="mx-auto size-8 text-gold-500" strokeWidth={1.2} />
            <h2 className="font-display mt-6 text-3xl leading-tight text-navy-900 balance sm:text-4xl">
              Come and see how we do it.
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600">
              A valuation, a portfolio review or a look at the current collection — no obligation
              either way.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact" tone="gold" size="lg" arrow>
                Book a conversation
              </ButtonLink>
              <ButtonLink href="/properties" tone="outline" size="lg">
                Browse properties
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

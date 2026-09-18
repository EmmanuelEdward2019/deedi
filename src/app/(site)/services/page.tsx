import Image from "next/image";
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ButtonLink, Container, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { Building, Chart, Check, Frame, Key, Sparkle, Users } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services — Management, Lettings, Sales, Art & Interiors",
  description:
    "Full property management, lettings, sales, investment sourcing, art sales, commissions and interior decoration across Bolton and Greater Manchester.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Deedi Ltd",
    description:
      "Property management, lettings, sales and investment — plus art sales, commissions and interior decoration.",
    images: ["/images/properties/suburban-estate.jpeg"],
  },
};

const SERVICES = [
  {
    id: "management",
    Icon: Building,
    eyebrow: "Property",
    title: "Full Property Management",
    copy: "Everything between a signed tenancy and a clean check-out — handled in-house, on a fixed percentage, with no set-up fee.",
    points: [
      "Rent collection, arrears chasing and monthly statements",
      "Gas, electrical and EPC compliance tracked to expiry",
      "Quarterly inspections with dated photographic reports",
      "24-hour maintenance line and a vetted contractor panel",
      "Deposit protection, renewals and Section notices",
    ],
    image: "/images/properties/new-build-townhouses.jpeg",
  },
  {
    id: "lettings",
    Icon: Key,
    eyebrow: "Property",
    title: "Lettings & Tenant Find",
    copy: "Proper photography, portal-wide marketing and referencing that actually catches problems. Our Bolton average void is eleven days.",
    points: [
      "Professional photography and floor plans included",
      "Rightmove, Zoopla and OnTheMarket listings",
      "Full referencing, right-to-rent and affordability checks",
      "Accompanied viewings seven days a week",
      "Inventory, check-in and tenancy paperwork",
    ],
    image: "/images/properties/salford-townhouses.jpeg",
  },
  {
    id: "sales",
    Icon: Users,
    eyebrow: "Property",
    title: "Sales & Valuations",
    copy: "An honest asking price, marketing that does the property justice, and someone who keeps the chain moving when it stalls.",
    points: [
      "Free, no-obligation market appraisal",
      "Comparable evidence supplied with every valuation",
      "Professional photography, video and floor plans",
      "Qualified buyers only — proof of funds checked",
      "Weekly progression updates through to completion",
    ],
    image: "/images/properties/suburban-estate.jpeg",
  },
  {
    id: "investment",
    Icon: Chart,
    eyebrow: "Property",
    title: "Investment & Sourcing",
    copy: "Off-market lots, modelled on net yield rather than gross, with tenancy schedules and arrears history supplied up front.",
    points: [
      "Off-market portfolio and block opportunities",
      "Net yield modelling, not headline gross figures",
      "Full tenancy schedules and arrears history",
      "Refurbishment costing and EPC improvement plans",
      "Management retained post-completion if you want it",
    ],
    image: "/images/properties/terraced-streets.jpeg",
  },
  {
    id: "commission",
    Icon: Frame,
    eyebrow: "Art",
    title: "Art Sales & Commissions",
    copy: "Originals and limited editions from artists we represent directly, plus commissioned work made for your space and scale.",
    points: [
      "Original paintings, collage and sculptural relief",
      "Signed, numbered limited edition giclée prints",
      "Commissioned portraits — people, animals and places",
      "Sketch approval before any painting begins",
      "Certificate of authenticity with every original",
    ],
    image: "/images/art/labrador-portrait.jpeg",
  },
  {
    id: "interiors",
    Icon: Sparkle,
    eyebrow: "Art",
    title: "Interior Decoration & Placement",
    copy: "Choosing the right piece is half of it. Getting the scale, the framing and the light right is the other half — and that is our part.",
    points: [
      "Free placement consultation across the North West",
      "Framing specified to the room, not to a catalogue",
      "Conservation mounts and museum glass where it matters",
      "Delivery, fixing and installation included locally",
      "Commercial reception and office schemes",
    ],
    image: "/images/art/still-waters-classic.jpeg",
  },
];

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services — Deedi Ltd",
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.copy,
        url: `${site.url}/services#${service.id}`,
        provider: { "@type": "Organization", name: site.legalName },
        areaServed: "Greater Manchester",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageHero
        eyebrow="What we do"
        title="Everything in-house, by people you can call by name."
        intro="Six services across two disciplines. No subcontracted management, no white-labelled framing."
        image="/images/properties/suburban-estate.jpeg"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
        ]}
      />

      {/* Jump nav */}
      <div className="sticky top-[68px] z-30 border-b border-sand-200 bg-white/95 backdrop-blur-md">
        <Container>
          <div className="rail flex gap-1 overflow-x-auto py-3">
            {SERVICES.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="shrink-0 px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase transition-colors hover:text-navy-900"
              >
                {service.title}
              </a>
            ))}
          </div>
        </Container>
      </div>

      {SERVICES.map((service, index) => (
        <Section
          key={service.id}
          id={service.id}
          tone={index % 2 === 0 ? "light" : "sand"}
          className="scroll-mt-32"
        >
          <Container>
            <div
              className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="reveal relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <div className="reveal">
                <div className="flex items-center gap-3">
                  <service.Icon className="size-7 text-gold-500" strokeWidth={1.2} />
                  <Eyebrow>{service.eyebrow}</Eyebrow>
                </div>

                <h2 className="font-display mt-5 text-3xl leading-[1.15] font-medium text-navy-900 balance sm:text-4xl">
                  {service.title}
                </h2>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600 pretty">
                  {service.copy}
                </p>

                <ul className="mt-7 space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[0.9375rem] text-navy-800">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ButtonLink
                    href={`/contact?enquiry=${service.eyebrow === "Art" ? "art" : "management"}`}
                    tone="gold"
                    arrow
                  >
                    Enquire about this
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* Fees */}
      <Section tone="navy">
        <Container>
          <SectionHeading
            eyebrow="Straight answers"
            title="What it costs"
            intro="Indicative figures, quoted properly after we have seen the property. No set-up fees and no renewal commission on managed tenancies."
            align="center"
            tone="light"
            className="reveal"
          />

          <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-3">
            {[
              {
                name: "Tenant Find",
                price: "£595",
                unit: "one-off, inc. VAT",
                points: ["Marketing and photography", "Referencing and right-to-rent", "Tenancy paperwork and check-in"],
              },
              {
                name: "Full Management",
                price: "10%",
                unit: "of collected rent",
                featured: true,
                points: [
                  "Everything in Tenant Find",
                  "Rent collection and arrears",
                  "Compliance, inspections, maintenance",
                  "Renewals and notices",
                ],
              },
              {
                name: "Portfolio & Block",
                price: "From 8%",
                unit: "of collected rent",
                points: ["Volume rate from five properties", "Single consolidated statement", "Named portfolio manager"],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`reveal p-8 lg:p-10 ${tier.featured ? "bg-navy-800" : "bg-navy-900"}`}
              >
                {tier.featured && (
                  <span className="mb-4 inline-block bg-gold-500 px-3 py-1 text-[0.625rem] font-bold tracking-[0.16em] text-white uppercase">
                    Most chosen
                  </span>
                )}
                <h3 className="text-[0.8125rem] font-semibold tracking-[0.16em] text-white uppercase">
                  {tier.name}
                </h3>
                <p className="font-display mt-4 text-4xl text-gold-400">{tier.price}</p>
                <p className="mt-1 text-xs text-white/45">{tier.unit}</p>
                <ul className="mt-7 space-y-2.5">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-white/65">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-white/40">
            Art commissions and framing are quoted per piece. Client money protected; member of a
            government-approved redress scheme.
          </p>
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { Container, Eyebrow, Section } from "@/components/ui";
import { Clock, Mail, MapPin, Phone, WhatsApp } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Deedi Ltd — Bolton, Greater Manchester",
  description:
    "Call, email or message us on WhatsApp. Property valuations, management enquiries, art commissions and everything in between.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Deedi Ltd",
    description: "Get in touch about property management, sales, lettings or original art.",
    images: ["/images/properties/town-centre-regeneration.jpeg"],
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const VALID_TYPES = ["property", "management", "investment", "art", "interiors", "general"];

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requested = Array.isArray(params.enquiry) ? params.enquiry[0] : params.enquiry;
  const enquiryType = VALID_TYPES.includes(requested ?? "") ? requested! : "general";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Deedi Ltd",
    url: `${site.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: site.legalName,
      telephone: site.contact.phone,
      email: site.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.contact.address.street,
        addressLocality: site.contact.address.city,
        addressRegion: site.contact.address.region,
        postalCode: site.contact.address.postcode,
        addressCountry: "GB",
      },
    },
  };

  const channels = [
    {
      Icon: Phone,
      label: "Call us",
      value: site.contact.phone,
      href: site.contact.phoneHref,
      note: "Mon–Fri 9am–6pm, Sat 10am–3pm",
    },
    {
      Icon: WhatsApp,
      label: "WhatsApp",
      value: "Message the team",
      href: whatsappLink(),
      note: "Usually answered within the hour",
      external: true,
    },
    {
      Icon: Mail,
      label: "Email",
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
      note: "We reply within one working day",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <PageHero
        eyebrow="Contact"
        title="Let's talk."
        intro="A valuation, a management switch, an artwork or a commission — tell us what you need and the right person will come back to you."
        image="/images/properties/town-centre-regeneration.jpeg"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/contact", label: "Contact" },
        ]}
        size="sm"
      />

      {/* Channels */}
      <section className="border-b border-sand-200 bg-white">
        <Container>
          <div className="grid gap-px bg-sand-200 md:grid-cols-3">
            {channels.map(({ Icon, label, value, href, note, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group bg-white p-8 transition-colors hover:bg-sand-50"
              >
                <Icon className="size-6 text-gold-500" strokeWidth={1.2} />
                <p className="eyebrow mt-5 text-slate-400">{label}</p>
                <p className="font-display mt-2 text-xl text-navy-900 transition-colors group-hover:text-gold-600">
                  {value}
                </p>
                <p className="mt-1.5 text-sm text-slate-500">{note}</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* Form + details */}
      <Section tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow className="rule-gold">Send us a message</Eyebrow>
              <h2 className="font-display mt-5 text-3xl leading-tight text-navy-900 balance sm:text-4xl">
                Tell us what you need.
              </h2>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600">
                Every message below lands directly in our dashboard and is picked up the same
                working day.
              </p>

              <div className="mt-9">
                <EnquiryForm enquiryType={enquiryType} showTypePicker submitLabel="Send message" />
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="surface-navy p-8 lg:p-10">
                <Eyebrow tone="white" className="rule-gold">
                  Visit the office
                </Eyebrow>

                <address className="mt-7 space-y-6 not-italic">
                  <div className="flex gap-4">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-gold-400" />
                    <div className="text-[0.9375rem] leading-relaxed text-white/75">
                      <p className="font-medium text-white">{site.legalName}</p>
                      <p>{site.contact.address.street}</p>
                      <p>
                        {site.contact.address.city}, {site.contact.address.region}
                      </p>
                      <p>{site.contact.address.postcode}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Clock className="mt-0.5 size-5 shrink-0 text-gold-400" />
                    <dl className="space-y-1.5 text-[0.9375rem] text-white/75">
                      {site.contact.hours.map((entry) => (
                        <div key={entry.days} className="flex gap-3">
                          <dt className="w-36 shrink-0 text-white/50">{entry.days}</dt>
                          <dd>{entry.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </address>

                <div className="mt-8 border-t border-white/10 pt-8">
                  <p className="text-sm leading-relaxed text-white/55">
                    Prefer to talk it through? Our live chat goes straight to WhatsApp and is
                    usually answered within the hour.
                  </p>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex items-center justify-center gap-2.5 bg-[#25D366] px-6 py-3.5 text-[0.75rem] font-semibold tracking-[0.13em] text-white uppercase transition-colors hover:bg-[#1eb855]"
                  >
                    <WhatsApp className="size-4" />
                    Start a WhatsApp chat
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="mt-6 aspect-[4/3] overflow-hidden border border-sand-200">
                <iframe
                  title="Deedi Ltd office location, Bolton"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-2.4430%2C53.5730%2C-2.4110%2C53.5850&layer=mapnik&marker=53.5790%2C-2.4270"
                  className="size-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

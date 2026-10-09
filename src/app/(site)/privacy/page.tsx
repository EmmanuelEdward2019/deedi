import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.legalName} collects, uses and protects your personal data under UK GDPR.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        intro="How we collect, use and protect the information you give us."
        image="/images/properties/bolton-aerial.jpeg"
        size="sm"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/privacy", label: "Privacy" },
        ]}
      />

      <Section tone="light">
        <Container>
          <div className="prose-deedi mx-auto max-w-3xl">
            <p className="text-sm text-slate-500">Last updated 17 September 2026</p>

            <h2>Who we are</h2>
            <p>
              {site.legalName} is the data controller for the personal data described in this
              policy. You can reach us at {site.contact.address.street},{" "}
              {site.contact.address.city} {site.contact.address.postcode}, by telephone on{" "}
              {site.contact.phone}, or by email at <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or{" "}
              <a href={`mailto:${site.contact.infoEmail}`}>{site.contact.infoEmail}</a>.
            </p>

            <h2>What we collect</h2>
            <ul>
              <li><strong>Enquiry details</strong> — your name, email address, telephone number and the content of any message you send us through the website, WhatsApp or by email.</li>
              <li><strong>Newsletter sign-ups</strong> — your email address and the page you subscribed from.</li>
              <li><strong>Tenancy and sales records</strong> — where you go on to become a client, tenant or purchaser, the information required to provide that service and to meet our legal obligations.</li>
              <li><strong>Technical data</strong> — basic server logs and aggregate analytics. We do not use advertising cookies.</li>
            </ul>

            <h2>Why we use it</h2>
            <p>We process your data on the following lawful bases:</p>
            <ul>
              <li><strong>Legitimate interests</strong> — responding to your enquiry and running our business.</li>
              <li><strong>Contract</strong> — providing management, lettings, sales or art services you have asked for.</li>
              <li><strong>Legal obligation</strong> — anti-money-laundering, right-to-rent, deposit protection and tax record-keeping.</li>
              <li><strong>Consent</strong> — sending you the monthly newsletter, which you can withdraw at any time.</li>
            </ul>

            <h2>How long we keep it</h2>
            <p>
              Enquiries that do not become business are deleted after twenty-four months. Client,
              tenancy and transaction records are held for six years after the relationship ends, as
              required by HMRC and anti-money-laundering rules. Newsletter data is held until you
              unsubscribe.
            </p>

            <h2>Who we share it with</h2>
            <p>
              We share data only where it is necessary to deliver the service: referencing
              providers, deposit protection schemes, contractors attending a repair, our accountants
              and, where legally required, HMRC or the local authority. We never sell your data, and
              we do not share it for third-party marketing.
            </p>

            <h2>Where it is held</h2>
            <p>
              Our website and database are hosted within the UK and the European Economic Area.
              Where any processor operates outside the UK, we rely on adequacy regulations or
              standard contractual clauses.
            </p>

            <h2>Your rights</h2>
            <p>
              Under UK GDPR you have the right to access your data, correct it, ask us to erase it,
              restrict or object to how we use it, and request a portable copy. To exercise any of
              these, email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. We will
              respond within one month.
            </p>
            <p>
              If you are unhappy with our response you can complain to the Information
              Commissioner&apos;s Office at <a href="https://ico.org.uk" rel="nofollow noopener noreferrer" target="_blank">ico.org.uk</a>.
            </p>

            <h2>Cookies</h2>
            <p>
              We use only the strictly necessary cookies required to keep the site working and to
              maintain an administrator session. No tracking or advertising cookies are set.
            </p>

            <h2>Changes</h2>
            <p>
              We will post any changes to this policy on this page and update the date at the top.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

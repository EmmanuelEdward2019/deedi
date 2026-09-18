import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container, Section } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms on which you may use the ${site.legalName} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        intro="The basis on which this website and its listings are provided."
        image="/images/properties/bolton-high-street.jpeg"
        size="sm"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/terms", label: "Terms" },
        ]}
      />

      <Section tone="light">
        <Container>
          <div className="prose-deedi mx-auto max-w-3xl">
            <p className="text-sm text-slate-500">Last updated 17 September 2026</p>

            <h2>About these terms</h2>
            <p>
              This website is operated by {site.legalName}, registered in England and Wales. By
              using the site you accept these terms. If you do not accept them, please do not use
              the site.
            </p>

            <h2>Property and art listings</h2>
            <p>
              Listings are prepared in good faith and are intended as a general guide. They do not
              constitute an offer or form part of any contract. Measurements, floor areas, EPC
              ratings and yield figures are approximate and should be verified by your own surveyor,
              solicitor or accountant before you rely on them.
            </p>
            <p>
              Artwork images are photographed as accurately as we can manage, but colour reproduction
              varies between screens. Dimensions given are for the work itself unless the framed size
              is stated.
            </p>
            <p>
              Availability changes quickly. A property or artwork shown as available may be under
              offer, reserved or sold by the time you enquire.
            </p>

            <h2>Financial information</h2>
            <p>
              Yields, rents and returns quoted on this site are illustrative, based on current
              letting evidence, and are not a forecast. The value of property can fall as well as
              rise. Nothing on this site is financial, tax or investment advice, and you should take
              independent professional advice before committing to a purchase.
            </p>

            <h2>Intellectual property</h2>
            <p>
              All content on this site — including text, photography, artwork images and the Deedi
              name and logo — is owned by {site.legalName} or its licensors and the represented
              artists. You may view and print pages for your own personal, non-commercial use.
              Reproducing, republishing or using any artwork image commercially without written
              permission is not permitted.
            </p>

            <h2>Acceptable use</h2>
            <p>
              You may not use this site to send unsolicited commercial messages, to scrape listings
              for republication, or in any way that damages the site or interferes with other
              people&apos;s use of it.
            </p>

            <h2>Third-party links</h2>
            <p>
              Where we link to other sites — property portals, mapping services, WhatsApp — we do so
              for convenience. We have no control over their content and accept no responsibility
              for it.
            </p>

            <h2>Liability</h2>
            <p>
              We do not exclude liability for death or personal injury caused by our negligence, or
              for fraud. Subject to that, we are not liable for any indirect or consequential loss
              arising from your use of this website.
            </p>

            <h2>Complaints and redress</h2>
            <p>
              If something has gone wrong, please tell us first at{" "}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. We operate a written
              complaints procedure and are a member of a government-approved redress scheme, details
              of which are available on request.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the law of England and Wales, and the courts of England
              and Wales have exclusive jurisdiction.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { GalleryGrid } from "@/components/gallery-grid";
import { ButtonLink, Container, EmptyState, Section } from "@/components/ui";
import { getGalleryCollections, getGalleryItems } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Gallery — Property, Regeneration & Art",
  description:
    "A visual record of the homes we manage, the places we work and the art we place — across Bolton, Salford and Greater Manchester.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery | Deedi Ltd",
    description: "Property, regeneration and original art across the North West.",
    images: ["/images/art/lion-relief.jpeg"],
  },
};

export const revalidate = 300;

export default async function GalleryPage() {
  const [items, collections] = await Promise.all([getGalleryItems(), getGalleryCollections()]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="The work, in pictures."
        intro="Homes, streets and artwork from across the portfolio. Less reading, more looking."
        image="/images/art/lion-relief.jpeg"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/gallery", label: "Gallery" },
        ]}
        align="center"
      />

      <Section tone="light">
        <Container>
          {items.length === 0 ? (
            <EmptyState
              title="The gallery is being hung"
              message="Images are added from the admin dashboard. Once the database is seeded, the full collection appears here."
              action={
                <ButtonLink href="/properties" tone="gold" arrow>
                  Browse properties instead
                </ButtonLink>
              }
            />
          ) : (
            <GalleryGrid items={items} collections={collections} />
          )}
        </Container>
      </Section>

      <Section tone="navy" className="py-16 lg:py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h2 className="font-display text-2xl text-white sm:text-3xl">
                Something here catch your eye?
              </h2>
              <p className="mt-2 max-w-xl text-[0.9375rem] text-white/60">
                Whether it is a street, a scheme or a piece on a wall — we can tell you more about
                any of it.
              </p>
            </div>
            <ButtonLink href="/contact" tone="gold" size="lg" arrow className="shrink-0">
              Start a conversation
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

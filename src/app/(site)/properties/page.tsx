import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PropertyCard } from "@/components/property-card";
import { PropertyFilters } from "@/components/property-filters";
import { ButtonLink, Container, EmptyState, Section } from "@/components/ui";
import { getProperties, getPropertyFacets } from "@/lib/queries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Property for Sale & To Let in Bolton, Salford & Manchester",
  description:
    "Browse houses, apartments, commercial units and investment lots across Greater Manchester. Full management, lettings and sales from Deedi Ltd.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "Property in Greater Manchester | Deedi Ltd",
    description:
      "Houses, apartments and investment portfolios for sale and to let across Bolton, Salford and Manchester.",
    images: ["/images/properties/new-build-townhouses.jpeg"],
  },
};

export const revalidate = 120;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const filters = {
    listing: first(params.listing),
    city: first(params.city),
    type: first(params.type),
    search: first(params.search),
    sort: first(params.sort),
    bedrooms: Number(first(params.bedrooms)) || undefined,
    minPrice: Number(first(params.minPrice)) || undefined,
    maxPrice: Number(first(params.maxPrice)) || undefined,
  };

  const [properties, facets] = await Promise.all([getProperties(filters), getPropertyFacets()]);

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Property listings — Deedi Ltd",
    numberOfItems: properties.length,
    itemListElement: properties.slice(0, 20).map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/properties/${property.slug}`,
      name: property.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      <PageHero
        eyebrow="Property"
        title="Homes, investments and commercial space."
        intro="Everything we currently have available across Bolton, Salford and Greater Manchester — managed, let and sold in-house."
        image="/images/properties/salford-townhouses.jpeg"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/properties", label: "Property" },
        ]}
      />

      <Section tone="light" className="py-10 sm:py-12 lg:py-14">
        <Container>
          <PropertyFilters cities={facets.cities} types={facets.types} total={properties.length} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-0 sm:pt-0 lg:pt-0">
        <Container>
          {properties.length === 0 ? (
            <EmptyState
              title="No properties match those filters"
              message="Try widening the price band or clearing the location filter. We also have off-market stock that never reaches the site — tell us what you are after."
              action={
                <ButtonLink href="/contact" tone="gold" arrow>
                  Register your requirements
                </ButtonLink>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  priority={index < 3}
                  className="reveal"
                />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section tone="navy" className="py-16 lg:py-20">
        <Container>
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h2 className="font-display text-2xl text-white sm:text-3xl">
                Looking for something we haven&apos;t listed?
              </h2>
              <p className="mt-2 max-w-xl text-[0.9375rem] text-white/60">
                Around a third of what we transact never reaches the open market. Tell us your brief
                and we will call you when it lands.
              </p>
            </div>
            <ButtonLink href="/contact" tone="gold" size="lg" arrow className="shrink-0">
              Register your brief
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

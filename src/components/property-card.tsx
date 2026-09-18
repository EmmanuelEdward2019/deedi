import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatPrice, formatRent } from "@/lib/format";
import { Bath, Bed, MapPin, Ruler, Sofa } from "@/components/icons";
import { Badge, StatusBadge, cx } from "@/components/ui";

export function PropertyCard({
  property,
  priority,
  className,
}: {
  property: Property;
  priority?: boolean;
  className?: string;
}) {
  const price =
    property.listing_type === "rent"
      ? formatRent(property.price, property.rent_period)
      : formatPrice(property.price);

  return (
    <article
      className={cx(
        "group flex h-full flex-col overflow-hidden border border-sand-200 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <Link href={`/properties/${property.slug}`} className="relative block aspect-[4/3] overflow-hidden img-zoom">
        <Image
          src={property.hero_image}
          alt={property.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="scrim-soft absolute inset-x-0 bottom-0 h-1/2" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge tone="navy">{property.listing_type === "rent" ? "To Let" : "For Sale"}</Badge>
          {property.status !== "available" && <StatusBadge status={property.status} />}
        </div>

        {property.featured && (
          <div className="absolute top-4 right-4">
            <Badge tone="gold">Featured</Badge>
          </div>
        )}

        <p className="font-display absolute bottom-4 left-4 text-2xl text-white drop-shadow-sm">
          {price}
          {property.price_qualifier && property.listing_type === "sale" ? (
            <span className="ml-2 align-middle text-[0.6875rem] font-normal tracking-wide text-white/70 uppercase">
              {property.price_qualifier}
            </span>
          ) : null}
        </p>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-[0.75rem] tracking-wide text-slate-500 uppercase">
          <MapPin className="size-3.5 text-gold-500" />
          {property.city}, {property.postcode}
        </p>

        <h3 className="font-display mt-2.5 text-xl leading-snug text-navy-900">
          <Link href={`/properties/${property.slug}`} className="transition-colors hover:text-gold-600">
            {property.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">{property.summary}</p>

        <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sand-200 pt-4 text-sm text-navy-800">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="size-4 text-royal-600" />
              <dt className="sr-only">Bedrooms</dt>
              <dd>
                {property.bedrooms} <span className="text-slate-500">bed</span>
              </dd>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="size-4 text-royal-600" />
              <dt className="sr-only">Bathrooms</dt>
              <dd>
                {property.bathrooms} <span className="text-slate-500">bath</span>
              </dd>
            </div>
          )}
          {property.receptions > 0 && (
            <div className="flex items-center gap-1.5">
              <Sofa className="size-4 text-royal-600" />
              <dt className="sr-only">Receptions</dt>
              <dd>
                {property.receptions} <span className="text-slate-500">recep</span>
              </dd>
            </div>
          )}
          {property.floor_area_sqft ? (
            <div className="flex items-center gap-1.5">
              <Ruler className="size-4 text-royal-600" />
              <dt className="sr-only">Floor area</dt>
              <dd>
                {property.floor_area_sqft.toLocaleString("en-GB")}{" "}
                <span className="text-slate-500">sq ft</span>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </article>
  );
}

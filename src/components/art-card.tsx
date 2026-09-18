import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Badge, StatusBadge, cx } from "@/components/ui";

export function ArtCard({
  artwork,
  priority,
  className,
}: {
  artwork: Artwork;
  priority?: boolean;
  className?: string;
}) {
  const price = artwork.price_on_request ? "Price on request" : formatPrice(artwork.price);

  return (
    <article className={cx("group flex h-full flex-col", className)}>
      <Link
        href={`/art/${artwork.slug}`}
        className="img-zoom relative block aspect-[4/5] overflow-hidden bg-navy-900"
      >
        <Image
          src={artwork.hero_image}
          alt={`${artwork.title} by ${artwork.artist}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-navy-950/0 transition-colors duration-500 group-hover:bg-navy-950/20" />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {artwork.status !== "available" && <StatusBadge status={artwork.status} />}
          {artwork.featured && artwork.status === "available" && <Badge tone="gold">Featured</Badge>}
        </div>

        <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-block bg-white/95 px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-navy-900 uppercase backdrop-blur">
            View artwork
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow text-gold-600">{artwork.category}</p>
        <h3 className="font-display mt-2 text-xl leading-snug text-navy-900">
          <Link href={`/art/${artwork.slug}`} className="transition-colors hover:text-gold-600">
            {artwork.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-slate-500">{artwork.artist}</p>

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">{artwork.summary}</p>

        <div className="mt-4 flex items-baseline justify-between border-t border-sand-200 pt-4">
          <p className="font-display text-lg text-navy-900">{price}</p>
          {artwork.width_cm && artwork.height_cm ? (
            <p className="text-xs tracking-wide text-slate-500">
              {artwork.width_cm} × {artwork.height_cm} cm
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

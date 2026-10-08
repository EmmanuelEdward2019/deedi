import Image from "next/image";
import { site } from "@/lib/site";
import { cx } from "@/components/ui";

/**
 * Lion emblem + neon "DEEDI LTD." wordmark, optionally with the
 * "Guaranteed Customer Satisfaction" statement underneath. The artwork is
 * light-on-transparent, so it is designed for the dark navy/royal surfaces.
 */
export function BrandLogo({
  statement = false,
  priority = false,
  className,
  emblemClassName = "h-11 w-auto sm:h-12",
  wordmarkClassName = "h-7 w-auto sm:h-8",
}: {
  statement?: boolean;
  priority?: boolean;
  className?: string;
  emblemClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <Image
        src="/images/brand/deedi-emblem.png"
        alt=""
        width={522}
        height={600}
        priority={priority}
        className={emblemClassName}
      />
      <span className="flex flex-col items-center gap-1.5">
        <Image
          src="/images/brand/deedi-wordmark.png"
          alt={site.name}
          width={1200}
          height={255}
          priority={priority}
          className={wordmarkClassName}
        />
        {statement ? (
          <Image
            src="/images/brand/deedi-statement.png"
            alt={site.statement}
            width={1084}
            height={58}
            className="h-auto w-[88%]"
          />
        ) : null}
      </span>
    </span>
  );
}

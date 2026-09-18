import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container, Eyebrow, cx } from "@/components/ui";

export interface Crumb {
  href: string;
  label: string;
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  crumbs,
  children,
  size = "md",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  image: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
}) {
  const heights = {
    sm: "min-h-[38vh] py-24",
    md: "min-h-[52vh] py-28",
    lg: "min-h-[68vh] py-32",
  };

  return (
    <section className="relative overflow-hidden bg-navy-950">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/65 to-navy-950/95" />

      <Container
        className={cx(
          "relative flex flex-col justify-center",
          heights[size],
          align === "center" && "items-center text-center",
        )}
      >
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] text-white/45">
              {crumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <span className="text-gold-500/50">/</span>}
                  {index === crumbs.length - 1 ? (
                    <span className="text-white/75">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="transition-colors hover:text-gold-300">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow ? <Eyebrow tone="white">{eyebrow}</Eyebrow> : null}

        <h1
          className={cx(
            "font-display mt-5 max-w-3xl text-4xl leading-[1.08] font-medium tracking-[-0.02em] text-white balance sm:text-5xl lg:text-6xl",
            align === "center" && "mx-auto",
          )}
        >
          {title}
        </h1>

        {intro ? (
          <p
            className={cx(
              "mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-white/70 pretty",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        ) : null}

        {children ? <div className="mt-9">{children}</div> : null}
      </Container>
    </section>
  );
}

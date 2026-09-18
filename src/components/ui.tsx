import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "@/components/icons";

export function cx(...values: unknown[]) {
  return values.filter((v): v is string => typeof v === "string" && v.length > 0).join(" ");
}

/* ------------------------------------------------------------------ */
/* layout                                                              */
/* ------------------------------------------------------------------ */

export function Container({
  children,
  className,
  wide,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div className={cx("mx-auto w-full px-4 sm:px-6 lg:px-8", wide ? "max-w-[1560px]" : "max-w-7xl", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  tone = "light",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "sand" | "navy";
  id?: string;
}) {
  const tones = {
    light: "bg-white",
    sand: "bg-sand-50",
    navy: "surface-navy",
  };
  return (
    <section id={id} className={cx("py-16 sm:py-20 lg:py-28", tones[tone], className)}>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* headings                                                            */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: "gold" | "navy" | "white";
  className?: string;
}) {
  const tones = {
    gold: "text-gold-600",
    navy: "text-royal-700",
    white: "text-gold-300",
  };
  return <p className={cx("eyebrow", tones[tone], className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cx(
        "flex flex-col gap-6",
        action && !centered && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cx("max-w-2xl", centered && "mx-auto text-center")}>
        {eyebrow ? (
          <Eyebrow tone={tone === "light" ? "white" : "gold"} className={cx("rule-gold", centered && "rule-gold-center")}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2
          className={cx(
            "font-display mt-5 text-3xl leading-[1.15] font-medium tracking-[-0.015em] balance sm:text-4xl lg:text-[2.75rem]",
            tone === "light" ? "text-white" : "text-navy-900",
          )}
        >
          {title}
        </h2>
        {intro ? (
          <p
            className={cx(
              "mt-4 text-[1.0625rem] leading-relaxed pretty",
              tone === "light" ? "text-white/70" : "text-slate-600",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className={cx("shrink-0", centered && "mx-auto")}>{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* buttons                                                             */
/* ------------------------------------------------------------------ */

type ButtonTone = "gold" | "royal" | "outline" | "outlineLight" | "ghost" | "white";

const buttonTones: Record<ButtonTone, string> = {
  gold: "bg-gold-500 text-white hover:bg-gold-600 border border-gold-500 hover:border-gold-600",
  royal: "bg-royal-700 text-white hover:bg-royal-800 border border-royal-700 hover:border-royal-800",
  white: "bg-white text-navy-900 hover:bg-sand-100 border border-white",
  outline: "border border-navy-900/20 text-navy-900 hover:border-gold-500 hover:text-gold-600",
  outlineLight: "border border-white/30 text-white hover:border-gold-400 hover:text-gold-300",
  ghost: "text-navy-900 hover:text-gold-600",
};

const buttonBase =
  "tap-target group inline-flex items-center justify-center gap-2.5 text-[0.8125rem] font-semibold tracking-[0.12em] uppercase transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55";

export function Button({
  children,
  tone = "gold",
  size = "md",
  className,
  arrow,
  ...props
}: ComponentProps<"button"> & { tone?: ButtonTone; size?: "sm" | "md" | "lg"; arrow?: boolean }) {
  const sizes = { sm: "px-4 py-2.5", md: "px-6 py-3.5", lg: "px-8 py-4" };
  return (
    <button {...props} className={cx(buttonBase, buttonTones[tone], sizes[size], className)}>
      {children}
      {arrow ? <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" /> : null}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  tone = "gold",
  size = "md",
  className,
  arrow,
  ...props
}: ComponentProps<typeof Link> & { tone?: ButtonTone; size?: "sm" | "md" | "lg"; arrow?: boolean }) {
  const sizes = { sm: "px-4 py-2.5", md: "px-6 py-3.5", lg: "px-8 py-4" };
  return (
    <Link {...props} href={href} className={cx(buttonBase, buttonTones[tone], sizes[size], className)}>
      {children}
      {arrow ? <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" /> : null}
    </Link>
  );
}

/** Understated text link with an animated gold underline. */
export function TextLink({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group inline-flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] transition-colors",
        tone === "light" ? "text-gold-300 hover:text-white" : "text-royal-700 hover:text-gold-600",
        className,
      )}
    >
      <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-current">
        {children}
      </span>
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* badges                                                              */
/* ------------------------------------------------------------------ */

export function Badge({
  children,
  tone = "navy",
  className,
}: {
  children: ReactNode;
  tone?: "navy" | "gold" | "green" | "amber" | "slate" | "red";
  className?: string;
}) {
  const tones = {
    navy: "bg-navy-900 text-white",
    gold: "bg-gold-500 text-white",
    green: "bg-emerald-600 text-white",
    amber: "bg-sunlight-500 text-navy-900",
    slate: "bg-slate-200 text-slate-700",
    red: "bg-rose-600 text-white",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Maps a listing/artwork status onto a badge colour. */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: "green" | "amber" | "slate" | "red" | "navy"; label: string }> = {
    available: { tone: "green", label: "Available" },
    under_offer: { tone: "amber", label: "Under Offer" },
    let_agreed: { tone: "amber", label: "Let Agreed" },
    sold: { tone: "slate", label: "Sold" },
    reserved: { tone: "amber", label: "Reserved" },
    draft: { tone: "slate", label: "Draft" },
    published: { tone: "green", label: "Published" },
    new: { tone: "red", label: "New" },
    read: { tone: "navy", label: "Read" },
    replied: { tone: "green", label: "Replied" },
    archived: { tone: "slate", label: "Archived" },
  };
  const { tone, label } = map[status] ?? { tone: "slate" as const, label: status };
  return <Badge tone={tone}>{label}</Badge>;
}

/* ------------------------------------------------------------------ */
/* misc                                                                */
/* ------------------------------------------------------------------ */

export function GoldRule({ className }: { className?: string }) {
  return <div className={cx("hairline-gold h-px w-full", className)} />;
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-sand-200 bg-sand-50 px-6 py-20 text-center">
      <h3 className="font-display text-xl text-navy-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{message}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

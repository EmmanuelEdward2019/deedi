import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/components/ui";

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-sand-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl text-navy-900">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("border border-sand-200 bg-white", className)}>{children}</div>
  );
}

export function AdminButton({
  children,
  tone = "royal",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { tone?: "royal" | "gold" | "outline" | "danger"; size?: "sm" | "md" }) {
  const tones = {
    royal: "bg-royal-700 text-white hover:bg-royal-800",
    gold: "bg-gold-500 text-white hover:bg-gold-600",
    outline: "border border-sand-200 text-navy-800 hover:border-gold-400 hover:text-gold-600",
    danger: "border border-rose-200 text-rose-600 hover:bg-rose-50",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-[0.8125rem]" };

  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function AdminLink({
  children,
  tone = "royal",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & {
  tone?: "royal" | "gold" | "outline" | "danger";
  size?: "sm" | "md";
}) {
  const tones = {
    royal: "bg-royal-700 text-white hover:bg-royal-800",
    gold: "bg-gold-500 text-white hover:bg-gold-600",
    outline: "border border-sand-200 text-navy-800 hover:border-gold-400 hover:text-gold-600",
    danger: "border border-rose-200 text-rose-600 hover:bg-rose-50",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-[0.8125rem]" };

  return (
    <Link
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 font-semibold transition-colors",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  sub,
  href,
  Icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  href?: string;
  Icon: (props: { className?: string }) => ReactNode;
}) {
  const body = (
    <div className="group flex items-start justify-between border border-sand-200 bg-white p-6 transition-colors hover:border-gold-400">
      <div>
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-400 uppercase">
          {label}
        </p>
        <p className="font-display mt-3 text-4xl text-navy-900">{value}</p>
        {sub ? <p className="mt-1.5 text-xs text-slate-500">{sub}</p> : null}
      </div>
      <span className="flex size-11 items-center justify-center bg-sand-50 text-royal-700 transition-colors group-hover:bg-gold-500 group-hover:text-white">
        <Icon className="size-5" />
      </span>
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-baseline justify-between gap-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase"
    >
      <span>{children}</span>
      {hint ? <span className="font-normal tracking-normal text-slate-400 normal-case">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full border border-sand-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 transition-colors placeholder:text-slate-400 focus:border-gold-500 focus:outline-none";

export const selectClass = `${inputClass} appearance-none`;

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-sand-200 bg-white">
      <header className="border-b border-sand-200 bg-sand-50 px-6 py-4">
        <h2 className="text-[0.8125rem] font-semibold tracking-[0.1em] text-navy-900 uppercase">
          {title}
        </h2>
        {description ? <p className="mt-1 text-xs text-slate-500">{description}</p> : null}
      </header>
      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
}

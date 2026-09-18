"use client";

import Link, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/components/ui";

const tones = {
  royal: "bg-royal-700 text-white hover:bg-royal-800",
  gold: "bg-gold-500 text-white hover:bg-gold-600",
  outline: "border border-sand-200 text-navy-800 hover:border-gold-400 hover:text-gold-600",
  danger: "border border-rose-200 text-rose-600 hover:bg-rose-50",
};

const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-5 py-2.5 text-[0.8125rem]" };

/**
 * Spinner for the navigation currently in flight. useLinkStatus only reports
 * the status of an ancestor Link, so this has to render inside one.
 */
function LinkSpinner() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span
      aria-hidden
      className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
    />
  );
}

/** Admin navigation button that reports its own pending state on click. */
export function AdminLink({
  children,
  tone = "royal",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & {
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
}) {
  return (
    <Link
      {...props}
      className={cx(
        "tap-target inline-flex items-center justify-center gap-2 font-semibold transition-colors active:scale-[0.98] active:opacity-80",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
      <LinkSpinner />
    </Link>
  );
}

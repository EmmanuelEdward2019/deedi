"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cx } from "@/components/ui";

const SORTS = [
  { label: "Featured", value: "" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Title A–Z", value: "title-asc" },
];

export function ArtFilters({
  categories,
  mediums,
  total,
}: {
  categories: string[];
  mediums: string[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function apply(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  const category = params.get("category") ?? "";

  return (
    <div className={cx("space-y-5", pending && "opacity-70")}>
      {/* Category pills */}
      <div className="rail flex gap-2 overflow-x-auto pb-1">
        {[{ label: "All work", value: "" }, ...categories.map((c) => ({ label: c, value: c }))].map(
          (option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => apply({ category: option.value })}
              className={cx(
                "shrink-0 border px-5 py-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors",
                category === option.value
                  ? "border-gold-500 bg-gold-500 text-white"
                  : "border-sand-200 bg-white text-slate-500 hover:border-gold-400 hover:text-navy-900",
              )}
            >
              {option.label}
            </button>
          ),
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-sand-200 pt-4">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-navy-900">{total}</span>{" "}
          {total === 1 ? "work" : "works"} available
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Medium
            <select
              value={params.get("medium") ?? ""}
              onChange={(event) => apply({ medium: event.target.value })}
              className="border border-sand-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-gold-500 focus:outline-none"
            >
              <option value="">All media</option>
              {mediums.map((medium) => (
                <option key={medium} value={medium}>
                  {medium}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-500">
            Sort
            <select
              value={params.get("sort") ?? ""}
              onChange={(event) => apply({ sort: event.target.value })}
              className="border border-sand-200 bg-white px-3 py-2 text-xs text-navy-900 focus:border-gold-500 focus:outline-none"
            >
              {SORTS.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

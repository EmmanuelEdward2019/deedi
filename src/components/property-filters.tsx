"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Close, Search } from "@/components/icons";
import { cx } from "@/components/ui";

const PRICE_BANDS = [
  { label: "No max", value: "" },
  { label: "£150k", value: "150000" },
  { label: "£250k", value: "250000" },
  { label: "£400k", value: "400000" },
  { label: "£600k", value: "600000" },
  { label: "£1m+", value: "5000000" },
];

const SORTS = [
  { label: "Featured first", value: "" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Most bedrooms", value: "beds-desc" },
];

export function PropertyFilters({
  cities,
  types,
  total,
}: {
  cities: string[];
  types: string[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState(params.get("search") ?? "");

  useEffect(() => setSearch(params.get("search") ?? ""), [params]);

  function apply(updates: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  const active = ["listing", "city", "type", "bedrooms", "maxPrice", "search"].filter((key) =>
    params.get(key),
  );

  const selectClass =
    "w-full appearance-none border border-sand-200 bg-white px-4 py-3 text-sm text-navy-900 transition-colors hover:border-gold-400 focus:border-gold-500 focus:outline-none";

  return (
    <div className={cx("space-y-4", pending && "opacity-70")}>
      {/* Listing type tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex border border-sand-200">
          {[
            { label: "All", value: "" },
            { label: "For sale", value: "sale" },
            { label: "To let", value: "rent" },
          ].map((tab) => {
            const selected = (params.get("listing") ?? "") === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => apply({ listing: tab.value })}
                className={cx(
                  "px-5 py-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors",
                  selected ? "bg-navy-900 text-white" : "bg-white text-slate-500 hover:text-navy-900",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-slate-500">
          <span className="font-semibold text-navy-900">{total}</span>{" "}
          {total === 1 ? "property" : "properties"}
        </p>
      </div>

      {/* Filter grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            apply({ search });
          }}
          className="relative sm:col-span-2 lg:col-span-1"
        >
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Town or postcode"
            aria-label="Search properties"
            className="w-full border border-sand-200 bg-white py-3 pr-4 pl-10 text-sm text-navy-900 transition-colors hover:border-gold-400 focus:border-gold-500 focus:outline-none"
          />
        </form>

        <select
          value={params.get("city") ?? ""}
          onChange={(event) => apply({ city: event.target.value })}
          aria-label="Location"
          className={selectClass}
        >
          <option value="">All locations</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={params.get("type") ?? ""}
          onChange={(event) => apply({ type: event.target.value })}
          aria-label="Property type"
          className={selectClass}
        >
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={params.get("bedrooms") ?? ""}
          onChange={(event) => apply({ bedrooms: event.target.value })}
          aria-label="Minimum bedrooms"
          className={selectClass}
        >
          <option value="">Any beds</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ beds
            </option>
          ))}
        </select>

        <select
          value={params.get("maxPrice") ?? ""}
          onChange={(event) => apply({ maxPrice: event.target.value })}
          aria-label="Maximum price"
          className={selectClass}
        >
          {PRICE_BANDS.map((band) => (
            <option key={band.label} value={band.value}>
              {band.value ? `Up to ${band.label}` : band.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active filters + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          {active.length > 0 && (
            <>
              {active.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => apply({ [key]: "" })}
                  className="inline-flex items-center gap-1.5 border border-sand-200 bg-sand-50 px-3 py-1.5 text-xs text-navy-800 transition-colors hover:border-gold-400"
                >
                  {params.get(key)}
                  <Close className="size-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}
                className="px-2 text-xs text-slate-500 underline underline-offset-4 transition-colors hover:text-gold-600"
              >
                Clear all
              </button>
            </>
          )}
        </div>

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
  );
}

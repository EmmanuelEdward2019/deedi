"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "@/components/icons";

const PRICE_BANDS = [
  { label: "No max price", value: "" },
  { label: "Up to £150,000", value: "150000" },
  { label: "Up to £250,000", value: "250000" },
  { label: "Up to £400,000", value: "400000" },
  { label: "Up to £600,000", value: "600000" },
  { label: "£600,000+", value: "5000000" },
];

/** Hero search bar — composes a query string and hands off to /properties. */
export function PropertySearch({ cities = [] }: { cities?: string[] }) {
  const router = useRouter();
  const [listing, setListing] = useState("sale");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({ listing });
    if (city) params.set("city", city);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/properties?${params.toString()}`);
  }

  const fieldClass =
    "w-full appearance-none bg-transparent px-4 py-3.5 text-sm text-navy-900 focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="bg-white/95 p-2 shadow-2xl backdrop-blur-sm">
      <div className="flex gap-1 p-1">
        {[
          { value: "sale", label: "For sale" },
          { value: "rent", label: "To let" },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setListing(tab.value)}
            className={`px-5 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors ${
              listing === tab.value
                ? "bg-navy-900 text-white"
                : "text-slate-500 hover:text-navy-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-px bg-sand-200 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_auto]">
        <label className="bg-white">
          <span className="sr-only">Location</span>
          <select value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass}>
            <option value="">All locations</option>
            {cities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="bg-white">
          <span className="sr-only">Minimum bedrooms</span>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={fieldClass}>
            <option value="">Any bedrooms</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+ bedrooms
              </option>
            ))}
          </select>
        </label>

        <label className="bg-white">
          <span className="sr-only">Maximum price</span>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={fieldClass}>
            {PRICE_BANDS.map((band) => (
              <option key={band.label} value={band.value}>
                {band.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="flex items-center justify-center gap-2.5 bg-gold-500 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.13em] text-white uppercase transition-colors hover:bg-gold-600"
        >
          <Search className="size-4" />
          Search
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { FieldLabel, inputClass } from "@/components/admin/admin-ui";
import { cx } from "@/components/ui";

const TITLE_IDEAL: [number, number] = [45, 60];
const DESCRIPTION_IDEAL: [number, number] = [120, 158];

function Meter({
  value,
  ideal,
  label,
}: {
  value: number;
  ideal: [number, number];
  label: string;
}) {
  const [min, max] = ideal;
  const tone =
    value === 0 ? "slate" : value < min ? "amber" : value <= max ? "emerald" : "rose";

  const message =
    value === 0
      ? `Falls back to the post ${label}`
      : value < min
        ? "A little short"
        : value <= max
          ? "Good length"
          : "Likely to be truncated";

  const colours = {
    slate: "bg-slate-300 text-slate-500",
    amber: "bg-amber-400 text-amber-700",
    emerald: "bg-emerald-500 text-emerald-700",
    rose: "bg-rose-500 text-rose-700",
  } as const;

  return (
    <div className="mt-1.5 flex items-center gap-2.5">
      <div className="h-1 flex-1 overflow-hidden bg-sand-200">
        <div
          className={cx("h-full transition-all", colours[tone].split(" ")[0])}
          style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        />
      </div>
      <span className={cx("shrink-0 text-[0.6875rem]", colours[tone].split(" ")[1])}>
        {value}/{max} · {message}
      </span>
    </div>
  );
}

/**
 * Search-result preview plus length meters — the part of an SEO plugin that
 * actually changes what people write.
 */
export function SeoPanel({
  siteUrl,
  slug,
  fallbackTitle,
  fallbackDescription,
  defaults,
}: {
  siteUrl: string;
  slug: string;
  fallbackTitle: string;
  fallbackDescription: string;
  defaults?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    focusKeyword?: string | null;
    canonicalUrl?: string | null;
  };
}) {
  const [metaTitle, setMetaTitle] = useState(defaults?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(defaults?.metaDescription ?? "");
  const [keyword, setKeyword] = useState(defaults?.focusKeyword ?? "");

  const shownTitle = metaTitle || fallbackTitle || "Your post title";
  const shownDescription =
    metaDescription || fallbackDescription || "Your meta description appears here.";

  const lowerKeyword = keyword.trim().toLowerCase();
  const checks = lowerKeyword
    ? [
        { label: "In the title", pass: shownTitle.toLowerCase().includes(lowerKeyword) },
        { label: "In the description", pass: shownDescription.toLowerCase().includes(lowerKeyword) },
        { label: "In the URL slug", pass: slug.toLowerCase().includes(lowerKeyword.replace(/\s+/g, "-")) },
      ]
    : [];

  return (
    <div className="space-y-5">
      {/* Google-style preview */}
      <div className="border border-sand-200 bg-sand-50 p-4">
        <p className="mb-3 text-[0.625rem] font-semibold tracking-[0.14em] text-slate-400 uppercase">
          Search result preview
        </p>
        <div className="bg-white p-4">
          <p className="truncate text-xs text-emerald-700">
            {siteUrl.replace(/^https?:\/\//, "")} › blog › {slug || "post-slug"}
          </p>
          <p className="mt-1 line-clamp-1 text-[1.0625rem] text-[#1a0dab]">{shownTitle}</p>
          <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-[#4d5156]">
            {shownDescription}
          </p>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="focus_keyword" hint="What should this rank for?">
          Focus keyphrase
        </FieldLabel>
        <input
          id="focus_keyword"
          name="focus_keyword"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="buy-to-let yields Bolton"
          className={inputClass}
        />

        {checks.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {checks.map((check) => (
              <li key={check.label} className="flex items-center gap-2 text-xs">
                <span
                  className={cx(
                    "flex size-4 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold text-white",
                    check.pass ? "bg-emerald-500" : "bg-slate-300",
                  )}
                >
                  {check.pass ? "✓" : "–"}
                </span>
                <span className={check.pass ? "text-emerald-700" : "text-slate-500"}>
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="meta_title">SEO title</FieldLabel>
        <input
          id="meta_title"
          name="meta_title"
          value={metaTitle}
          onChange={(event) => setMetaTitle(event.target.value)}
          placeholder={fallbackTitle || "Defaults to the post title"}
          className={inputClass}
        />
        <Meter value={metaTitle.length} ideal={TITLE_IDEAL} label="title" />
      </div>

      <div>
        <FieldLabel htmlFor="meta_description">Meta description</FieldLabel>
        <textarea
          id="meta_description"
          name="meta_description"
          rows={3}
          value={metaDescription}
          onChange={(event) => setMetaDescription(event.target.value)}
          placeholder={fallbackDescription || "Defaults to the excerpt"}
          className={inputClass}
        />
        <Meter value={metaDescription.length} ideal={DESCRIPTION_IDEAL} label="excerpt" />
      </div>

      <div>
        <FieldLabel htmlFor="canonical_url" hint="Only if this was published elsewhere first">
          Canonical URL
        </FieldLabel>
        <input
          id="canonical_url"
          name="canonical_url"
          type="url"
          defaultValue={defaults?.canonicalUrl ?? ""}
          placeholder={`${siteUrl}/blog/${slug || "post-slug"}`}
          className={inputClass}
        />
      </div>
    </div>
  );
}

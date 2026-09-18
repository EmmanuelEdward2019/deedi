"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import { ArrowLeft, ArrowRight, Close } from "@/components/icons";
import { cx } from "@/components/ui";

/** Filterable masonry gallery with a keyboard-navigable lightbox. */
export function GalleryGrid({
  items,
  collections,
}: {
  items: GalleryItem[];
  collections: string[];
}) {
  const [filter, setFilter] = useState("");
  const [active, setActive] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter ? items.filter((item) => item.collection === filter) : items),
    [items, filter],
  );

  const count = visible.length;
  const next = useCallback(() => setActive((i) => (i === null ? null : (i + 1) % count)), [count]);
  const previous = useCallback(
    () => setActive((i) => (i === null ? null : (i - 1 + count) % count)),
    [count],
  );

  useEffect(() => {
    if (active === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, next, previous]);

  const current = active === null ? null : visible[active];

  return (
    <>
      <div className="rail mb-10 flex gap-2 overflow-x-auto pb-1">
        {[{ label: "Everything", value: "" }, ...collections.map((c) => ({ label: c, value: c }))].map(
          (option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setFilter(option.value);
                setActive(null);
              }}
              className={cx(
                "shrink-0 border px-5 py-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors",
                filter === option.value
                  ? "border-gold-500 bg-gold-500 text-white"
                  : "border-sand-200 bg-white text-slate-500 hover:border-gold-400 hover:text-navy-900",
              )}
            >
              {option.label}
            </button>
          ),
        )}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {visible.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(index)}
            className="img-zoom group relative block w-full overflow-hidden break-inside-avoid bg-navy-900 text-left"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={index % 3 === 0 ? 1000 : index % 3 === 1 ? 600 : 800}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full object-cover"
            />
            <div className="scrim absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-[0.625rem] font-semibold tracking-[0.16em] text-gold-300 uppercase">
                {item.collection}
              </p>
              <h3 className="font-display mt-1 text-lg text-white">{item.title}</h3>
              {item.caption ? <p className="mt-1 text-sm text-white/65">{item.caption}</p> : null}
            </div>
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-navy-950/96 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 flex size-11 items-center justify-center text-white/70 transition-colors hover:text-white"
          >
            <Close className="size-7" />
          </button>

          <div className="relative h-full max-h-[78vh] w-full max-w-6xl">
            <Image
              src={current.image}
              alt={current.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="mt-5 max-w-xl text-center">
            <p className="text-[0.625rem] font-semibold tracking-[0.16em] text-gold-300 uppercase">
              {current.collection}
            </p>
            <h2 className="font-display mt-1.5 text-xl text-white">{current.title}</h2>
            {current.caption ? (
              <p className="mt-1.5 text-sm text-white/55">{current.caption}</p>
            ) : null}
            <p className="mt-3 text-[0.6875rem] tracking-[0.14em] text-white/35 uppercase">
              {(active ?? 0) + 1} / {count}
            </p>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous"
                className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <ArrowLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <ArrowRight className="size-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

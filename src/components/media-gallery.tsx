"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Close } from "@/components/icons";
import { cx } from "@/components/ui";

/** Main image with thumbnail strip and a full-screen lightbox. */
export function MediaGallery({
  images,
  alt,
  aspect = "aspect-[16/10]",
}: {
  images: string[];
  alt: string;
  aspect?: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const previous = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (!lightbox) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    }

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, next, previous]);

  if (count === 0) return null;

  return (
    <>
      <div className="space-y-3">
        <div className={cx("group relative overflow-hidden bg-navy-900", aspect)}>
          <Image
            src={images[index]}
            alt={`${alt} — image ${index + 1} of ${count}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />

          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute inset-0 cursor-zoom-in"
            aria-label="Open full screen"
          />

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous image"
                className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center bg-white/90 text-navy-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center bg-white/90 text-navy-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <ArrowRight className="size-5" />
              </button>
            </>
          )}

          <span className="pointer-events-none absolute right-4 bottom-4 bg-navy-950/70 px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
            {index + 1} / {count}
          </span>
        </div>

        {count > 1 && (
          <div className="rail flex gap-3 overflow-x-auto pb-1">
            {images.map((image, i) => (
              <button
                key={image + i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === index}
                className={cx(
                  "relative aspect-[4/3] w-28 shrink-0 overflow-hidden transition-all duration-300",
                  i === index ? "ring-2 ring-gold-500" : "opacity-60 hover:opacity-100",
                )}
              >
                <Image src={image} alt="" fill sizes="112px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-navy-950/96 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} gallery`}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 flex size-11 items-center justify-center text-white/70 transition-colors hover:text-white"
          >
            <Close className="size-7" />
          </button>

          <div className="relative h-full max-h-[85vh] w-full max-w-6xl">
            <Image
              src={images[index]}
              alt={`${alt} — image ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous image"
                className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <ArrowLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 items-center justify-center border border-white/20 text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                <ArrowRight className="size-6" />
              </button>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.75rem] tracking-[0.14em] text-white/50 uppercase">
                {index + 1} / {count}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Close, Plus, Image as ImageIcon } from "@/components/icons";
import { cx } from "@/components/ui";
import { FieldLabel, inputClass } from "@/components/admin/admin-ui";
import { ACCEPTED_IMAGE_TYPES, useUpload } from "@/components/admin/use-upload";

/** Shared upload feedback shown under both field variants. */
function UploadNotice({
  busy,
  progress,
  error,
}: {
  busy: boolean;
  progress: { done: number; total: number } | null;
  error: string | null;
}) {
  if (busy) {
    return (
      <p className="mt-2 flex items-center gap-2 text-xs text-royal-700">
        <span className="size-3 animate-spin rounded-full border-2 border-royal-700 border-t-transparent" />
        {progress && progress.total > 1
          ? `Uploading ${progress.done + 1} of ${progress.total}…`
          : "Uploading…"}
      </p>
    );
  }
  if (error) {
    return <p className="mt-2 text-xs text-rose-600">{error}</p>;
  }
  return null;
}

/**
 * Manages an ordered list of image paths. The first image becomes the hero
 * shot; both values are submitted as hidden inputs.
 */
export function ImageField({
  name = "images",
  heroName = "hero_image",
  library,
  initial = [],
  label = "Images",
}: {
  name?: string;
  heroName?: string;
  library: string[];
  initial?: string[];
  label?: string;
}) {
  const [images, setImages] = useState<string[]>(initial);
  const [url, setUrl] = useState("");
  const [picking, setPicking] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function add(value: string) {
    const trimmed = value.trim();
    if (!trimmed || images.includes(trimmed)) return;
    setImages([...images, trimmed]);
  }

  const onUploaded = useCallback((urls: string[]) => {
    setImages((current) => [...current, ...urls.filter((u) => !current.includes(u))]);
  }, []);

  const { busy, error, progress, dragging, upload, dropZone } = useUpload(onUploaded);

  function remove(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
  }

  return (
    <div
      {...dropZone}
      className={cx(
        "rounded transition-colors",
        dragging && "outline-2 outline-offset-4 outline-dashed outline-gold-500",
      )}
    >
      <FieldLabel hint="First image is the cover">{label}</FieldLabel>

      {/* Hidden values for the server action */}
      <input type="hidden" name={name} value={images.join("\n")} />
      <input type="hidden" name={heroName} value={images[0] ?? ""} />

      {images.length > 0 && (
        <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <li key={image} className="group relative aspect-[4/3] overflow-hidden bg-sand-100">
              <Image src={image} alt="" fill sizes="200px" className="object-cover" />

              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-gold-500 px-2 py-0.5 text-[0.5625rem] font-bold tracking-[0.12em] text-white uppercase">
                  Cover
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-navy-950/75 p-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move earlier"
                    className="p-1 text-white disabled:opacity-30"
                  >
                    <ArrowLeft className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    aria-label="Move later"
                    className="p-1 text-white disabled:opacity-30"
                  >
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove image"
                  className="p-1 text-rose-300 hover:text-rose-200"
                >
                  <Close className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) void upload(event.target.files);
            event.target.value = "";
          }}
        />

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={busy}
          className="tap-target inline-flex items-center gap-2 bg-royal-700 px-4 py-2.5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-royal-800 active:opacity-80 disabled:opacity-60"
        >
          <ImageIcon className="size-4" />
          {busy ? "Uploading…" : "Upload from device"}
        </button>

        <button
          type="button"
          onClick={() => setPicking((value) => !value)}
          className="tap-target inline-flex items-center gap-2 border border-sand-200 px-4 py-2.5 text-[0.8125rem] font-semibold text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600 active:opacity-80"
        >
          <Plus className="size-4" />
          {picking ? "Close library" : "Choose from library"}
        </button>

        <div className="flex min-w-[16rem] flex-1 gap-2">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add(url);
                setUrl("");
              }
            }}
            placeholder="…or paste an image URL"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              add(url);
              setUrl("");
            }}
            className="shrink-0 bg-royal-700 px-4 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-royal-800"
          >
            Add
          </button>
        </div>
      </div>

      <UploadNotice busy={busy} progress={progress} error={error} />

      <p className="mt-2 text-xs text-slate-400">
        Drag images straight onto this area, or upload from your device. JPG, PNG, WebP,
        AVIF or GIF, up to 8MB each.
      </p>

      {picking && (
        <div className="mt-4 max-h-80 overflow-y-auto border border-sand-200 bg-sand-50 p-3">
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {library.map((image) => {
              const selected = images.includes(image);
              return (
                <li key={image}>
                  <button
                    type="button"
                    onClick={() => (selected ? remove(images.indexOf(image)) : add(image))}
                    className={cx(
                      "relative block aspect-square w-full overflow-hidden transition-all",
                      selected ? "ring-2 ring-gold-500" : "opacity-75 hover:opacity-100",
                    )}
                  >
                    <Image src={image} alt="" fill sizes="120px" className="object-cover" />
                    {selected && <span className="absolute inset-0 bg-gold-500/25" />}
                  </button>
                </li>
              );
            })}
          </ul>
          {library.length === 0 && (
            <p className="py-8 text-center text-xs text-slate-500">
              No images found in /public/images.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Single-image variant, used for blog covers and gallery items. */
export function SingleImageField({
  name,
  library,
  initial = "",
  label = "Image",
}: {
  name: string;
  library: string[];
  initial?: string | null;
  label?: string;
}) {
  const [value, setValue] = useState(initial ?? "");
  const [picking, setPicking] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onUploaded = useCallback((urls: string[]) => {
    if (urls[0]) setValue(urls[0]);
  }, []);

  const { busy, error, progress, dragging, upload, dropZone } = useUpload(onUploaded);

  return (
    <div
      {...dropZone}
      className={cx(
        "rounded transition-colors",
        dragging && "outline-2 outline-offset-4 outline-dashed outline-gold-500",
      )}
    >
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <div className="flex gap-3">
        {value ? (
          <span className="relative size-20 shrink-0 overflow-hidden bg-sand-100">
            <Image src={value} alt="" fill sizes="80px" className="object-cover" />
          </span>
        ) : null}

        <div className="flex-1 space-y-2">
          <input
            id={name}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="/images/properties/example.jpeg"
            className={inputClass}
          />
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInput}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              className="sr-only"
              onChange={(event) => {
                if (event.target.files?.length) void upload(event.target.files);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-royal-700 underline underline-offset-4 transition-colors hover:text-gold-600 disabled:opacity-60"
            >
              <ImageIcon className="size-3.5" />
              {busy ? "Uploading…" : "Upload from device"}
            </button>
            <span className="text-xs text-slate-300">·</span>
            <button
              type="button"
              onClick={() => setPicking((open) => !open)}
              className="text-xs font-semibold text-royal-700 underline underline-offset-4 transition-colors hover:text-gold-600"
            >
              {picking ? "Close library" : "Choose from library"}
            </button>
          </div>
        </div>
      </div>

      <UploadNotice busy={busy} progress={progress} error={error} />

      {picking && (
        <div className="mt-3 max-h-64 overflow-y-auto border border-sand-200 bg-sand-50 p-3">
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {library.map((image) => (
              <li key={image}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(image);
                    setPicking(false);
                  }}
                  className={cx(
                    "relative block aspect-square w-full overflow-hidden transition-all",
                    value === image ? "ring-2 ring-gold-500" : "opacity-75 hover:opacity-100",
                  )}
                >
                  <Image src={image} alt="" fill sizes="100px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

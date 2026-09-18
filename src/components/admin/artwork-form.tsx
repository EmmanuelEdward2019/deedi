"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Artwork } from "@/lib/types";
import { saveArtworkAction, type ActionState } from "@/lib/actions";
import { slugify } from "@/lib/format";
import { ImageField } from "@/components/admin/image-field";
import {
  AdminButton,
  FieldLabel,
  FormSection,
  inputClass,
  selectClass,
} from "@/components/admin/admin-ui";
import { Eye } from "@/components/icons";

const initial: ActionState = {};

const CATEGORIES = ["Originals", "Limited Edition", "Sculptural", "Prints", "Commissions"];

const MEDIUMS = [
  "Acrylic on canvas",
  "Oil on linen",
  "Oil and oil stick on linen",
  "Mixed media on paper",
  "Mixed media on canvas",
  "Acrylic and mixed media on canvas",
  "Paper collage on board",
  "Giclée on cotton rag",
  "Carved reclaimed timber, bitumen and gold leaf",
];

export function ArtworkForm({
  artwork,
  library,
}: {
  artwork?: Artwork | null;
  library: string[];
}) {
  const [state, action, pending] = useActionState(saveArtworkAction, initial);
  const [title, setTitle] = useState(artwork?.title ?? "");
  const [slug, setSlug] = useState(artwork?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(artwork?.slug));
  const [onRequest, setOnRequest] = useState(artwork?.price_on_request ?? false);

  const autoSlug = slugTouched ? slug : slugify(title);

  return (
    <form action={action} className="space-y-6">
      {artwork ? <input type="hidden" name="id" value={artwork.id} /> : null}

      {state.error && (
        <p className="border border-rose-300 bg-rose-50 px-5 py-3.5 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection title="The work">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="title">Title *</FieldLabel>
                <input
                  id="title"
                  name="title"
                  required
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Still Waters, Dusk"
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="artist">Artist</FieldLabel>
                <input
                  id="artist"
                  name="artist"
                  defaultValue={artwork?.artist ?? "Deedi Studio"}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="slug" hint={`/art/${autoSlug || "…"}`}>
                URL slug
              </FieldLabel>
              <input
                id="slug"
                name="slug"
                value={autoSlug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="summary" hint="Shown on the collection grid">
                Short summary
              </FieldLabel>
              <textarea
                id="summary"
                name="summary"
                rows={2}
                defaultValue={artwork?.summary}
                placeholder="A mountain lake at last light…"
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="description" hint="HTML allowed">
                Full description
              </FieldLabel>
              <textarea
                id="description"
                name="description"
                rows={10}
                defaultValue={artwork?.description}
                className={`${inputClass} font-mono text-xs`}
              />
            </div>
          </FormSection>

          <FormSection title="Images" description="The first image is used as the cover.">
            <ImageField library={library} initial={artwork?.images ?? []} />
          </FormSection>

          <FormSection title="Specification">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <select
                  id="category"
                  name="category"
                  defaultValue={artwork?.category ?? "Originals"}
                  className={selectClass}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="medium">Medium</FieldLabel>
                <input
                  id="medium"
                  name="medium"
                  list="art-mediums"
                  defaultValue={artwork?.medium ?? ""}
                  placeholder="Acrylic on canvas"
                  className={inputClass}
                />
                <datalist id="art-mediums">
                  {MEDIUMS.map((medium) => (
                    <option key={medium} value={medium} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <FieldLabel htmlFor="width_cm">Width (cm)</FieldLabel>
                <input
                  id="width_cm"
                  name="width_cm"
                  type="number"
                  min={0}
                  defaultValue={artwork?.width_cm ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="height_cm">Height (cm)</FieldLabel>
                <input
                  id="height_cm"
                  name="height_cm"
                  type="number"
                  min={0}
                  defaultValue={artwork?.height_cm ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="year">Year</FieldLabel>
                <input
                  id="year"
                  name="year"
                  type="number"
                  min={1800}
                  max={2100}
                  defaultValue={artwork?.year ?? new Date().getFullYear()}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="edition">Edition</FieldLabel>
              <input
                id="edition"
                name="edition"
                defaultValue={artwork?.edition ?? "Original — one of one"}
                className={inputClass}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 border border-sand-200 px-4 py-3">
              <input
                type="checkbox"
                name="framed"
                defaultChecked={artwork?.framed ?? true}
                className="size-4 accent-[#c9a227]"
              />
              <span className="text-sm text-navy-800">Supplied framed</span>
            </label>

            <div>
              <FieldLabel htmlFor="frame_detail">Frame detail</FieldLabel>
              <input
                id="frame_detail"
                name="frame_detail"
                defaultValue={artwork?.frame_detail ?? ""}
                placeholder="Reclaimed oak float frame, natural wax finish"
                className={inputClass}
              />
            </div>
          </FormSection>

          <FormSection title="Search engine listing" description="Leave blank to use the title and summary.">
            <div>
              <FieldLabel htmlFor="meta_title" hint="Aim for 55–60 characters">
                Meta title
              </FieldLabel>
              <input
                id="meta_title"
                name="meta_title"
                defaultValue={artwork?.meta_title ?? ""}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="meta_description" hint="Aim for 150–158 characters">
                Meta description
              </FieldLabel>
              <textarea
                id="meta_description"
                name="meta_description"
                rows={3}
                defaultValue={artwork?.meta_description ?? ""}
                className={inputClass}
              />
            </div>
          </FormSection>
        </div>

        <div className="space-y-6">
          <div className="lg:sticky lg:top-6">
            <FormSection title="Publish">
              <div>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <select
                  id="status"
                  name="status"
                  defaultValue={artwork?.status ?? "available"}
                  className={selectClass}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-3 border border-sand-200 px-4 py-3">
                <input
                  type="checkbox"
                  name="price_on_request"
                  checked={onRequest}
                  onChange={(event) => setOnRequest(event.target.checked)}
                  className="size-4 accent-[#c9a227]"
                />
                <span className="text-sm text-navy-800">Price on request</span>
              </label>

              {!onRequest && (
                <div>
                  <FieldLabel htmlFor="price">Price (£)</FieldLabel>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    step="1"
                    defaultValue={artwork?.price ?? ""}
                    placeholder="2400"
                    className={inputClass}
                  />
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-3 border border-sand-200 px-4 py-3">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={artwork?.featured}
                  className="size-4 accent-[#c9a227]"
                />
                <span className="text-sm text-navy-800">Feature on the homepage</span>
              </label>

              <div className="space-y-2 border-t border-sand-200 pt-5">
                <AdminButton type="submit" tone="royal" disabled={pending} className="w-full">
                  {pending ? "Saving…" : artwork ? "Save changes" : "Publish artwork"}
                </AdminButton>

                {artwork ? (
                  <Link
                    href={`/art/${artwork.slug}`}
                    target="_blank"
                    className="flex w-full items-center justify-center gap-2 border border-sand-200 px-5 py-2.5 text-[0.8125rem] font-semibold text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600"
                  >
                    <Eye className="size-4" />
                    Preview on site
                  </Link>
                ) : null}

                <Link
                  href="/admin/art"
                  className="block w-full py-2 text-center text-xs text-slate-500 transition-colors hover:text-navy-900"
                >
                  Cancel
                </Link>
              </div>
            </FormSection>
          </div>
        </div>
      </div>
    </form>
  );
}

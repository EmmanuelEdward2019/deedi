"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import {
  deleteGalleryItemAction,
  saveGalleryItemAction,
  type ActionState,
} from "@/lib/actions";
import { SingleImageField } from "@/components/admin/image-field";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  AdminButton,
  FieldLabel,
  FormSection,
  inputClass,
} from "@/components/admin/admin-ui";
import { Pencil, Plus } from "@/components/icons";

const initial: ActionState = {};

const COLLECTIONS = ["Property", "Art", "Interiors", "Regeneration", "Team"];

export function GalleryManager({
  items,
  library,
  canDelete,
}: {
  items: GalleryItem[];
  library: string[];
  canDelete: boolean;
}) {
  const [state, action, pending] = useActionState(saveGalleryItemAction, initial);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [formKey, setFormKey] = useState(0);

  function reset() {
    setEditing(null);
    setFormKey((key) => key + 1);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-6">
          <form key={`${editing?.id ?? "new"}-${formKey}`} action={action} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={editing.id} /> : null}

            <FormSection
              title={editing ? "Edit gallery item" : "Add to the gallery"}
              description={editing ? `Editing "${editing.title}"` : undefined}
            >
              {state.error && (
                <p className="border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
                  {state.error}
                </p>
              )}
              {state.success && !editing && (
                <p className="border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                  {state.success}
                </p>
              )}

              <SingleImageField
                name="image"
                library={library}
                initial={editing?.image}
                label="Image *"
              />

              <div>
                <FieldLabel htmlFor="title">Title *</FieldLabel>
                <input
                  id="title"
                  name="title"
                  required
                  defaultValue={editing?.title}
                  placeholder="Bramley Row, Salford"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel htmlFor="caption">Caption</FieldLabel>
                <input
                  id="caption"
                  name="caption"
                  defaultValue={editing?.caption ?? ""}
                  placeholder="Eight townhouses, handed over in a single phase."
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel htmlFor="collection">Collection</FieldLabel>
                <input
                  id="collection"
                  name="collection"
                  list="gallery-collections"
                  defaultValue={editing?.collection ?? "Property"}
                  className={inputClass}
                />
                <datalist id="gallery-collections">
                  {COLLECTIONS.map((collection) => (
                    <option key={collection} value={collection} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="tags" hint="Comma separated">
                    Tags
                  </FieldLabel>
                  <input
                    id="tags"
                    name="tags"
                    defaultValue={editing?.tags.join(", ")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="sort_order">Order</FieldLabel>
                  <input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    defaultValue={editing?.sort_order ?? items.length + 1}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-sand-200 pt-4">
                <AdminButton type="submit" tone="royal" disabled={pending} className="w-full">
                  {pending ? "Saving…" : editing ? "Save changes" : "Add to gallery"}
                </AdminButton>
                {editing ? (
                  <button
                    type="button"
                    onClick={reset}
                    className="w-full py-2 text-center text-xs text-slate-500 transition-colors hover:text-navy-900"
                  >
                    Cancel editing
                  </button>
                ) : null}
              </div>
            </FormSection>
          </form>
        </div>
      </div>

      {/* Grid */}
      <div className="lg:col-span-2">
        {items.length === 0 ? (
          <div className="border border-dashed border-sand-200 bg-white px-6 py-20 text-center">
            <h2 className="font-display text-xl text-navy-900">The gallery is empty</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Add images using the form, or run{" "}
              <code className="bg-sand-100 px-1.5">npm run db:seed</code>.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item) => (
              <li key={item.id} className="group border border-sand-200 bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
                  <Image src={item.image} alt="" fill sizes="240px" className="object-cover" />
                  <span className="absolute top-2 left-2 bg-navy-900/85 px-2 py-0.5 text-[0.5625rem] font-bold tracking-[0.12em] text-white uppercase">
                    {item.collection}
                  </span>
                </div>

                <div className="p-3">
                  <p className="truncate text-sm font-medium text-navy-900">{item.title}</p>
                  {item.caption ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{item.caption}</p>
                  ) : null}

                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(item);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      aria-label={`Edit ${item.title}`}
                      className="border border-sand-200 p-1.5 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    {canDelete && (
                      <form action={deleteGalleryItemAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <DeleteButton label="" confirmLabel="Sure?" compact />
                      </form>
                    )}
                    <span className="ml-auto text-[0.625rem] text-slate-400">#{item.sort_order}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Plus className="size-3.5" />
            Lower order numbers appear first on the public gallery page.
          </p>
        )}
      </div>
    </div>
  );
}

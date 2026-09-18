"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Property } from "@/lib/types";
import { savePropertyAction, type ActionState } from "@/lib/actions";
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

const PROPERTY_TYPES = [
  "House",
  "Townhouse",
  "Detached",
  "Semi-Detached",
  "Terraced",
  "Apartment",
  "Bungalow",
  "Commercial",
  "Investment",
  "Land",
];

export function PropertyForm({
  property,
  library,
}: {
  property?: Property | null;
  library: string[];
}) {
  const [state, action, pending] = useActionState(savePropertyAction, initial);
  const [title, setTitle] = useState(property?.title ?? "");
  const [slug, setSlug] = useState(property?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(property?.slug));
  const [listingType, setListingType] = useState(property?.listing_type ?? "sale");

  const autoSlug = slugTouched ? slug : slugify(title);

  return (
    <form action={action} className="space-y-6">
      {property ? <input type="hidden" name="id" value={property.id} /> : null}

      {state.error && (
        <p className="border border-rose-300 bg-rose-50 px-5 py-3.5 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection title="Listing details">
            <div>
              <FieldLabel htmlFor="title">Title *</FieldLabel>
              <input
                id="title"
                name="title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Bramley Row Townhouses"
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="slug" hint={`/properties/${autoSlug || "…"}`}>
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
                placeholder="generated from the title"
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="summary" hint="Shown on cards and in search results">
                Short summary
              </FieldLabel>
              <textarea
                id="summary"
                name="summary"
                rows={2}
                defaultValue={property?.summary}
                placeholder="One or two sentences describing the property."
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel htmlFor="description" hint="HTML allowed — use <p> and <h3>">
                Full description
              </FieldLabel>
              <textarea
                id="description"
                name="description"
                rows={10}
                defaultValue={property?.description}
                placeholder="<p>A row of eight architect-designed townhouses…</p>"
                className={`${inputClass} font-mono text-xs`}
              />
            </div>
          </FormSection>

          <FormSection title="Images" description="The first image is used as the cover.">
            <ImageField library={library} initial={property?.images ?? []} />
          </FormSection>

          <FormSection title="Specification">
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { name: "bedrooms", label: "Bedrooms", value: property?.bedrooms ?? 0 },
                { name: "bathrooms", label: "Bathrooms", value: property?.bathrooms ?? 0 },
                { name: "receptions", label: "Receptions", value: property?.receptions ?? 0 },
                {
                  name: "floor_area_sqft",
                  label: "Sq ft",
                  value: property?.floor_area_sqft ?? "",
                },
              ].map((field) => (
                <div key={field.name}>
                  <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                  <input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={0}
                    defaultValue={field.value}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <FieldLabel htmlFor="property_type">Property type</FieldLabel>
                <select
                  id="property_type"
                  name="property_type"
                  defaultValue={property?.property_type ?? "House"}
                  className={selectClass}
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="tenure">Tenure</FieldLabel>
                <select
                  id="tenure"
                  name="tenure"
                  defaultValue={property?.tenure ?? "Freehold"}
                  className={selectClass}
                >
                  <option value="">—</option>
                  <option>Freehold</option>
                  <option>Leasehold</option>
                  <option>Share of Freehold</option>
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="epc_rating">EPC rating</FieldLabel>
                <select
                  id="epc_rating"
                  name="epc_rating"
                  defaultValue={property?.epc_rating ?? ""}
                  className={selectClass}
                >
                  <option value="">—</option>
                  {["A", "B", "C", "D", "E", "F", "G"].map((band) => (
                    <option key={band}>{band}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel htmlFor="features" hint="One per line">
                Key features
              </FieldLabel>
              <textarea
                id="features"
                name="features"
                rows={6}
                defaultValue={property?.features.join("\n")}
                placeholder={"Allocated off-road parking\nLandscaped rear garden"}
                className={inputClass}
              />
            </div>
          </FormSection>

          <FormSection title="Address">
            <div>
              <FieldLabel htmlFor="address_line">Street address</FieldLabel>
              <input
                id="address_line"
                name="address_line"
                defaultValue={property?.address_line}
                placeholder="Bramley Row, Langworthy Road"
                className={inputClass}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <FieldLabel htmlFor="city">Town / city</FieldLabel>
                <input
                  id="city"
                  name="city"
                  defaultValue={property?.city}
                  placeholder="Bolton"
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="region">Region</FieldLabel>
                <input
                  id="region"
                  name="region"
                  defaultValue={property?.region ?? "Greater Manchester"}
                  className={inputClass}
                />
              </div>
              <div>
                <FieldLabel htmlFor="postcode">Postcode</FieldLabel>
                <input
                  id="postcode"
                  name="postcode"
                  defaultValue={property?.postcode}
                  placeholder="BL1 1AA"
                  className={inputClass}
                />
              </div>
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
                defaultValue={property?.meta_title ?? ""}
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
                defaultValue={property?.meta_description ?? ""}
                className={inputClass}
              />
            </div>
          </FormSection>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-6">
            <FormSection title="Publish">
              <div>
                <FieldLabel htmlFor="listing_type">Listing type</FieldLabel>
                <select
                  id="listing_type"
                  name="listing_type"
                  value={listingType}
                  onChange={(event) => setListingType(event.target.value as "sale" | "rent")}
                  className={selectClass}
                >
                  <option value="sale">For sale</option>
                  <option value="rent">To let</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <select
                  id="status"
                  name="status"
                  defaultValue={property?.status ?? "available"}
                  className={selectClass}
                >
                  <option value="available">Available</option>
                  <option value="under_offer">Under offer</option>
                  <option value="let_agreed">Let agreed</option>
                  <option value="sold">Sold</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="price">
                  {listingType === "rent" ? "Rent" : "Price"} (£)
                </FieldLabel>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step="1"
                  defaultValue={property?.price}
                  placeholder={listingType === "rent" ? "1150" : "289000"}
                  className={inputClass}
                />
              </div>

              {listingType === "rent" ? (
                <div>
                  <FieldLabel htmlFor="rent_period">Rent period</FieldLabel>
                  <select
                    id="rent_period"
                    name="rent_period"
                    defaultValue={property?.rent_period ?? "pcm"}
                    className={selectClass}
                  >
                    <option value="pcm">pcm</option>
                    <option value="pw">pw</option>
                    <option value="pa">pa</option>
                  </select>
                </div>
              ) : (
                <div>
                  <FieldLabel htmlFor="price_qualifier">Price qualifier</FieldLabel>
                  <select
                    id="price_qualifier"
                    name="price_qualifier"
                    defaultValue={property?.price_qualifier ?? ""}
                    className={selectClass}
                  >
                    <option value="">—</option>
                    <option>Guide price</option>
                    <option>Asking price</option>
                    <option>Offers over</option>
                    <option>Offers in region of</option>
                    <option>Fixed price</option>
                  </select>
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-3 border border-sand-200 px-4 py-3">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={property?.featured}
                  className="size-4 accent-[#c9a227]"
                />
                <span className="text-sm text-navy-800">Feature on the homepage</span>
              </label>

              <div className="space-y-2 border-t border-sand-200 pt-5">
                <AdminButton type="submit" tone="royal" disabled={pending} className="w-full">
                  {pending ? "Saving…" : property ? "Save changes" : "Publish property"}
                </AdminButton>

                {property ? (
                  <Link
                    href={`/properties/${property.slug}`}
                    target="_blank"
                    className="flex w-full items-center justify-center gap-2 border border-sand-200 px-5 py-2.5 text-[0.8125rem] font-semibold text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600"
                  >
                    <Eye className="size-4" />
                    Preview on site
                  </Link>
                ) : null}

                <Link
                  href="/admin/properties"
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

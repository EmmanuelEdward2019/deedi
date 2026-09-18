"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type { BlogPost } from "@/lib/types";
import { savePostAction, type ActionState } from "@/lib/actions";
import { slugify } from "@/lib/format";
import { RichEditor } from "@/components/admin/rich-editor";
import { SeoPanel } from "@/components/admin/seo-panel";
import { SingleImageField } from "@/components/admin/image-field";
import {
  AdminButton,
  FieldLabel,
  FormSection,
  inputClass,
  selectClass,
} from "@/components/admin/admin-ui";
import { Eye } from "@/components/icons";

const initial: ActionState = {};

const CATEGORIES = [
  "Investment",
  "Property Management",
  "Market Insight",
  "Compliance",
  "Art & Interiors",
  "Insights",
];

/**
 * First-paint value for the datetime-local input. Deliberately does no timezone
 * conversion, so the server and the browser render identical markup — the true
 * local time is applied after mount by usePublishedAt below.
 */
function toNeutralInput(value: string | Date | null) {
  if (!value) return "";
  // Date -> UTC, which is identical on the server and in the browser.
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 16);
  }
  return value.replace(" ", "T").slice(0, 16);
}

/** Converts a timestamp to the viewer's local time for a datetime-local input. */
function toLocalInput(value: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

/**
 * Holds the publish date, starting from a timezone-neutral value and shifting to
 * the viewer's local time once hydration is done.
 */
function usePublishedAt(published: string | Date | null) {
  // Normalise to a primitive so a re-render cannot reset an in-progress edit.
  const iso = published instanceof Date ? published.toISOString() : published;
  const [value, setValue] = useState(() => toNeutralInput(iso));

  useEffect(() => {
    setValue(toLocalInput(iso));
  }, [iso]);

  return [value, setValue] as const;
}

export function PostForm({
  post,
  library,
  siteUrl,
}: {
  post?: BlogPost | null;
  library: string[];
  siteUrl: string;
}) {
  const [state, action, pending] = useActionState(savePostAction, initial);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [publishedAt, setPublishedAt] = usePublishedAt(post?.published_at ?? null);

  const autoSlug = slugTouched ? slug : slugify(title);

  return (
    <form action={action} className="space-y-6">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      {state.error && (
        <p className="border border-rose-300 bg-rose-50 px-5 py-3.5 text-sm text-rose-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-4">
        {/* Editor column */}
        <div className="space-y-6 xl:col-span-3">
          <div>
            <input
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Add title"
              aria-label="Post title"
              className="font-display w-full border border-sand-200 bg-white px-5 py-4 text-2xl text-navy-900 transition-colors placeholder:text-slate-300 focus:border-gold-500 focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="shrink-0">Permalink:</span>
              <span className="shrink-0 text-slate-400">{siteUrl}/blog/</span>
              <input
                name="slug"
                value={autoSlug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                aria-label="URL slug"
                className="min-w-[12rem] flex-1 border-b border-dashed border-sand-200 bg-transparent py-0.5 text-navy-800 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <RichEditor
            name="content"
            initialContent={post?.content ?? ""}
            library={library}
            placeholder="Start writing, or paste HTML into the Text tab…"
          />

          <FormSection
            title="Excerpt"
            description="Used on cards, in search results and as the fallback meta description."
          >
            <textarea
              name="excerpt"
              rows={3}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="A short summary. Leave blank and we will take the opening of the post."
              className={inputClass}
            />
          </FormSection>

          <FormSection title="Search engine optimisation">
            <SeoPanel
              siteUrl={siteUrl}
              slug={autoSlug}
              fallbackTitle={title}
              fallbackDescription={excerpt}
              defaults={{
                metaTitle: post?.meta_title,
                metaDescription: post?.meta_description,
                focusKeyword: post?.focus_keyword,
                canonicalUrl: post?.canonical_url,
              }}
            />
          </FormSection>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="space-y-6 xl:sticky xl:top-6">
            <FormSection title="Publish">
              <div>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <select
                  id="status"
                  name="status"
                  defaultValue={post?.status ?? "draft"}
                  className={selectClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="published_at" hint="Blank = now">
                  Publish date
                </FieldLabel>
                <input
                  id="published_at"
                  name="published_at"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(event) => setPublishedAt(event.target.value)}
                  className={inputClass}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 border border-sand-200 px-4 py-3">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={post?.featured}
                  className="size-4 accent-[#c9a227]"
                />
                <span className="text-sm text-navy-800">Feature at the top of the journal</span>
              </label>

              <div className="space-y-2 border-t border-sand-200 pt-5">
                <AdminButton type="submit" tone="royal" disabled={pending} className="w-full">
                  {pending ? "Saving…" : post ? "Update post" : "Save post"}
                </AdminButton>

                {post?.status === "published" ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="flex w-full items-center justify-center gap-2 border border-sand-200 px-5 py-2.5 text-[0.8125rem] font-semibold text-navy-800 transition-colors hover:border-gold-400 hover:text-gold-600"
                  >
                    <Eye className="size-4" />
                    View post
                  </Link>
                ) : null}

                <Link
                  href="/admin/blog"
                  className="block w-full py-2 text-center text-xs text-slate-500 transition-colors hover:text-navy-900"
                >
                  Cancel
                </Link>
              </div>
            </FormSection>

            <FormSection title="Cover image">
              <SingleImageField
                name="cover_image"
                library={library}
                initial={post?.cover_image}
                label="Featured image"
              />
              <p className="text-xs text-slate-500">
                Also used as the Open Graph image when shared on social media.
              </p>
            </FormSection>

            <FormSection title="Organisation">
              <div>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <input
                  id="category"
                  name="category"
                  list="post-categories"
                  defaultValue={post?.category ?? "Insights"}
                  className={inputClass}
                />
                <datalist id="post-categories">
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div>
                <FieldLabel htmlFor="tags" hint="Comma separated">
                  Tags
                </FieldLabel>
                <input
                  id="tags"
                  name="tags"
                  defaultValue={post?.tags.join(", ")}
                  placeholder="buy-to-let, yields, bolton"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel htmlFor="author">Author</FieldLabel>
                <input
                  id="author"
                  name="author"
                  defaultValue={post?.author ?? "Deedi Ltd"}
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel htmlFor="author_role">Author role</FieldLabel>
                <input
                  id="author_role"
                  name="author_role"
                  defaultValue={post?.author_role ?? ""}
                  placeholder="Head of Property Management"
                  className={inputClass}
                />
              </div>
            </FormSection>
          </div>
        </div>
      </div>
    </form>
  );
}

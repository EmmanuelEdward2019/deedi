import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AdminHeader, AdminLink } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, StatusBadge } from "@/components/ui";
import { Eye, Pencil, Plus } from "@/components/icons";
import { deletePostAction } from "@/lib/actions";
import { getAllPosts } from "@/lib/queries";
import { currentRole } from "@/lib/auth";
import { formatShortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Journal" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const [posts, role] = await Promise.all([getAllPosts(), currentRole()]);
  const canDelete = role === "owner";
  const published = posts.filter((post) => post.status === "published").length;

  return (
    <>
      <AdminHeader
        title="Journal"
        subtitle={`${posts.length} ${posts.length === 1 ? "post" : "posts"} · ${published} published`}
        action={
          <AdminLink href="/admin/blog/new" tone="royal">
            <Plus className="size-4" />
            New post
          </AdminLink>
        }
      />

      {posts.length === 0 ? (
        <div className="border border-dashed border-sand-200 bg-white px-6 py-20 text-center">
          <h2 className="font-display text-xl text-navy-900">Nothing written yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Write your first post, or run{" "}
            <code className="bg-sand-100 px-1.5">npm run db:seed</code> to load the sample journal.
          </p>
          <div className="mt-6">
            <AdminLink href="/admin/blog/new" tone="gold">
              <Plus className="size-4" />
              Write a post
            </AdminLink>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-sand-200 bg-white">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-50 text-left">
                {["Post", "Category", "Author", "Status", "Published", ""].map((heading, index) => (
                  <th
                    key={heading || index}
                    className="px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {posts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-sand-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <span className="relative size-14 shrink-0 overflow-hidden bg-sand-100">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0 max-w-sm">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="font-medium text-navy-900 transition-colors hover:text-gold-600"
                        >
                          {post.title}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{post.excerpt}</p>
                        {post.featured && (
                          <span className="mt-1.5 inline-block">
                            <Badge tone="gold">Featured</Badge>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs text-navy-800">{post.category}</p>
                    {post.tags.length > 0 && (
                      <p className="mt-1 line-clamp-1 text-[0.6875rem] text-slate-400">
                        {post.tags.map((tag) => `#${tag}`).join(" ")}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-600">{post.author}</td>

                  <td className="px-5 py-4">
                    <StatusBadge status={post.status} />
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">
                    {post.published_at ? formatShortDate(post.published_at) : "—"}
                    <span className="mt-0.5 block text-[0.6875rem] text-slate-400">
                      {post.reading_minutes} min read
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "published" && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          aria-label="View on site"
                          className="border border-sand-200 p-2 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
                        >
                          <Eye className="size-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/${post.id}`}
                        aria-label="Edit"
                        className="border border-sand-200 p-2 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      {canDelete && (
                        <form action={deletePostAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <DeleteButton label="" confirmLabel="Sure?" compact />
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

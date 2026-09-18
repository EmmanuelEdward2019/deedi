import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AdminHeader, AdminLink, StatCard } from "@/components/admin/admin-ui";
import { StatusBadge } from "@/components/ui";
import {
  Building,
  FileText,
  Inbox,
  Palette,
  Plus,
} from "@/components/icons";
import {
  getAdminStats,
  getAllArtworks,
  getAllPosts,
  getAllProperties,
  getRecentMessages,
} from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { formatPrice, formatRelative, formatShortDate } from "@/lib/format";
import { isDatabaseConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const denied = (await searchParams).denied === "owner";
  const [session, stats, messages, properties, artworks, posts] = await Promise.all([
    getSession(),
    getAdminStats(),
    getRecentMessages(5),
    getAllProperties(),
    getAllArtworks(),
    getAllPosts(),
  ]);

  const firstName = session?.name.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <AdminHeader
        title={`${greeting}, ${firstName}.`}
        subtitle="Everything published on the website, at a glance."
        action={
          <div className="flex flex-wrap gap-2">
            <AdminLink href="/admin/properties/new" tone="outline" size="md">
              <Plus className="size-4" />
              Property
            </AdminLink>
            <AdminLink href="/admin/blog/new" tone="royal" size="md">
              <Plus className="size-4" />
              New post
            </AdminLink>
          </div>
        }
      />

      {denied && (
        <div className="mb-8 border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <strong className="font-semibold">Owners only.</strong> That page is limited to owner
          accounts. Ask an owner if you need access.
        </div>
      )}

      {!isDatabaseConfigured() && (
        <div className="mb-8 border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <strong className="font-semibold">No database connected.</strong> Add{" "}
          <code className="bg-amber-100 px-1.5 py-0.5">DATABASE_URL</code> to{" "}
          <code className="bg-amber-100 px-1.5 py-0.5">.env.local</code>, then run{" "}
          <code className="bg-amber-100 px-1.5 py-0.5">npm run db:setup &amp;&amp; npm run db:seed</code>.
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Properties"
          value={stats.properties.total}
          sub={`${stats.properties.active} available`}
          href="/admin/properties"
          Icon={Building}
        />
        <StatCard
          label="Artwork"
          value={stats.artworks.total}
          sub={`${stats.artworks.active} available`}
          href="/admin/art"
          Icon={Palette}
        />
        <StatCard
          label="Journal posts"
          value={stats.posts.total}
          sub={`${stats.posts.active} published`}
          href="/admin/blog"
          Icon={FileText}
        />
        <StatCard
          label="Enquiries"
          value={stats.messages.total}
          sub={
            stats.messages.active > 0
              ? `${stats.messages.active} unread`
              : "All caught up"
          }
          href="/admin/messages"
          Icon={Inbox}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Enquiries */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[0.8125rem] font-semibold tracking-[0.12em] text-navy-900 uppercase">
              Latest enquiries
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-royal-700 transition-colors hover:text-gold-600"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-sand-200 border border-sand-200 bg-white">
            {messages.length === 0 ? (
              <p className="px-6 py-14 text-center text-sm text-slate-500">
                No enquiries yet. Messages from the contact form land here.
              </p>
            ) : (
              messages.map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/messages#message-${message.id}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-sand-50"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center bg-royal-700 text-xs font-bold text-white">
                    {message.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-sm font-semibold text-navy-900">{message.name}</p>
                      <StatusBadge status={message.status} />
                      <span className="text-xs text-slate-400">
                        {formatRelative(message.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-navy-800">{message.subject}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{message.message}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Recent listings */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[0.8125rem] font-semibold tracking-[0.12em] text-navy-900 uppercase">
              Recently updated
            </h2>
          </div>

          <div className="divide-y divide-sand-200 border border-sand-200 bg-white">
            {[
              ...properties.slice(0, 3).map((item) => ({
                id: `p-${item.id}`,
                href: `/admin/properties/${item.id}`,
                title: item.title,
                meta: formatPrice(item.price),
                image: item.hero_image,
                status: item.status,
                updated: item.updated_at,
              })),
              ...artworks.slice(0, 2).map((item) => ({
                id: `a-${item.id}`,
                href: `/admin/art/${item.id}`,
                title: item.title,
                meta: item.artist,
                image: item.hero_image,
                status: item.status,
                updated: item.updated_at,
              })),
            ].map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-sand-50"
              >
                <span className="relative size-12 shrink-0 overflow-hidden bg-sand-100">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy-900">{item.title}</p>
                  <p className="truncate text-xs text-slate-500">{item.meta}</p>
                </div>
                <StatusBadge status={item.status} />
              </Link>
            ))}

            {properties.length === 0 && artworks.length === 0 && (
              <p className="px-6 py-14 text-center text-sm text-slate-500">
                Nothing published yet.
              </p>
            )}
          </div>

          {/* Draft posts */}
          {posts.filter((post) => post.status === "draft").length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-[0.8125rem] font-semibold tracking-[0.12em] text-navy-900 uppercase">
                Drafts
              </h2>
              <div className="divide-y divide-sand-200 border border-sand-200 bg-white">
                {posts
                  .filter((post) => post.status === "draft")
                  .slice(0, 4)
                  .map((post) => (
                    <Link
                      key={post.id}
                      href={`/admin/blog/${post.id}`}
                      className="block px-4 py-3 transition-colors hover:bg-sand-50"
                    >
                      <p className="truncate text-sm font-medium text-navy-900">{post.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Edited {formatShortDate(post.updated_at)}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AdminHeader, AdminLink } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, StatusBadge } from "@/components/ui";
import { Eye, Pencil, Plus } from "@/components/icons";
import { deleteArtworkAction } from "@/lib/actions";
import { getAllArtworks } from "@/lib/queries";
import { currentRole } from "@/lib/auth";
import { formatPrice, formatShortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Artwork" };
export const dynamic = "force-dynamic";

export default async function AdminArtPage() {
  const [artworks, role] = await Promise.all([getAllArtworks(), currentRole()]);
  const canDelete = role === "owner";

  return (
    <>
      <AdminHeader
        title="Artwork"
        subtitle={`${artworks.length} ${artworks.length === 1 ? "work" : "works"} in the collection`}
        action={
          <AdminLink href="/admin/art/new" tone="royal">
            <Plus className="size-4" />
            Add artwork
          </AdminLink>
        }
      />

      {artworks.length === 0 ? (
        <div className="border border-dashed border-sand-200 bg-white px-6 py-20 text-center">
          <h2 className="font-display text-xl text-navy-900">No artwork yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Add a piece, or run <code className="bg-sand-100 px-1.5">npm run db:seed</code> to load
            the sample collection.
          </p>
          <div className="mt-6">
            <AdminLink href="/admin/art/new" tone="gold">
              <Plus className="size-4" />
              Add artwork
            </AdminLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {artworks.map((artwork) => (
            <article key={artwork.id} className="flex border border-sand-200 bg-white">
              <Link
                href={`/admin/art/${artwork.id}`}
                className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden bg-sand-100"
              >
                {artwork.hero_image ? (
                  <Image
                    src={artwork.hero_image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : null}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge status={artwork.status} />
                  {artwork.featured && <Badge tone="gold">Featured</Badge>}
                </div>

                <h2 className="font-display mt-2.5 truncate text-lg text-navy-900">
                  <Link
                    href={`/admin/art/${artwork.id}`}
                    className="transition-colors hover:text-gold-600"
                  >
                    {artwork.title}
                  </Link>
                </h2>
                <p className="truncate text-xs text-slate-500">
                  {artwork.artist} · {artwork.category}
                </p>

                <p className="mt-2 text-sm font-semibold text-navy-900">
                  {artwork.price_on_request ? "Price on request" : formatPrice(artwork.price)}
                </p>

                <p className="mt-auto pt-3 text-[0.6875rem] text-slate-400">
                  Updated {formatShortDate(artwork.updated_at)}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5">
                  <Link
                    href={`/art/${artwork.slug}`}
                    target="_blank"
                    aria-label="View on site"
                    className="border border-sand-200 p-1.5 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
                  >
                    <Eye className="size-3.5" />
                  </Link>
                  <Link
                    href={`/admin/art/${artwork.id}`}
                    aria-label="Edit"
                    className="border border-sand-200 p-1.5 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  {canDelete && (
                    <form action={deleteArtworkAction}>
                      <input type="hidden" name="id" value={artwork.id} />
                      <DeleteButton label="" confirmLabel="Sure?" compact />
                    </form>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

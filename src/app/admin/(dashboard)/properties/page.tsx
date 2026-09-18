import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AdminHeader, AdminLink } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge, Badge } from "@/components/ui";
import { Eye, Pencil, Plus } from "@/components/icons";
import { deletePropertyAction } from "@/lib/actions";
import { getAllProperties } from "@/lib/queries";
import { currentRole } from "@/lib/auth";
import { formatPrice, formatRent, formatShortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Properties" };
export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const [properties, role] = await Promise.all([getAllProperties(), currentRole()]);
  const canDelete = role === "owner";

  return (
    <>
      <AdminHeader
        title="Properties"
        subtitle={`${properties.length} ${properties.length === 1 ? "listing" : "listings"} in the portfolio`}
        action={
          <AdminLink href="/admin/properties/new" tone="royal">
            <Plus className="size-4" />
            Add property
          </AdminLink>
        }
      />

      {properties.length === 0 ? (
        <div className="border border-dashed border-sand-200 bg-white px-6 py-20 text-center">
          <h2 className="font-display text-xl text-navy-900">No properties yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
            Add your first listing, or run <code className="bg-sand-100 px-1.5">npm run db:seed</code>{" "}
            to load the sample portfolio.
          </p>
          <div className="mt-6">
            <AdminLink href="/admin/properties/new" tone="gold">
              <Plus className="size-4" />
              Add property
            </AdminLink>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-sand-200 bg-white">
          <table className="w-full min-w-[56rem] text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-50 text-left">
                <th className="px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                  Property
                </th>
                <th className="px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                  Type
                </th>
                <th className="px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                  Price
                </th>
                <th className="px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                  Updated
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {properties.map((property) => (
                <tr key={property.id} className="transition-colors hover:bg-sand-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <span className="relative size-14 shrink-0 overflow-hidden bg-sand-100">
                        {property.hero_image ? (
                          <Image
                            src={property.hero_image}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/properties/${property.id}`}
                          className="font-medium text-navy-900 transition-colors hover:text-gold-600"
                        >
                          {property.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {property.city} · {property.postcode} · {property.bedrooms} bed
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge tone="slate">
                        {property.listing_type === "rent" ? "To Let" : "For Sale"}
                      </Badge>
                      {property.featured && <Badge tone="gold">Featured</Badge>}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">{property.property_type}</p>
                  </td>

                  <td className="px-5 py-4 font-medium text-navy-900">
                    {property.listing_type === "rent"
                      ? formatRent(property.price, property.rent_period)
                      : formatPrice(property.price)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={property.status} />
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">
                    {formatShortDate(property.updated_at)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        aria-label="View on site"
                        className="border border-sand-200 p-2 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <Link
                        href={`/admin/properties/${property.id}`}
                        aria-label="Edit"
                        className="border border-sand-200 p-2 text-slate-500 transition-colors hover:border-gold-400 hover:text-gold-600"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      {canDelete && (
                        <form action={deletePropertyAction}>
                          <input type="hidden" name="id" value={property.id} />
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

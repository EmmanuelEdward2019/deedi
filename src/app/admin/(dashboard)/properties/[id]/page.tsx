import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { PropertyForm } from "@/components/admin/property-form";
import { deletePropertyAction } from "@/lib/actions";
import { getPropertyById } from "@/lib/queries";
import { getMediaLibrary } from "@/lib/media";
import { currentRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit property" };
export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, library] = await Promise.all([
    getPropertyById(Number(id)),
    getMediaLibrary(),
  ]);
  const canDelete = (await currentRole()) === "owner";

  if (!property) notFound();

  return (
    <>
      <AdminHeader
        title="Edit property"
        subtitle={property.title}
        action={
          canDelete ? (
          <form action={deletePropertyAction}>
            <input type="hidden" name="id" value={property.id} />
            <DeleteButton label="Delete listing" confirmLabel="Click again to delete" />
          </form>
          ) : null
        }
      />
      <PropertyForm property={property} library={library.all} />
    </>
  );
}

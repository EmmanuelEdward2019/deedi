import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { deleteArtworkAction } from "@/lib/actions";
import { getArtworkById } from "@/lib/queries";
import { getMediaLibrary } from "@/lib/media";
import { currentRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit artwork" };
export const dynamic = "force-dynamic";

export default async function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [artwork, library] = await Promise.all([getArtworkById(Number(id)), getMediaLibrary()]);
  const canDelete = (await currentRole()) === "owner";

  if (!artwork) notFound();

  return (
    <>
      <AdminHeader
        title="Edit artwork"
        subtitle={`${artwork.title} — ${artwork.artist}`}
        action={
          canDelete ? (
          <form action={deleteArtworkAction}>
            <input type="hidden" name="id" value={artwork.id} />
            <DeleteButton label="Delete artwork" confirmLabel="Click again to delete" />
          </form>
          ) : null
        }
      />
      <ArtworkForm artwork={artwork} library={library.all} />
    </>
  );
}

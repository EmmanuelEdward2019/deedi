import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-ui";
import { ArtworkForm } from "@/components/admin/artwork-form";
import { getMediaLibrary } from "@/lib/media";

export const metadata: Metadata = { title: "Add artwork" };

export default async function NewArtworkPage() {
  const library = await getMediaLibrary();

  return (
    <>
      <AdminHeader
        title="Add artwork"
        subtitle="Publishes to the collection immediately unless saved as a draft."
      />
      <ArtworkForm library={library.all} />
    </>
  );
}

import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-ui";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { getGalleryItems } from "@/lib/queries";
import { getMediaLibrary } from "@/lib/media";
import { currentRole } from "@/lib/auth";

export const metadata: Metadata = { title: "Gallery" };
export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const [items, library, role] = await Promise.all([
    getGalleryItems(),
    getMediaLibrary(),
    currentRole(),
  ]);

  return (
    <>
      <AdminHeader
        title="Gallery"
        subtitle={`${items.length} ${items.length === 1 ? "image" : "images"} on the public gallery page`}
      />
      <GalleryManager items={items} library={library.all} canDelete={role === "owner"} />
    </>
  );
}

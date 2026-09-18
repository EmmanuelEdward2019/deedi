import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-ui";
import { PropertyForm } from "@/components/admin/property-form";
import { getMediaLibrary } from "@/lib/media";

export const metadata: Metadata = { title: "Add property" };

export default async function NewPropertyPage() {
  const library = await getMediaLibrary();

  return (
    <>
      <AdminHeader
        title="Add a property"
        subtitle="It goes live as soon as you publish, unless you save it as a draft."
      />
      <PropertyForm library={library.all} />
    </>
  );
}

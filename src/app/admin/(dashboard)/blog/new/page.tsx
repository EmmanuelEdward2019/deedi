import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/admin-ui";
import { PostForm } from "@/components/admin/post-form";
import { getMediaLibrary } from "@/lib/media";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const library = await getMediaLibrary();

  return (
    <>
      <AdminHeader title="Write a post" subtitle="Save it as a draft until you are ready." />
      <PostForm library={library.all} siteUrl={site.url} />
    </>
  );
}

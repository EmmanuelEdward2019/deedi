import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { PostForm } from "@/components/admin/post-form";
import { deletePostAction } from "@/lib/actions";
import { getPostById } from "@/lib/queries";
import { getMediaLibrary } from "@/lib/media";
import { currentRole } from "@/lib/auth";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Edit post" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, library] = await Promise.all([getPostById(Number(id)), getMediaLibrary()]);
  const canDelete = (await currentRole()) === "owner";

  if (!post) notFound();

  return (
    <>
      <AdminHeader
        title="Edit post"
        subtitle={post.title}
        action={
          canDelete ? (
          <form action={deletePostAction}>
            <input type="hidden" name="id" value={post.id} />
            <DeleteButton label="Delete post" confirmLabel="Click again to delete" />
          </form>
          ) : null
        }
      />
      <PostForm post={post} library={library.all} siteUrl={site.url} />
    </>
  );
}

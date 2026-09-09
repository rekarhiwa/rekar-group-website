import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getCurrentProfile } from "@/lib/auth/session";
import { getAdminPostById, getPostFormOptions } from "@/services/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id === "new") notFound();

  const [post, options, profile] = await Promise.all([
    getAdminPostById(id),
    getPostFormOptions(),
    getCurrentProfile(),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-4">
      {isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}
      <PostEditor
        post={post}
        categories={options.categories}
        tags={options.tags}
        authors={options.authors}
        currentUserId={profile?.id}
      />
    </div>
  );
}

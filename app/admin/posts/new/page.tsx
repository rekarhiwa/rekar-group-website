import { PostEditor } from "@/components/admin/post-editor";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getCurrentProfile } from "@/lib/auth/session";
import { getPostFormOptions } from "@/services/posts";

export default async function NewPostPage() {
  const [{ categories, tags, authors }, profile] = await Promise.all([
    getPostFormOptions(),
    getCurrentProfile(),
  ]);

  return (
    <div className="space-y-4">
      {isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}
      <PostEditor
        categories={categories}
        tags={tags}
        authors={authors}
        currentUserId={profile?.id}
      />
    </div>
  );
}

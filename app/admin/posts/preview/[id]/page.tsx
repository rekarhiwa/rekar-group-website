import { notFound } from "next/navigation";
import Link from "next/link";
import { RichContent } from "@/components/public/rich-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { calculateReadingTime } from "@/lib/posts/utils";
import { getAdminPostById } from "@/services/posts";
import { requireProfile } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function PostPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isSupabaseConfigured()) {
    try {
      await requireProfile();
    } catch {
      notFound();
    }
  }

  const post = await getAdminPostById(id);
  if (!post) notFound();

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="ambient-bg min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Badge className="bg-amber-500/20 text-amber-100">Preview · {post.status}</Badge>
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/admin/posts/${post.id}`}>گەڕانەوە بۆ دەستکاری</Link>
          </Button>
          {post.status === "published" ? (
            <Button asChild size="sm">
              <Link href={`/insights/${post.slug}`}>لاپەڕەی گشتی</Link>
            </Button>
          ) : null}
        </div>
      </div>
      <article className="mx-auto max-w-3xl">
        {post.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            className="mb-8 aspect-[16/9] w-full rounded-[2rem] object-cover"
          />
        ) : null}
        <p className="text-sm text-muted">
          {post.category?.name ? `${post.category.name} · ` : ""}
          {post.published_at ? formatDate(post.published_at) : "بێ بەروار"} · {readingTime} خولەک
        </p>
        <h1 className="mt-3 text-4xl font-black text-foreground">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg text-muted">{post.excerpt}</p> : null}
        <div className="mt-10">
          <RichContent html={post.content || ""} />
        </div>
      </article>
    </div>
  );
}

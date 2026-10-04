import Link from "next/link";

import { PostCover } from "@/components/public/post-cover";
import { getPostCategories } from "@/lib/posts/taxonomy";
import { calculateReadingTime } from "@/lib/posts/utils";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/database";

export function PostCard({ post }: { post: Post }) {
  const readingTime = calculateReadingTime(post.content);

  return (
    <Link
      href={`/insights/${post.slug}`}
      className="glass group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition hover:-translate-y-1 hover:border-accent/35"
    >
      <PostCover post={post} className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          {getPostCategories(post).map((category) => (
            <span key={category.id} className="text-light-violet">
              {category.name}
            </span>
          ))}
          {post.published_at ? <span>{formatDate(post.published_at)}</span> : null}
          <span>{readingTime} خولەک</span>
        </div>
        <h2 className="text-xl font-bold leading-8 text-foreground transition group-hover:text-light-violet">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{post.excerpt}</p>
        ) : null}
      </div>
    </Link>
  );
}

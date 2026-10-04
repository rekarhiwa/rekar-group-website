import Link from "next/link";

import { PostCover } from "@/components/public/post-cover";
import { calculateReadingTime } from "@/lib/posts/utils";
import { getPostCategories } from "@/lib/posts/taxonomy";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/database";

export function PostRow({ post }: { post: Post }) {
  const categories = getPostCategories(post);

  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group grid grid-cols-[7.5rem_1fr] gap-4 border-b border-border py-4 sm:grid-cols-[10rem_1fr] sm:gap-5"
    >
      <PostCover post={post} className="aspect-[16/10] rounded-lg" />
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold tracking-wide text-light-violet uppercase">
          {categories.map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
          {post.published_at ? (
            <span className="font-normal tracking-normal text-muted normal-case">
              {formatDate(post.published_at)}
            </span>
          ) : null}
          <span className="font-normal tracking-normal text-muted normal-case">
            {calculateReadingTime(post.content)} خولەک
          </span>
        </div>
        <h3 className="text-base font-bold leading-7 text-foreground transition group-hover:text-light-violet sm:text-lg sm:leading-8">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{post.excerpt}</p>
        ) : null}
      </div>
    </Link>
  );
}

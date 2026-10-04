import Link from "next/link";

import { PostCover } from "@/components/public/post-cover";
import { getPostCategories } from "@/lib/posts/taxonomy";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/database";

export function FeaturedTile({
  post,
  className,
  titleClassName,
}: {
  post: Post;
  className?: string;
  titleClassName?: string;
}) {
  const category = getPostCategories(post)[0];

  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn("group relative block overflow-hidden rounded-xl", className)}
    >
      <PostCover post={post} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {category ? (
          <span className="mb-2 inline-block rounded bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
            {category.name}
          </span>
        ) : null}
        <h3
          className={cn(
            "line-clamp-3 font-black leading-snug text-white",
            titleClassName
          )}
        >
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

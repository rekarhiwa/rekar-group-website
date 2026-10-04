import Link from "next/link";

import { PostCover } from "@/components/public/post-cover";
import { getPostCategories } from "@/lib/posts/taxonomy";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/database";

export function MagazineCard({ post }: { post: Post }) {
  const category = getPostCategories(post)[0];

  return (
    <Link href={`/insights/${post.slug}`} className="group flex flex-col">
      <PostCover post={post} className="aspect-[16/10] rounded-xl" />
      <div className="mt-3">
        {category ? (
          <p className="text-[11px] font-semibold text-light-violet">{category.name}</p>
        ) : null}
        <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-7 text-foreground transition group-hover:text-light-violet">
          {post.title}
        </h3>
        {post.published_at ? (
          <p className="mt-1.5 text-xs text-muted">{formatDate(post.published_at)}</p>
        ) : null}
      </div>
    </Link>
  );
}

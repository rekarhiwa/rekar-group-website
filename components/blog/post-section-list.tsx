import Link from "next/link";

import { MagazineCard } from "@/components/blog/magazine-card";
import type { Post } from "@/types/database";

export function PostSectionList({
  title,
  href,
  posts,
}: {
  title: string;
  href: string;
  posts: Post[];
}) {
  if (!posts.length) return null;

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="flex items-center gap-2.5 text-lg font-black tracking-tight text-foreground">
          <span className="h-5 w-1 rounded-full bg-accent" />
          {title}
        </h2>
        <Link href={href} className="shrink-0 text-sm text-light-violet transition hover:underline">
          تەواوی بابەت
        </Link>
      </div>
      <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <MagazineCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

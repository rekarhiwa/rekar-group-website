import Link from "next/link";

import { PostCard } from "@/components/public/post-card";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/database";

export function PostsSection({
  title,
  subtitle,
  posts,
}: {
  title: string;
  subtitle?: string | null;
  posts: Post[];
}) {
  if (!posts.length) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="پۆستەکان" title={title} subtitle={subtitle} />
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/insights">هەموو پۆستەکان</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
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
        <SectionHeading eyebrow="Insights" title={title} subtitle={subtitle} />
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="glass overflow-hidden rounded-[2rem]">
              {post.cover_image ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
              <div className="p-7">
                <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted">
                  {post.featured ? <span className="text-light-violet">Featured</span> : null}
                  <span>{post.published_at ? formatDate(post.published_at) : "نوێ"}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">{post.title}</h3>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">{post.excerpt}</p>
                <Link
                  href={`/insights/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-light-violet"
                >
                  خوێندنەوەی زیاتر
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/insights">هەموو بابەتەکان</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

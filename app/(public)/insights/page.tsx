import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { getPosts } from "@/services/content";

export default async function InsightsPage(props: PageProps<"/insights">) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.q === "string" ? searchParams.q : "";
  const posts = await getPosts({ search, publishedOnly: true });

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-light-violet uppercase">
            Insights
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            زانیاری و نوێکاری
          </h1>
          <p className="text-lg leading-8 text-muted">
            بیرۆکە، شیکاری و ڕێنمایی بۆ گەشەی دیجیتاڵی.
          </p>
        </div>

        <form className="glass mb-10 rounded-[2rem] p-4">
          <Input
            name="q"
            defaultValue={search}
            placeholder="گەڕان بە ناونیشان..."
            className="border-0 bg-transparent"
          />
        </form>

        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/insights/${post.slug}`}
              className="glass overflow-hidden rounded-[2rem] transition hover:border-light-violet/30"
            >
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
                <div className="mb-3 text-xs text-muted">
                  {post.category?.name ? `${post.category.name} · ` : ""}
                  {post.published_at ? formatDate(post.published_at) : ""}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{post.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {!posts.length ? (
          <p className="mt-10 text-center text-muted">هیچ بابەتێک نەدۆزرایەوە.</p>
        ) : null}
      </div>
    </section>
  );
}

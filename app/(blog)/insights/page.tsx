import type { Metadata } from "next";
import Link from "next/link";

import { HeroMosaic } from "@/components/blog/hero-mosaic";
import { MagazineCard } from "@/components/blog/magazine-card";
import { PostSectionList } from "@/components/blog/post-section-list";
import { Input } from "@/components/ui/input";
import { blogHomeSections, postHasAnyCategory, postHasCategory } from "@/lib/posts/taxonomy";
import { demoPostCategories } from "@/lib/demo-posts";
import { cn } from "@/lib/utils";
import { getPosts } from "@/services/content";

export const metadata: Metadata = {
  title: "پۆستەکان",
  description:
    "پۆست و شیکاری تەکنەلۆجیا لە ڕێکار گروپ: AI، کۆدینگ، هاردوێر و ڕێنمایی.",
};

const homeChips = [
  { label: "نوێترین", slug: "" },
  ...blogHomeSections.map((section) => ({
    label: section.title,
    slug: section.slugs[0],
  })),
];

export default async function InsightsPage(props: PageProps<"/insights">) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.q === "string" ? searchParams.q : "";
  const categorySlug =
    typeof searchParams.category === "string" ? searchParams.category : "";

  const allPosts = await getPosts({ publishedOnly: true });
  const activeCategory = demoPostCategories.find((item) => item.slug === categorySlug) ?? null;

  const posts = allPosts.filter((post) => {
    if (categorySlug && !postHasCategory(post, categorySlug)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt?.toLowerCase().includes(q) ||
      post.content?.toLowerCase().includes(q)
    );
  });

  const isHome = !categorySlug && !search;
  const featured = isHome ? (posts.find((post) => post.featured) ?? posts[0]) : null;
  const mosaicPosts = featured
    ? [featured, ...posts.filter((post) => post.id !== featured.id)].slice(0, 3)
    : [];
  const mosaicIds = new Set(mosaicPosts.map((post) => post.id));
  const latest = posts.filter((post) => !mosaicIds.has(post.id)).slice(0, 4);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        {isHome ? (
          <h1 className="sr-only">پۆستەکان</h1>
        ) : (
          <h1 className="mb-6 text-3xl font-black tracking-tight text-foreground">
            {activeCategory ? activeCategory.name : "گەڕان"}
          </h1>
        )}

        <form className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {homeChips.map((chip) => {
              const active = chip.slug
                ? categorySlug === chip.slug
                : !categorySlug && !search;
              return (
                <Link
                  key={chip.label}
                  href={chip.slug ? `/insights?category=${chip.slug}` : "/insights"}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition",
                    active
                      ? "bg-primary text-white"
                      : "bg-soft text-muted hover:text-foreground"
                  )}
                >
                  {chip.label}
                </Link>
              );
            })}
          </div>
          <Input
            name="q"
            defaultValue={search}
            placeholder="گەڕان..."
            className="h-10 rounded-full sm:max-w-56"
          />
          {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
        </form>

        {isHome ? (
          <div className="space-y-12">
            <HeroMosaic posts={mosaicPosts} />
            <PostSectionList title="نوێترین بابەتەکان" href="/insights" posts={latest} />
            {blogHomeSections.map((section) => {
              const sectionPosts = allPosts
                .filter(
                  (post) =>
                    !mosaicIds.has(post.id) && postHasAnyCategory(post, section.slugs)
                )
                .slice(0, 4);
              return (
                <PostSectionList
                  key={section.title}
                  title={section.title}
                  href={`/insights?category=${section.slugs[0]}`}
                  posts={sectionPosts}
                />
              );
            })}
          </div>
        ) : posts.length ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <MagazineCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-muted">هیچ پۆستێک نەدۆزرایەوە.</p>
        )}
      </div>
    </section>
  );
}

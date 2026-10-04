import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MagazineCard } from "@/components/blog/magazine-card";
import { PostCover } from "@/components/public/post-cover";
import { RichContent } from "@/components/public/rich-content";
import { ShareButtons } from "@/components/public/share-buttons";
import { TrackPostView } from "@/components/public/track-post-view";
import { Badge } from "@/components/ui/badge";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getPostCategories } from "@/lib/posts/taxonomy";
import { calculateReadingTime } from "@/lib/posts/utils";
import { formatDate } from "@/lib/utils";
import { getPublicPostBySlug, getRelatedPosts } from "@/services/posts";
import { getSiteSettings } from "@/services/content";

export async function generateMetadata(
  props: PageProps<"/insights/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: "بابەت نەدۆزرایەوە" };

  return buildPageMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.og_image || post.cover_image,
    path: `/insights/${post.slug}`,
  });
}

export default async function InsightDetailsPage(
  props: PageProps<"/insights/[slug]">
) {
  const { slug } = await props.params;
  const [post, settings] = await Promise.all([
    getPublicPostBySlug(slug),
    getSiteSettings(),
  ]);

  if (!post) notFound();

  const related = await getRelatedPosts(post, 4);
  const readingTime = calculateReadingTime(post.content);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || settings.website_url || "https://www.rekar.group";
  const canonical = `${siteUrl.replace(/\/$/, "")}/insights/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.seo_description || undefined,
    image: post.og_image || post.cover_image || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || undefined,
    author: {
      "@type": "Person",
      name: post.author?.full_name || post.author?.email || settings.company_name,
    },
    publisher: {
      "@type": "Organization",
      name: settings.company_name_en || settings.company_name,
      logo: settings.logo_url || undefined,
    },
    mainEntityOfPage: canonical,
  };

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <TrackPostView postId={post.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <Link href="/insights" className="text-sm text-light-violet">
          گەڕانەوە بۆ سەرەتا
        </Link>

        <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-border">
          <PostCover post={post} className="aspect-[16/9] min-h-56" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted">
          {getPostCategories(post).map((category) => (
            <Link key={category.id} href={`/insights?category=${category.slug}`}>
              <Badge>{category.name}</Badge>
            </Link>
          ))}
          <span>{post.published_at ? formatDate(post.published_at) : ""}</span>
          <span>·</span>
          <span>{readingTime} خولەک خوێندنەوە</span>
          {post.author ? (
            <>
              <span>·</span>
              <span>{post.author.full_name || post.author.email}</span>
            </>
          ) : null}
        </div>

        <h1 className="mt-4 text-4xl font-black leading-tight text-foreground md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-4 text-lg leading-8 text-muted">{post.excerpt}</p>
        ) : null}

        <div className="mt-8">
          <ShareButtons url={canonical} title={post.title} />
        </div>

        <div className="mt-10">
          <RichContent html={post.content || ""} />
        </div>

        {post.tags?.length ? (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} className="bg-soft">
                #{tag.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-10 border-t border-border pt-8">
          <ShareButtons url={canonical} title={post.title} />
        </div>
      </article>

      {related.length ? (
        <section className="mx-auto mt-20 max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground">پۆستی هاوشێوە</h2>
            <Link href="/insights" className="text-sm text-light-violet">
              هەموو پۆستەکان
            </Link>
          </div>
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <MagazineCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

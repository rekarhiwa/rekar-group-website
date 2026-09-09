import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichContent } from "@/components/public/rich-content";
import { ShareButtons } from "@/components/public/share-buttons";
import { TrackPostView } from "@/components/public/track-post-view";
import { Badge } from "@/components/ui/badge";
import { buildPageMetadata } from "@/lib/seo/metadata";
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

  const related = await getRelatedPosts(post, 3);
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
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <TrackPostView postId={post.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl">
        <Link href="/insights" className="text-sm text-light-violet">
          ← گەڕانەوە بۆ زانیاری
        </Link>

        {post.cover_image ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted">
          {post.category ? <Badge>{post.category.name}</Badge> : null}
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
              <Badge key={tag.id} className="bg-white/5">
                #{tag.name}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-10 border-t border-white/10 pt-8">
          <ShareButtons url={canonical} title={post.title} />
        </div>
      </article>

      {related.length ? (
        <section className="mx-auto mt-20 max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold text-foreground">بابەتە پەیوەندیدارەکان</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/insights/${item.slug}`}
                className="glass rounded-[1.5rem] p-6 transition hover:border-light-violet/40"
              >
                {item.cover_image ? (
                  <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl">
                    <Image
                      src={item.cover_image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

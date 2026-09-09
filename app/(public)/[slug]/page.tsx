import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichContent } from "@/components/public/rich-content";
import { getPageBySlug } from "@/services/content";
import type { PageBlock } from "@/types/database";

function value(content: Record<string, unknown>, key: string) {
  const item = content[key];
  return typeof item === "string" ? item.trim() : "";
}

function list(content: Record<string, unknown>, key: string) {
  const item = content[key];
  return Array.isArray(item) ? item.filter((entry): entry is string => typeof entry === "string") : [];
}

function BlockRenderer({ block }: { block: PageBlock }) {
  const content = block.content;

  switch (block.type) {
    case "heading": {
      const title = value(content, "title");
      const subtitle = value(content, "subtitle");
      if (!title && !subtitle) return null;
      return (
        <section className="py-10 text-center">
          {title ? (
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? <p className="mt-4 text-lg text-muted">{subtitle}</p> : null}
        </section>
      );
    }
    case "text": {
      const text = value(content, "text") || value(content, "content");
      return text ? (
        <section className="py-6">
          <p className="text-lg leading-9 text-muted">{text}</p>
        </section>
      ) : null;
    }
    case "rich_text":
    case "custom_html": {
      const html = value(content, "html") || value(content, "content");
      return html ? (
        <section className="py-6">
          <RichContent html={html} />
        </section>
      ) : null;
    }
    case "image": {
      const src = value(content, "src") || value(content, "image_url");
      if (!src) return null;
      return (
        <section className="py-6">
          <div className="relative h-80 overflow-hidden rounded-[2rem] border border-white/10">
            <Image
              src={src}
              alt={value(content, "alt") || "image"}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </section>
      );
    }
    case "image_text": {
      const src = value(content, "src") || value(content, "image_url");
      const title = value(content, "title");
      const text = value(content, "text") || value(content, "content");
      if (!src && !title && !text) return null;
      return (
        <section className="grid gap-8 py-8 lg:grid-cols-2 lg:items-center">
          {src ? (
            <div className="relative h-80 overflow-hidden rounded-[2rem] border border-white/10">
              <Image
                src={src}
                alt={value(content, "alt") || title || "image"}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 600px"
              />
            </div>
          ) : null}
          <div className="space-y-4">
            {title ? <h2 className="text-3xl font-bold text-foreground">{title}</h2> : null}
            {text ? <p className="text-lg leading-9 text-muted">{text}</p> : null}
          </div>
        </section>
      );
    }
    case "gallery": {
      const images = Array.isArray(content.images)
        ? content.images.filter(
            (item): item is { src?: string; alt?: string } =>
              typeof item === "object" && item !== null
          )
        : [];
      if (!images.length) return null;
      return (
        <section className="grid gap-4 py-6 md:grid-cols-2">
          {images.map((image, index) =>
            image.src ? (
              <div
                key={`${image.src}-${index}`}
                className="relative h-64 overflow-hidden rounded-[2rem] border border-white/10"
              >
                <Image
                  src={image.src}
                  alt={image.alt || "gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 600px"
                />
              </div>
            ) : null
          )}
        </section>
      );
    }
    case "button": {
      const href = value(content, "url");
      const label = value(content, "label");
      return href && label ? (
        <section className="py-6">
          <Link
            href={href}
            className="inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-white shadow-[0_0_24px_rgba(123,0,200,0.35)]"
          >
            {label}
          </Link>
        </section>
      ) : null;
    }
    case "cta": {
      const title = value(content, "title");
      const subtitle = value(content, "subtitle");
      const href = value(content, "url");
      const label = value(content, "label");
      if (!title && !subtitle && !href && !label) return null;
      return (
        <section className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-12 text-center">
          {title ? <h2 className="text-3xl font-bold text-foreground">{title}</h2> : null}
          {subtitle ? <p className="mt-4 text-lg text-muted">{subtitle}</p> : null}
          {href && label ? (
            <div className="mt-6">
              <Link
                href={href}
                className="inline-flex rounded-2xl bg-primary px-5 py-3 font-semibold text-white"
              >
                {label}
              </Link>
            </div>
          ) : null}
        </section>
      );
    }
    case "faq": {
      const items = Array.isArray(content.items)
        ? content.items.filter(
            (item): item is { question?: string; answer?: string } =>
              typeof item === "object" && item !== null
          )
        : [];
      if (!items.length) return null;
      return (
        <section className="space-y-4 py-6">
          {items.map((item, index) =>
            item.question || item.answer ? (
              <details key={`${item.question}-${index}`} className="glass rounded-2xl p-5">
                <summary className="cursor-pointer font-semibold text-foreground">
                  {item.question}
                </summary>
                {item.answer ? <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p> : null}
              </details>
            ) : null
          )}
        </section>
      );
    }
    case "stats":
    case "features": {
      const items = list(content, "items");
      if (!items.length) return null;
      return (
        <section className="grid gap-4 py-6 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item} className="glass rounded-2xl p-5 text-muted">
              {item}
            </div>
          ))}
        </section>
      );
    }
    case "video": {
      const url = value(content, "url");
      return url ? (
        <section className="py-6">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="glass inline-flex rounded-2xl px-5 py-3 font-semibold text-foreground"
          >
            بینینی ڤیدیۆ
          </a>
        </section>
      ) : null;
    }
    case "spacer": {
      return <div className="h-8 sm:h-12" />;
    }
    default:
      return null;
  }
}

export async function generateMetadata(
  props: PageProps<"/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await getPageBySlug(slug);

  if (!page) return { title: "لاپەڕە نەدۆزرایەوە" };

  return {
    title: page.seo_title || page.title,
    description: page.seo_description || undefined,
  };
}

export default async function CustomPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-black/10 p-8 sm:p-10">
        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
          {page.title}
        </h1>
        <div className="mt-8 space-y-2">
          {(page.blocks || []).map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
}

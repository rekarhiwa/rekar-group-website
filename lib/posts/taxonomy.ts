import type { Post, PostCategory } from "@/types/database";

export type BlogNavItem = {
  slug: string;
  name: string;
};

export type BlogNavGroup = {
  id: string;
  label: string;
  href: string;
  items: BlogNavItem[];
};

/** Magazine-style nav: a few dropdowns instead of every category in a row */
export const blogNavGroups: BlogNavGroup[] = [
  {
    id: "edu",
    label: "فێرکاری",
    href: "/insights?category=edu",
    items: [
      { slug: "edu", name: "هەموو فێرکاری" },
      { slug: "tips", name: "ڕێنمایی" },
      { slug: "mobile", name: "مۆبایل" },
      { slug: "ai", name: "AI" },
    ],
  },
  {
    id: "social",
    label: "سۆشیال",
    href: "/insights?category=social",
    items: [
      { slug: "social", name: "هەموو سۆشیال" },
      { slug: "tips", name: "ڕێنمایی و پاسۆرد" },
      { slug: "mobile", name: "مۆبایل و واتساپ" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    href: "/insights?category=ai",
    items: [
      { slug: "ai", name: "هەموو AI" },
      { slug: "image", name: "وێنە" },
      { slug: "video", name: "ڤیدیۆ" },
      { slug: "research", name: "توێژینەوە" },
      { slug: "medical", name: "پزیشکی" },
    ],
  },
  {
    id: "dev",
    label: "گەشەپێدان",
    href: "/insights?category=coding",
    items: [
      { slug: "coding", name: "کۆدینگ" },
      { slug: "web", name: "وێب" },
      { slug: "mobile", name: "مۆبایل" },
      { slug: "database", name: "داتابەیس" },
    ],
  },
  {
    id: "hardware",
    label: "هاردوێر",
    href: "/insights?category=hardware",
    items: [
      { slug: "hardware", name: "هاردوێر" },
      { slug: "engineering", name: "ئەندازیاری" },
    ],
  },
];

export const blogHomeSections: { title: string; slugs: string[] }[] = [
  { title: "فێرکاری", slugs: ["edu"] },
  { title: "سۆشیال میدیا", slugs: ["social"] },
  { title: "هەواڵ", slugs: ["news"] },
  { title: "AI", slugs: ["ai", "image", "video", "research", "medical"] },
  { title: "گەشەپێدان", slugs: ["coding", "web", "mobile", "database"] },
  { title: "هاردوێر", slugs: ["hardware", "engineering"] },
  { title: "ڕێنمایی", slugs: ["tips"] },
];

export function getPostCategories(post: Post): PostCategory[] {
  if (post.categories?.length) return post.categories;
  return post.category ? [post.category] : [];
}

export function postHasCategory(post: Post, slug: string): boolean {
  return getPostCategories(post).some((category) => category.slug === slug);
}

export function postHasAnyCategory(post: Post, slugs: string[]): boolean {
  return slugs.some((slug) => postHasCategory(post, slug));
}

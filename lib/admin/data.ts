import { cache } from "react";
import { isClerkConfigured } from "@/lib/auth/clerk";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import {
  demoClients,
  demoNav,
  demoPosts,
  demoProcess,
  demoProjects,
  demoServices,
  demoSiteSettings,
  demoSocial,
  demoStats,
  demoTestimonials,
  demoThemeSettings,
} from "@/lib/demo-data";
import type {
  AuditLog,
  Client,
  ContactMessage,
  ContentStatus,
  HomepageSection,
  MediaItem,
  NavigationItem,
  Page,
  PageBlockType,
  Post,
  PostCategory,
  ProcessStep,
  Profile,
  Project,
  ProjectCategory,
  Service,
  SiteSettings,
  SocialLink,
  StatItem,
  Tag,
  Testimonial,
  ThemeSettings,
} from "@/types/database";
import type { AdminField, AdminFieldOption } from "@/lib/admin/shared";

export interface AdminSectionConfig {
  key: string;
  title: string;
  description: string;
  entityLabel: string;
  table?: string;
  mode:
    | "dashboard"
    | "home"
    | "detail-collection"
    | "inline-collection"
    | "categories"
    | "messages"
    | "navigation"
    | "media"
    | "settings"
    | "users"
    | "activity"
    | "trash";
  fields?: AdminField[];
  supportsSoftDelete?: boolean;
  supportsStatus?: boolean;
}

export const STATUS_OPTIONS: AdminFieldOption[] = [
  { label: "ڕەشنووس", value: "draft" },
  { label: "بڵاوکراو", value: "published" },
  { label: "ئەرشیفکراو", value: "archived" },
  { label: "خشتەکراو", value: "scheduled" },
];

export const PAGE_BLOCK_OPTIONS: AdminFieldOption[] = [
  { label: "سەردێڕ", value: "heading" },
  { label: "دەق", value: "text" },
  { label: "دەقی دەوڵەمەند", value: "rich_text" },
  { label: "وێنە", value: "image" },
  { label: "وێنە + دەق", value: "image_text" },
  { label: "گالەری", value: "gallery" },
  { label: "دوگمە", value: "button" },
  { label: "بانگەواز بۆ کردار", value: "cta" },
  { label: "پرسیار و وەڵام", value: "faq" },
  { label: "ئامارەکان", value: "stats" },
  { label: "تایبەتمەندییەکان", value: "features" },
  { label: "ڤیدیۆ", value: "video" },
  { label: "بۆشایی", value: "spacer" },
  { label: "HTMLی تایبەت", value: "custom_html" },
];

export const adminSections: Record<string, AdminSectionConfig> = {
  services: {
    key: "services",
    title: "خزمەتگوزارییەکان",
    description: "کارتی خزمەتگوزاری، وەسف، دۆخ و ڕیزکردن بەڕێوەببە.",
    entityLabel: "خزمەتگوزاری",
    table: "services",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "title", label: "ناونیشان", type: "text" },
      { name: "slug", label: "سلەگ", type: "text" },
      { name: "short_description", label: "وەسفی کورت", type: "textarea" },
      { name: "full_description", label: "وەسفی تەواو", type: "richtext" },
      { name: "icon", label: "ئایکۆن", type: "text" },
      { name: "cover_image", label: "وێنەی سەرپۆش", type: "image" },
      { name: "features", label: "تایبەتمەندییەکان", type: "tags" },
      { name: "sort_order", label: "ڕیزبەندی", type: "number" },
      { name: "status", label: "دۆخ", type: "select", options: STATUS_OPTIONS.slice(0, 3) },
      { name: "seo_title", label: "ناونیشانی SEO", type: "text" },
      { name: "seo_description", label: "وەسفی SEO", type: "textarea" },
    ],
  },
  projects: {
    key: "projects",
    title: "پڕۆژەکان",
    description: "بەرهەمەکانی پۆرتفۆلیۆ، نیشانەکردنی تایبەت، لینک و گالەری بەڕێوەببە.",
    entityLabel: "پڕۆژە",
    table: "projects",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "name", label: "ناو", type: "text" },
      { name: "slug", label: "سلەگ", type: "text" },
      { name: "category_id", label: "پۆل", type: "select" },
      { name: "short_description", label: "وەسفی کورت", type: "textarea" },
      { name: "full_description", label: "وەسفی تەواو", type: "richtext" },
      { name: "icon", label: "ئایکۆن / لۆگۆ", type: "image" },
      { name: "cover_image", label: "وێنەی سەرپۆش", type: "image" },
      { name: "client_name", label: "ناوی کڕیار", type: "text" },
      { name: "completion_date", label: "بەرواری تەواوکردن", type: "date" },
      { name: "website_url", label: "بەستەری وێبسایت", type: "text" },
      { name: "play_store_url", label: "بەستەری Play Store", type: "text" },
      { name: "app_store_url", label: "بەستەری App Store", type: "text" },
      { name: "github_url", label: "بەستەری GitHub", type: "text" },
      { name: "challenge", label: "ئاڵنگاری", type: "textarea" },
      { name: "solution", label: "چارەسەر", type: "textarea" },
      { name: "result", label: "ئەنجام", type: "textarea" },
      { name: "case_study", label: "توێژینەوەی کەیس", type: "richtext" },
      { name: "features", label: "تایبەتمەندییەکان", type: "tags" },
      { name: "platforms", label: "پلاتفۆرمەکان", type: "tags" },
      { name: "sort_order", label: "ڕیزبەندی", type: "number" },
      { name: "featured", label: "تایبەت", type: "switch" },
      { name: "show_in_marquee", label: "پیشاندان لە مارکی", type: "switch" },
      { name: "status", label: "دۆخ", type: "select", options: STATUS_OPTIONS.slice(0, 3) },
    ],
  },
  posts: {
    key: "posts",
    title: "پۆستەکان",
    description: "پۆستی بلۆگ، پۆل، تاگ، SEO و بەرواری بڵاوکردنەوە بەڕێوەببە.",
    entityLabel: "پۆست",
    table: "posts",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "title", label: "ناونیشان", type: "text" },
      { name: "slug", label: "سلەگ", type: "text" },
      { name: "excerpt", label: "کورتە", type: "textarea" },
      { name: "content", label: "ناوەڕۆک", type: "richtext" },
      { name: "cover_image", label: "وێنەی سەرپۆش", type: "image" },
      { name: "category_id", label: "پۆل", type: "select" },
      { name: "tag_ids", label: "تاگەکان", type: "tags" },
      { name: "featured", label: "تایبەت", type: "switch" },
      { name: "status", label: "دۆخ", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "بەرواری بڵاوکردنەوە", type: "date" },
      { name: "seo_title", label: "ناونیشانی SEO", type: "text" },
      { name: "seo_description", label: "وەسفی SEO", type: "textarea" },
      { name: "og_image", label: "وێنەی OG", type: "image" },
    ],
  },
  pages: {
    key: "pages",
    title: "پەڕەکان",
    description: "پەڕەی داینامیکی ماڵپەڕ دروست بکە لەگەڵ بلۆکی ناوەڕۆکی دووبارە بەکارهێنراو.",
    entityLabel: "پەڕە",
    table: "pages",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "title", label: "ناونیشان", type: "text" },
      { name: "slug", label: "سلەگ", type: "text" },
      { name: "status", label: "دۆخ", type: "select", options: STATUS_OPTIONS.slice(0, 3) },
      { name: "seo_title", label: "ناونیشانی SEO", type: "text" },
      { name: "seo_description", label: "وەسفی SEO", type: "textarea" },
      { name: "blocks_json", label: "بلۆکەکان", type: "textarea" },
    ],
  },
  clients: {
    key: "clients",
    title: "کڕیارەکان",
    description: "لۆگۆ، لینک، ڕیزکردن و بینین بەڕێوەببە.",
    entityLabel: "کڕیار",
    table: "clients",
    mode: "inline-collection",
    fields: [
      { name: "name", label: "ناو", type: "text" },
      { name: "logo", label: "لۆگۆ", type: "image" },
      { name: "website", label: "وێبسایت", type: "text" },
      { name: "sort_order", label: "ڕیزبەندی", type: "number" },
      { name: "visible", label: "دیار", type: "switch" },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "شایەتییەکان",
    description: "وتەی کڕیار، بینین، دۆخی تایبەت و هەڵسەنگاندن بەڕێوەببە.",
    entityLabel: "شایەتی",
    table: "testimonials",
    mode: "inline-collection",
    fields: [
      { name: "name", label: "ناو", type: "text" },
      { name: "job_title", label: "ناونیشانی کار", type: "text" },
      { name: "company", label: "کۆمپانیا", type: "text" },
      { name: "avatar", label: "وێنەی کەسی", type: "image" },
      { name: "testimonial", label: "شایەتی", type: "textarea" },
      { name: "rating", label: "هەڵسەنگاندن", type: "number" },
      { name: "featured", label: "تایبەت", type: "switch" },
      { name: "visible", label: "دیار", type: "switch" },
      { name: "sort_order", label: "ڕیزبەندی", type: "number" },
    ],
  },
  process: {
    key: "process",
    title: "پرۆسە",
    description: "هەنگاوەکانی بەشی شێوازی کاری کۆمپانیا بەڕێوەببە.",
    entityLabel: "هەنگاوی پرۆسە",
    table: "process_steps",
    mode: "inline-collection",
    fields: [
      { name: "step_number", label: "ژمارەی هەنگاو", type: "number" },
      { name: "title", label: "ناونیشان", type: "text" },
      { name: "description", label: "وەسف", type: "textarea" },
      { name: "icon", label: "ئایکۆن", type: "text" },
      { name: "sort_order", label: "ڕیزبەندی", type: "number" },
      { name: "visible", label: "دیار", type: "switch" },
    ],
  },
  stats: {
    key: "stats",
    title: "ئامارەکان",
    description: "ئاماری پەڕەی سەرەکی و بینینی هیڕۆ بەڕێوەببە.",
    entityLabel: "ئامار",
    table: "stats",
    mode: "inline-collection",
    fields: [
      { name: "value", label: "بەها", type: "text" },
      { name: "label", label: "ناونیشان", type: "text" },
      { name: "icon", label: "ئایکۆن", type: "text" },
      { name: "sort_order", label: "ڕیزبەندی", type: "number" },
      { name: "visible", label: "دیار", type: "switch" },
      { name: "show_in_hero", label: "پیشاندان لە هیڕۆ", type: "switch" },
    ],
  },
  messages: {
    key: "messages",
    title: "نامەکان",
    description: "پێشکەشکردنەکانی فۆرمی پەیوەندی و دۆخی مۆدێرەیشن پێداچوونەوە بکە.",
    entityLabel: "نامە",
    table: "contact_messages",
    mode: "messages",
  },
  navigation: {
    key: "navigation",
    title: "گەشتکردن",
    description: "ناونیشانی مێنیو، لینک، ڕیز و بینین بەڕێوەببە.",
    entityLabel: "بڕگەی گەشتکردن",
    table: "navigation_items",
    mode: "navigation",
  },
  media: {
    key: "media",
    title: "میدیا",
    description: "فایل باربکە، میدیا بگەڕێ و URL کۆپی بکە.",
    entityLabel: "فایلی میدیا",
    table: "media",
    mode: "media",
  },
  settings: {
    key: "settings",
    title: "ڕێکخستنەکان",
    description: "ڕێکخستنی ماڵپەڕ، ڕووکار و فووتەر بەڕێوەببە.",
    entityLabel: "ڕێکخستنەکان",
    mode: "settings",
  },
  users: {
    key: "users",
    title: "بەکارهێنەران",
    description: "دەستگەیشتن و ڕۆڵی تیمی ئادمین بەڕێوەببە.",
    entityLabel: "بەکارهێنەر",
    table: "profiles",
    mode: "users",
  },
  activity: {
    key: "activity",
    title: "چالاکی",
    description: "لۆگی گۆڕانکارییەکانی ئادمین پێداچوونەوە بکە.",
    entityLabel: "چالاکی",
    table: "audit_logs",
    mode: "activity",
  },
  trash: {
    key: "trash",
    title: "زبڵدان",
    description: "پڕۆژە، پۆست و پەڕەی سڕاوە بە نەرمی بگەڕێنەوە.",
    entityLabel: "زبڵدان",
    mode: "trash",
  },
  tags: {
    key: "tags",
    title: "تاگەکان",
    description: "تاگە دووبارە بەکارهێنراوەکانی بلۆگ بەڕێوەببە.",
    entityLabel: "تاگ",
    table: "tags",
    mode: "inline-collection",
    fields: [
      { name: "name", label: "ناو", type: "text" },
      { name: "slug", label: "سلەگ", type: "text" },
    ],
  },
  categories: {
    key: "categories",
    title: "پۆلەکان",
    description: "پۆلی پڕۆژە و پۆست لە یەک شوێن بەڕێوەببە.",
    entityLabel: "پۆل",
    mode: "categories",
  },
};

const demoPostCategories: PostCategory[] = [
  { id: "cat-post-1", name: "تەکنەلۆجیا", slug: "technology" },
  { id: "cat-post-2", name: "مارکێتینگ", slug: "marketing" },
];

const demoTags: Tag[] = [
  { id: "tag-1", name: "وێبسایت", slug: "website" },
  { id: "tag-2", name: "سۆشیال میدیا", slug: "social-media" },
  { id: "tag-3", name: "مۆبایل", slug: "mobile" },
];

const demoPages: Page[] = [
  {
    id: "page-1",
    title: "دەربارەی ڕێکار گروپ",
    slug: "company",
    status: "published",
    seo_title: "دەربارەی ڕێکار گروپ",
    seo_description: "پەیجێکی نموونەیی بۆ ناساندنی کۆمپانیا.",
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    blocks: [
      {
        id: "block-1",
        page_id: "page-1",
        type: "heading",
        content: { text: "دەربارەی ئێمە" },
        sort_order: 1,
        visible: true,
      },
      {
        id: "block-2",
        page_id: "page-1",
        type: "rich_text",
        content: {
          html: "<p>ڕێکار گروپ تیمێکی تایبەتی دیجیتاڵە کە لە وێبسایت، ئەپ و سیستەم کار دەکات.</p>",
        },
        sort_order: 2,
        visible: true,
      },
    ],
  },
];

const demoMessages: ContactMessage[] = [
  {
    id: "msg-1",
    full_name: "سیروان",
    phone: "07501234567",
    email: "sirwan@example.com",
    company: "Noor",
    project_type: "Mobile App",
    budget: "$3k-$5k",
    message: "ئەمەمان پێویستە بۆ ئەپێکی نوێ.",
    is_read: false,
    is_important: true,
    is_archived: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "msg-2",
    full_name: "رەخشان",
    phone: "07770001122",
    email: "raxshan@example.com",
    company: "Krin",
    project_type: "Website",
    budget: "$1k-$3k",
    message: "دەمەوێت وێبسایتێکی نوێ دروست بکرێت.",
    is_read: true,
    is_important: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

const demoMedia: MediaItem[] = [
  {
    id: "media-1",
    filename: "logo-mark.png",
    url: "/brand/logo-mark.png",
    size: 2048,
    mime_type: "image/png",
    alt_text: "Rekar Group",
    uploaded_by: null,
    created_at: new Date().toISOString(),
  },
];

const demoUsers: Profile[] = [
  {
    id: "user-1",
    email: "admin@rekar.group",
    full_name: "Rekar Admin",
    role: "super_admin",
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "user-2",
    email: "editor@rekar.group",
    full_name: "Content Editor",
    role: "editor",
    avatar_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const demoAuditLogs: AuditLog[] = [
  {
    id: "audit-1",
    user_id: "user-1",
    user_name: "Rekar Admin",
    action: "updated",
    entity: "settings",
    entity_id: null,
    entity_label: "ڕێکخستنی سایت",
    created_at: new Date().toISOString(),
  },
];

async function getDb() {
  return createClient();
}

export function isAdminDemoMode() {
  return !isClerkConfigured() && !isSupabaseConfigured();
}

export function getSectionConfig(section: string) {
  return adminSections[section] ?? null;
}

export function getNewRecordTemplate(section: string) {
  if (section === "pages") {
    return {
      title: "",
      slug: "",
      status: "draft",
      seo_title: "",
      seo_description: "",
      blocks_json: JSON.stringify(
        [
          {
            type: "heading" satisfies PageBlockType,
            visible: true,
            sort_order: 1,
            content: { text: "New Heading" },
          },
        ],
        null,
        2
      ),
    };
  }

  const config = getSectionConfig(section);
  if (!config?.fields) return {};
  return config.fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.name] = field.type === "switch" ? false : field.type === "number" ? 0 : "";
    return acc;
  }, {});
}

export const getAdminDashboard = cache(async () => {
  const demoPayload = {
    demoMode: true as const,
    counts: {
      projects: demoProjects.length,
      publishedProjects: demoProjects.filter((item) => item.status === "published").length,
      posts: demoPosts.length,
      draftPosts: demoPosts.filter((item) => item.status === "draft").length,
      unreadMessages: demoMessages.filter((item) => !item.is_read).length,
      services: demoServices.length,
      pages: demoPages.length,
    },
    recentProjects: demoProjects.slice(0, 4),
    recentPosts: demoPosts.slice(0, 4),
    recentMessages: demoMessages.slice(0, 4),
  };

  if (!isSupabaseConfigured()) {
    return demoPayload;
  }

  try {
    const supabase = await getDb();
    const [projects, posts, messages, services, pages] = await Promise.all([
      supabase.from("projects").select("*").order("updated_at", { ascending: false }),
      supabase.from("posts").select("*").order("updated_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("*"),
      supabase.from("pages").select("*"),
    ]);

    const { isMissingRelationError } = await import("@/lib/supabase/schema");
    if (
      [projects, posts, messages, services, pages].some((result) =>
        isMissingRelationError(result.error?.message)
      )
    ) {
      return demoPayload;
    }

    const projectRows = (projects.data ?? []) as Project[];
    const postRows = (posts.data ?? []) as Post[];
    const messageRows = (messages.data ?? []) as ContactMessage[];
    const serviceRows = (services.data ?? []) as Service[];
    const pageRows = (pages.data ?? []) as Page[];

    return {
      demoMode: false,
      counts: {
        projects: projectRows.filter((item) => !item.deleted_at).length,
        publishedProjects: projectRows.filter(
          (item) => !item.deleted_at && item.status === "published"
        ).length,
        posts: postRows.filter((item) => !item.deleted_at).length,
        draftPosts: postRows.filter((item) => !item.deleted_at && item.status === "draft").length,
        unreadMessages: messageRows.filter((item) => !item.is_read && !item.is_archived).length,
        services: serviceRows.filter((item) => !item.deleted_at).length,
        pages: pageRows.filter((item) => !item.deleted_at).length,
      },
      recentProjects: projectRows.slice(0, 4),
      recentPosts: postRows.slice(0, 4),
      recentMessages: messageRows.slice(0, 4),
    };
  } catch {
    return demoPayload;
  }
});

export async function getHomepageAdminData() {
  if (!isSupabaseConfigured()) {
    const { demoSections, demoHero } = await import("@/lib/demo-data");
    return { sections: demoSections, hero: demoHero, demoMode: true };
  }
  const supabase = await getDb();
  const [sections, hero] = await Promise.all([
    supabase.from("homepage_sections").select("*").order("sort_order"),
    supabase.from("hero_settings").select("*").limit(1).single(),
  ]);
  return {
    sections: ((sections.data ?? []) as HomepageSection[]) ?? [],
    hero: hero.data,
    demoMode: false,
  };
}

export async function getCollectionRecords(section: string) {
  if (!isSupabaseConfigured()) {
    return getDemoCollection(section);
  }

  try {
    const supabase = await getDb();
    const { isMissingRelationError } = await import("@/lib/supabase/schema");

    const run = async <T,>(promise: PromiseLike<{ data: T[] | null; error: { message?: string } | null }>) => {
      const { data, error } = await promise;
      if (error && isMissingRelationError(error.message)) {
        return null;
      }
      return (data ?? []) as T[];
    };

    switch (section) {
      case "services": {
        const rows = await run(
          supabase.from("services").select("*").order("sort_order")
        );
        return rows ?? getDemoCollection(section);
      }
      case "projects": {
        const rows = await run(
          supabase.from("projects").select("*, category:project_categories(*)").order("sort_order")
        );
        return rows ?? getDemoCollection(section);
      }
      case "posts": {
        const rows = await run(
          supabase
            .from("posts")
            .select("*, category:post_categories(*)")
            .order("updated_at", { ascending: false })
        );
        return rows ?? getDemoCollection(section);
      }
      case "pages": {
        const rows = await run(
          supabase.from("pages").select("*").order("updated_at", { ascending: false })
        );
        return rows ?? getDemoCollection(section);
      }
      case "clients": {
        const rows = await run(supabase.from("clients").select("*").order("sort_order"));
        return rows ?? getDemoCollection(section);
      }
      case "testimonials": {
        const rows = await run(
          supabase.from("testimonials").select("*").order("sort_order")
        );
        return rows ?? getDemoCollection(section);
      }
      case "process": {
        const rows = await run(
          supabase.from("process_steps").select("*").order("sort_order")
        );
        return rows ?? getDemoCollection(section);
      }
      case "stats": {
        const rows = await run(supabase.from("stats").select("*").order("sort_order"));
        return rows ?? getDemoCollection(section);
      }
      case "tags": {
        const rows = await run(supabase.from("tags").select("*").order("name"));
        return rows ?? getDemoCollection(section);
      }
      default:
        return [];
    }
  } catch {
    return getDemoCollection(section);
  }
}

export async function getSingleRecord(section: string, id: string) {
  if (id === "new") return getNewRecordTemplate(section);
  if (!isSupabaseConfigured()) {
    const rows = await getDemoCollection(section);
    return rows.find((row: { id?: string }) => row.id === id) ?? null;
  }

  const supabase = await getDb();
  switch (section) {
    case "projects": {
      const { data } = await supabase
        .from("projects")
        .select("*, category:project_categories(*)")
        .eq("id", id)
        .single();
      return data;
    }
    case "posts": {
      const { data } = await supabase
        .from("posts")
        .select("*, tags:post_tags(tag:tags(*))")
        .eq("id", id)
        .single();
      if (!data) return null;
      return {
        ...data,
        tag_ids: ((data.tags as { tag: Tag }[] | null) ?? []).map((item) => item.tag.slug).join(", "),
      };
    }
    case "pages": {
      const { data } = await supabase
        .from("pages")
        .select("*, blocks:page_blocks(*)")
        .eq("id", id)
        .single();
      if (!data) return null;
      return {
        ...data,
        blocks_json: JSON.stringify(
          ((data.blocks as unknown[]) ?? []).sort(
            (a, b) =>
              Number((a as { sort_order?: number }).sort_order ?? 0) -
              Number((b as { sort_order?: number }).sort_order ?? 0)
          ),
          null,
          2
        ),
      };
    }
    default: {
      const config = getSectionConfig(section);
      if (!config?.table) return null;
      const { data } = await supabase.from(config.table).select("*").eq("id", id).single();
      return data;
    }
  }
}

export async function getCategoriesData() {
  if (!isSupabaseConfigured()) {
    return {
      projectCategories: [
        { id: "pc1", name: "Apps", slug: "apps", sort_order: 1 },
        { id: "pc2", name: "Websites", slug: "websites", sort_order: 2 },
        { id: "pc3", name: "Systems", slug: "systems", sort_order: 3 },
      ] satisfies ProjectCategory[],
      postCategories: demoPostCategories,
      demoMode: true,
    };
  }
  const supabase = await getDb();
  const [projectCategories, postCategories] = await Promise.all([
    supabase.from("project_categories").select("*").order("sort_order"),
    supabase.from("post_categories").select("*").order("name"),
  ]);
  return {
    projectCategories: (projectCategories.data ?? []) as ProjectCategory[],
    postCategories: (postCategories.data ?? []) as PostCategory[],
    demoMode: false,
  };
}

export async function getNavigationData() {
  if (!isSupabaseConfigured()) {
    return { items: demoNav, socialLinks: demoSocial, demoMode: true };
  }
  const supabase = await getDb();
  const [items, socialLinks] = await Promise.all([
    supabase.from("navigation_items").select("*").order("sort_order"),
    supabase.from("social_links").select("*").order("sort_order"),
  ]);
  return {
    items: (items.data ?? []) as NavigationItem[],
    socialLinks: (socialLinks.data ?? []) as SocialLink[],
    demoMode: false,
  };
}

export async function getMessagesData() {
  if (!isSupabaseConfigured()) return { items: demoMessages, demoMode: true };
  const supabase = await getDb();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return { items: (data ?? []) as ContactMessage[], demoMode: false };
}

export async function getSettingsData() {
  if (!isSupabaseConfigured()) {
    return {
      site: demoSiteSettings,
      theme: demoThemeSettings,
      socialLinks: demoSocial,
      demoMode: true,
    };
  }

  const supabase = await getDb();
  const [site, theme, socialLinks] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).single(),
    supabase.from("theme_settings").select("*").limit(1).single(),
    supabase.from("social_links").select("*").order("sort_order"),
  ]);
  return {
    site: (site.data as SiteSettings | null) ?? demoSiteSettings,
    theme: (theme.data as ThemeSettings | null) ?? demoThemeSettings,
    socialLinks: (socialLinks.data ?? []) as SocialLink[],
    demoMode: false,
  };
}

export async function getUsersData() {
  if (!isSupabaseConfigured()) return { items: demoUsers, demoMode: true };
  const supabase = await getDb();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  return { items: (data ?? []) as Profile[], demoMode: false };
}

export async function getActivityData() {
  if (!isSupabaseConfigured()) return { items: demoAuditLogs, demoMode: true };
  const supabase = await getDb();
  const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
  return { items: (data ?? []) as AuditLog[], demoMode: false };
}

export async function getTrashData() {
  if (!isSupabaseConfigured()) {
    return {
      projects: demoProjects.filter((item) => item.deleted_at),
      posts: demoPosts.filter((item) => item.deleted_at),
      pages: demoPages.filter((item) => item.deleted_at),
      demoMode: true,
    };
  }
  const supabase = await getDb();
  const [projects, posts, pages] = await Promise.all([
    supabase.from("projects").select("*").not("deleted_at", "is", null).order("updated_at", { ascending: false }),
    supabase.from("posts").select("*").not("deleted_at", "is", null).order("updated_at", { ascending: false }),
    supabase.from("pages").select("*").not("deleted_at", "is", null).order("updated_at", { ascending: false }),
  ]);
  return {
    projects: (projects.data ?? []) as Project[],
    posts: (posts.data ?? []) as Post[],
    pages: (pages.data ?? []) as Page[],
    demoMode: false,
  };
}

export async function getMediaData() {
  if (!isSupabaseConfigured()) return { items: demoMedia, demoMode: true };
  const supabase = await getDb();
  const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
  return { items: (data ?? []) as MediaItem[], demoMode: false };
}

export async function getFormSelectOptions(section: string) {
  if (section === "projects") {
    const projectCategories = await getProjectCategoryOptions();
    return { category_id: projectCategories };
  }
  if (section === "posts") {
    const [postCategories, tags] = await Promise.all([
      getPostCategoryOptions(),
      getTagOptions(),
    ]);
    return {
      category_id: postCategories,
      tag_ids: tags,
    };
  }
  return {};
}

export async function getProjectCategoryOptions() {
  const rows = isSupabaseConfigured()
    ? (((await (await getDb()).from("project_categories").select("*").order("sort_order")).data ??
        []) as ProjectCategory[])
    : ((await getCategoriesData()).projectCategories as ProjectCategory[]);
  return rows.map((item) => ({ label: item.name, value: item.id }));
}

export async function getPostCategoryOptions() {
  const rows = isSupabaseConfigured()
    ? (((await (await getDb()).from("post_categories").select("*").order("name")).data ??
        []) as PostCategory[])
    : ((await getCategoriesData()).postCategories as PostCategory[]);
  return rows.map((item) => ({ label: item.name, value: item.id }));
}

export async function getTagOptions() {
  const rows = isSupabaseConfigured()
    ? (((await (await getDb()).from("tags").select("*").order("name")).data ?? []) as Tag[])
    : (demoTags as Tag[]);
  return rows.map((item) => ({ label: item.name, value: item.slug }));
}

async function getDemoCollection(section: string) {
  switch (section) {
    case "services":
      return demoServices;
    case "projects":
      return demoProjects;
    case "posts":
      return demoPosts;
    case "pages":
      return demoPages;
    case "clients":
      return demoClients;
    case "testimonials":
      return demoTestimonials;
    case "process":
      return demoProcess;
    case "stats":
      return demoStats;
    case "tags":
      return demoTags;
    default:
      return [];
  }
}

export function normalizeStatus(value?: string | null): ContentStatus {
  if (value === "published" || value === "archived" || value === "scheduled") return value;
  return "draft";
}

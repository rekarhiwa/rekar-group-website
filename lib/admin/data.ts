import { cache } from "react";
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
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
  { label: "Scheduled", value: "scheduled" },
];

export const PAGE_BLOCK_OPTIONS: AdminFieldOption[] = [
  { label: "Heading", value: "heading" },
  { label: "Text", value: "text" },
  { label: "Rich Text", value: "rich_text" },
  { label: "Image", value: "image" },
  { label: "Image + Text", value: "image_text" },
  { label: "Gallery", value: "gallery" },
  { label: "Button", value: "button" },
  { label: "CTA", value: "cta" },
  { label: "FAQ", value: "faq" },
  { label: "Stats", value: "stats" },
  { label: "Features", value: "features" },
  { label: "Video", value: "video" },
  { label: "Spacer", value: "spacer" },
  { label: "Custom HTML", value: "custom_html" },
];

export const adminSections: Record<string, AdminSectionConfig> = {
  services: {
    key: "services",
    title: "Services",
    description: "Manage service cards, descriptions, status, and ordering.",
    entityLabel: "service",
    table: "services",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "short_description", label: "Short Description", type: "textarea" },
      { name: "full_description", label: "Full Description", type: "richtext" },
      { name: "icon", label: "Icon", type: "text" },
      { name: "cover_image", label: "Cover Image", type: "image" },
      { name: "features", label: "Features", type: "tags" },
      { name: "sort_order", label: "Sort Order", type: "number" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS.slice(0, 3) },
      { name: "seo_title", label: "SEO Title", type: "text" },
      { name: "seo_description", label: "SEO Description", type: "textarea" },
    ],
  },
  projects: {
    key: "projects",
    title: "Projects",
    description: "Manage portfolio items, featured flags, links, and galleries.",
    entityLabel: "project",
    table: "projects",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "category_id", label: "Category", type: "select" },
      { name: "short_description", label: "Short Description", type: "textarea" },
      { name: "full_description", label: "Full Description", type: "richtext" },
      { name: "icon", label: "Icon / Logo", type: "image" },
      { name: "cover_image", label: "Cover Image", type: "image" },
      { name: "client_name", label: "Client Name", type: "text" },
      { name: "completion_date", label: "Completion Date", type: "date" },
      { name: "website_url", label: "Website URL", type: "text" },
      { name: "play_store_url", label: "Play Store URL", type: "text" },
      { name: "app_store_url", label: "App Store URL", type: "text" },
      { name: "github_url", label: "GitHub URL", type: "text" },
      { name: "challenge", label: "Challenge", type: "textarea" },
      { name: "solution", label: "Solution", type: "textarea" },
      { name: "result", label: "Result", type: "textarea" },
      { name: "case_study", label: "Case Study", type: "richtext" },
      { name: "features", label: "Features", type: "tags" },
      { name: "platforms", label: "Platforms", type: "tags" },
      { name: "sort_order", label: "Sort Order", type: "number" },
      { name: "featured", label: "Featured", type: "switch" },
      { name: "show_in_marquee", label: "Show In Marquee", type: "switch" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS.slice(0, 3) },
    ],
  },
  posts: {
    key: "posts",
    title: "Posts",
    description: "Manage blog posts, categories, tags, SEO, and publishing dates.",
    entityLabel: "post",
    table: "posts",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "richtext" },
      { name: "cover_image", label: "Cover Image", type: "image" },
      { name: "category_id", label: "Category", type: "select" },
      { name: "tag_ids", label: "Tags", type: "tags" },
      { name: "featured", label: "Featured", type: "switch" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { name: "published_at", label: "Published At", type: "date" },
      { name: "seo_title", label: "SEO Title", type: "text" },
      { name: "seo_description", label: "SEO Description", type: "textarea" },
      { name: "og_image", label: "OG Image", type: "image" },
    ],
  },
  pages: {
    key: "pages",
    title: "Pages",
    description: "Create dynamic site pages with reusable content blocks.",
    entityLabel: "page",
    table: "pages",
    mode: "detail-collection",
    supportsSoftDelete: true,
    supportsStatus: true,
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS.slice(0, 3) },
      { name: "seo_title", label: "SEO Title", type: "text" },
      { name: "seo_description", label: "SEO Description", type: "textarea" },
      { name: "blocks_json", label: "Blocks", type: "textarea" },
    ],
  },
  clients: {
    key: "clients",
    title: "Clients",
    description: "Manage logos, links, ordering, and visibility.",
    entityLabel: "client",
    table: "clients",
    mode: "inline-collection",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "logo", label: "Logo", type: "image" },
      { name: "website", label: "Website", type: "text" },
      { name: "sort_order", label: "Sort Order", type: "number" },
      { name: "visible", label: "Visible", type: "switch" },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    description: "Manage client quotes, visibility, featured state, and rating.",
    entityLabel: "testimonial",
    table: "testimonials",
    mode: "inline-collection",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "job_title", label: "Job Title", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "avatar", label: "Avatar", type: "image" },
      { name: "testimonial", label: "Testimonial", type: "textarea" },
      { name: "rating", label: "Rating", type: "number" },
      { name: "featured", label: "Featured", type: "switch" },
      { name: "visible", label: "Visible", type: "switch" },
      { name: "sort_order", label: "Sort Order", type: "number" },
    ],
  },
  process: {
    key: "process",
    title: "Process",
    description: "Manage steps in the company workflow section.",
    entityLabel: "process step",
    table: "process_steps",
    mode: "inline-collection",
    fields: [
      { name: "step_number", label: "Step Number", type: "number" },
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Icon", type: "text" },
      { name: "sort_order", label: "Sort Order", type: "number" },
      { name: "visible", label: "Visible", type: "switch" },
    ],
  },
  stats: {
    key: "stats",
    title: "Stats",
    description: "Manage homepage statistics and hero visibility.",
    entityLabel: "stat",
    table: "stats",
    mode: "inline-collection",
    fields: [
      { name: "value", label: "Value", type: "text" },
      { name: "label", label: "Label", type: "text" },
      { name: "icon", label: "Icon", type: "text" },
      { name: "sort_order", label: "Sort Order", type: "number" },
      { name: "visible", label: "Visible", type: "switch" },
      { name: "show_in_hero", label: "Show In Hero", type: "switch" },
    ],
  },
  messages: {
    key: "messages",
    title: "Messages",
    description: "Review contact form submissions and moderation state.",
    entityLabel: "message",
    table: "contact_messages",
    mode: "messages",
  },
  navigation: {
    key: "navigation",
    title: "Navigation",
    description: "Manage menu labels, links, order, and visibility.",
    entityLabel: "navigation item",
    table: "navigation_items",
    mode: "navigation",
  },
  media: {
    key: "media",
    title: "Media",
    description: "Upload files, search media, and copy URLs.",
    entityLabel: "media file",
    table: "media",
    mode: "media",
  },
  settings: {
    key: "settings",
    title: "Settings",
    description: "Manage site, theme, and footer settings.",
    entityLabel: "settings",
    mode: "settings",
  },
  users: {
    key: "users",
    title: "Users",
    description: "Manage admin team access and roles.",
    entityLabel: "user",
    table: "profiles",
    mode: "users",
  },
  activity: {
    key: "activity",
    title: "Activity",
    description: "Review audit logs of admin changes.",
    entityLabel: "activity",
    table: "audit_logs",
    mode: "activity",
  },
  trash: {
    key: "trash",
    title: "Trash",
    description: "Restore soft-deleted projects, posts, and pages.",
    entityLabel: "trash",
    mode: "trash",
  },
  tags: {
    key: "tags",
    title: "Tags",
    description: "Manage reusable blog tags.",
    entityLabel: "tag",
    table: "tags",
    mode: "inline-collection",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
    ],
  },
  categories: {
    key: "categories",
    title: "Categories",
    description: "Manage project and post categories in one place.",
    entityLabel: "category",
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
    entity_label: "Site settings",
    created_at: new Date().toISOString(),
  },
];

async function getDb() {
  return createClient();
}

export function isAdminDemoMode() {
  return !isSupabaseConfigured();
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
  if (!isSupabaseConfigured()) {
    return {
      demoMode: true,
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
  }

  const supabase = await getDb();
  const [
    projects,
    posts,
    messages,
    services,
    pages,
  ] = await Promise.all([
    supabase.from("projects").select("*").order("updated_at", { ascending: false }),
    supabase.from("posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("services").select("*"),
    supabase.from("pages").select("*"),
  ]);

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

  const supabase = await getDb();
  switch (section) {
    case "services": {
      const { data } = await supabase.from("services").select("*").order("sort_order");
      return (data ?? []) as Service[];
    }
    case "projects": {
      const { data } = await supabase
        .from("projects")
        .select("*, category:project_categories(*)")
        .order("sort_order");
      return (data ?? []) as Project[];
    }
    case "posts": {
      const { data } = await supabase
        .from("posts")
        .select("*, category:post_categories(*)")
        .order("updated_at", { ascending: false });
      return (data ?? []) as Post[];
    }
    case "pages": {
      const { data } = await supabase.from("pages").select("*").order("updated_at", { ascending: false });
      return (data ?? []) as Page[];
    }
    case "clients": {
      const { data } = await supabase.from("clients").select("*").order("sort_order");
      return (data ?? []) as Client[];
    }
    case "testimonials": {
      const { data } = await supabase.from("testimonials").select("*").order("sort_order");
      return (data ?? []) as Testimonial[];
    }
    case "process": {
      const { data } = await supabase.from("process_steps").select("*").order("sort_order");
      return (data ?? []) as ProcessStep[];
    }
    case "stats": {
      const { data } = await supabase.from("stats").select("*").order("sort_order");
      return (data ?? []) as StatItem[];
    }
    case "tags": {
      const { data } = await supabase.from("tags").select("*").order("name");
      return (data ?? []) as Tag[];
    }
    default:
      return [];
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

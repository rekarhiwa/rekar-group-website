import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  demoClients,
  demoHero,
  demoNav,
  demoPosts,
  demoProcess,
  demoProjects,
  demoSections,
  demoServices,
  demoSiteSettings,
  demoSocial,
  demoStats,
  demoTestimonials,
  demoThemeSettings,
} from "@/lib/demo-data";
import type {
  Client,
  ContactMessage,
  HeroSettings,
  HomepageSection,
  NavigationItem,
  Page,
  Post,
  ProcessStep,
  Project,
  Service,
  SiteSettings,
  SocialLink,
  StatItem,
  Testimonial,
  ThemeSettings,
} from "@/types/database";

async function db() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return demoSiteSettings;
  try {
    const supabase = await db();
    const { data } = await supabase.from("site_settings").select("*").limit(1).single();
    return data ?? demoSiteSettings;
  } catch {
    return demoSiteSettings;
  }
}

export async function getThemeSettings(): Promise<ThemeSettings> {
  if (!isSupabaseConfigured()) return demoThemeSettings;
  try {
    const supabase = await db();
    const { data } = await supabase.from("theme_settings").select("*").limit(1).single();
    return data ?? demoThemeSettings;
  } catch {
    return demoThemeSettings;
  }
}

export async function getNavigation(): Promise<NavigationItem[]> {
  if (!isSupabaseConfigured()) return demoNav;
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("visible", true)
      .order("sort_order");
    return data?.length ? data : demoNav;
  } catch {
    return demoNav;
  }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (!isSupabaseConfigured()) return demoSocial.filter((s) => s.enabled);
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("enabled", true)
      .order("sort_order");
    return data ?? [];
  } catch {
    return demoSocial.filter((s) => s.enabled);
  }
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured()) return demoSections.filter((s) => s.enabled);
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("homepage_sections")
      .select("*")
      .eq("enabled", true)
      .order("sort_order");
    return data?.length ? data : demoSections.filter((s) => s.enabled);
  } catch {
    return demoSections.filter((s) => s.enabled);
  }
}

export async function getAllHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured()) return demoSections;
  const supabase = await db();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order");
  return data ?? demoSections;
}

export async function getHeroSettings(): Promise<HeroSettings> {
  if (!isSupabaseConfigured()) return demoHero;
  try {
    const supabase = await db();
    const { data } = await supabase.from("hero_settings").select("*").limit(1).single();
    return data ?? demoHero;
  } catch {
    return demoHero;
  }
}

export async function getStats(heroOnly = false): Promise<StatItem[]> {
  if (!isSupabaseConfigured()) {
    return demoStats.filter((s) => s.visible && (!heroOnly || s.show_in_hero));
  }
  try {
    const supabase = await db();
    let q = supabase.from("stats").select("*").eq("visible", true).order("sort_order");
    if (heroOnly) q = q.eq("show_in_hero", true);
    const { data } = await q;
    return data?.length ? data : demoStats;
  } catch {
    return demoStats;
  }
}

export async function getServices(publishedOnly = true): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return publishedOnly
      ? demoServices.filter((s) => s.status === "published")
      : demoServices;
  }
  try {
    const supabase = await db();
    let q = supabase
      .from("services")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order");
    if (publishedOnly) q = q.eq("status", "published");
    const { data } = await q;
    return data?.length ? data : demoServices;
  } catch {
    return demoServices;
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices(true);
  return services.find((s) => s.slug === slug) ?? null;
}

export async function getProjects(opts?: {
  featured?: boolean;
  marquee?: boolean;
  publishedOnly?: boolean;
}): Promise<Project[]> {
  const { getPublishedProjects } = await import("@/services/projects");
  if (opts?.publishedOnly === false) {
    // Admin-style full list not needed on public content layer
    return getPublishedProjects({
      featured: opts?.featured,
      marquee: opts?.marquee,
    });
  }
  return getPublishedProjects({
    featured: opts?.featured,
    marquee: opts?.marquee,
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { getPublishedProjectBySlug } = await import("@/services/projects");
  return getPublishedProjectBySlug(slug);
}

export async function getPosts(opts?: {
  search?: string;
  publishedOnly?: boolean;
  limit?: number;
  categoryId?: string | null;
  featuredOnly?: boolean;
}): Promise<Post[]> {
  if (opts?.publishedOnly !== false) {
    const { getPublicPosts } = await import("@/services/posts");
    return getPublicPosts({
      search: opts?.search,
      limit: opts?.limit,
      categoryId: opts?.categoryId,
      featuredOnly: opts?.featuredOnly,
    });
  }

  if (!isSupabaseConfigured()) {
    let list = [...demoPosts];
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q)
      );
    }
    return opts?.limit ? list.slice(0, opts.limit) : list;
  }
  try {
    const supabase = await db();
    let q = supabase
      .from("posts")
      .select("*, category:post_categories(*)")
      .is("deleted_at", null)
      .order("published_at", { ascending: false });
    if (opts?.search) q = q.ilike("title", `%${opts.search}%`);
    if (opts?.limit) q = q.limit(opts.limit);
    const { data } = await q;
    return (data as Post[])?.length ? (data as Post[]) : demoPosts;
  } catch {
    return demoPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { getPublicPostBySlug } = await import("@/services/posts");
  return getPublicPostBySlug(slug);
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  if (!isSupabaseConfigured()) return demoProcess.filter((p) => p.visible);
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("process_steps")
      .select("*")
      .eq("visible", true)
      .order("sort_order");
    return data?.length ? data : demoProcess;
  } catch {
    return demoProcess;
  }
}

export async function getClients(): Promise<Client[]> {
  if (!isSupabaseConfigured()) return demoClients.filter((c) => c.visible);
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("visible", true)
      .order("sort_order");
    return data?.length ? data : demoClients;
  } catch {
    return demoClients;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return demoTestimonials.filter((t) => t.visible);
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("visible", true)
      .order("sort_order");
    return data?.length ? data : demoTestimonials;
  } catch {
    return demoTestimonials;
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("pages")
      .select("*, blocks:page_blocks(*)")
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .single();
    if (!data) return null;
    const page = data as Page;
    page.blocks = (page.blocks ?? [])
      .filter((b) => b.visible)
      .sort((a, b) => a.sort_order - b.sort_order);
    return page;
  } catch {
    return null;
  }
}

export async function submitContactMessage(
  payload: Omit<
    ContactMessage,
    "id" | "is_read" | "is_important" | "is_archived" | "created_at"
  >
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "سێرڤەر ڕێک نەخراوە. تکایە دواتر هەوڵ بدەرەوە.",
    };
  }
  try {
    const supabase = await db();
    const { error } = await supabase.from("contact_messages").insert({
      ...payload,
      is_read: false,
      is_important: false,
      is_archived: false,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "هەڵەیەک ڕوویدا" };
  }
}

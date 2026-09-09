import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  demoCategories,
  demoProjects,
  demoTechnologies,
} from "@/lib/demo-data";
import type {
  Project,
  ProjectCategory,
  ProjectFeature,
  ProjectImage,
  Technology,
} from "@/types/database";

async function db() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

function mapProject(data: Record<string, unknown>): Project {
  const techRaw = data.technologies as
    | { technology: Technology }[]
    | Technology[]
    | undefined;
  const technologies = Array.isArray(techRaw)
    ? techRaw.map((t) =>
        "technology" in (t as { technology?: Technology })
          ? (t as { technology: Technology }).technology
          : (t as Technology)
      )
    : [];

  return {
    ...(data as unknown as Project),
    features: Array.isArray(data.features) ? (data.features as string[]) : [],
    platforms: Array.isArray(data.platforms) ? (data.platforms as string[]) : [],
    category: (data.category as ProjectCategory) || null,
    technologies,
    images: ((data.images as ProjectImage[]) || []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
    feature_items: ((data.feature_items as ProjectFeature[]) || []).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  };
}

export async function getProjectCategories(activeOnly = true): Promise<ProjectCategory[]> {
  if (!isSupabaseConfigured()) {
    return demoCategories.map((c) => ({ ...c, is_active: true }));
  }
  try {
    const supabase = await db();
    let q = supabase.from("project_categories").select("*").order("sort_order");
    if (activeOnly) q = q.eq("is_active", true);
    const { data } = await q;
    return (data as ProjectCategory[])?.length
      ? (data as ProjectCategory[])
      : demoCategories;
  } catch {
    return demoCategories;
  }
}

export async function getPublishedProjects(opts?: {
  categorySlug?: string;
  search?: string;
  sort?: "newest" | "oldest" | "name";
  featured?: boolean;
  marquee?: boolean;
  limit?: number;
}): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    let list = demoProjects.filter((p) => p.status === "published" && !p.deleted_at);
    if (opts?.featured) list = list.filter((p) => p.featured);
    if (opts?.marquee) list = list.filter((p) => p.show_in_marquee);
    if (opts?.categorySlug) {
      list = list.filter((p) => p.category?.slug === opts.categorySlug);
    }
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q)
      );
    }
    if (opts?.sort === "oldest") list = [...list].reverse();
    if (opts?.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return opts?.limit ? list.slice(0, opts.limit) : list;
  }

  try {
    const supabase = await db();
    let q = supabase
      .from("projects")
      .select("*, category:project_categories(*), technologies:project_technologies(technology:technologies(*))")
      .eq("status", "published")
      .is("deleted_at", null);

    if (opts?.featured) q = q.eq("featured", true);
    if (opts?.marquee) q = q.eq("show_in_marquee", true);

    if (opts?.sort === "oldest") q = q.order("created_at", { ascending: true });
    else if (opts?.sort === "name") q = q.order("name", { ascending: true });
    else if (opts?.featured || opts?.marquee) q = q.order("sort_order", { ascending: true });
    else q = q.order("sort_order", { ascending: true }).order("created_at", { ascending: false });

    if (opts?.search) q = q.or(`name.ilike.%${opts.search}%,short_description.ilike.%${opts.search}%`);
    if (opts?.limit) q = q.limit(opts.limit);

    const { data } = await q;
    let list = ((data as Record<string, unknown>[]) ?? []).map(mapProject);

    if (opts?.categorySlug) {
      list = list.filter((p) => p.category?.slug === opts.categorySlug);
    }

    return list.length ? list : demoProjects.filter((p) => p.status === "published");
  } catch {
    return demoProjects.filter((p) => p.status === "published");
  }
}

export async function getFeaturedProjects() {
  return getPublishedProjects({ featured: true, sort: "newest" });
}

export async function getMarqueeProjects() {
  return getPublishedProjects({ marquee: true });
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return demoProjects.find((p) => p.slug === slug && p.status === "published") ?? null;
  }
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("projects")
      .select(
        "*, category:project_categories(*), images:project_images(*), technologies:project_technologies(technology:technologies(*)), feature_items:project_features(*)"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();
    if (!data) {
      return (
        demoProjects.find(
          (p) => p.slug === slug && p.status === "published" && !p.deleted_at
        ) ?? null
      );
    }
    return mapProject(data as Record<string, unknown>);
  } catch {
    return (
      demoProjects.find(
        (p) => p.slug === slug && p.status === "published" && !p.deleted_at
      ) ?? null
    );
  }
}

export async function getRelatedProjects(project: Project, limit = 3): Promise<Project[]> {
  const all = await getPublishedProjects({ limit: 40 });
  return all
    .filter((p) => p.id !== project.id)
    .filter((p) => !project.category_id || p.category_id === project.category_id)
    .slice(0, limit);
}

export async function getAdminProjects(filters: {
  search?: string;
  status?: string;
  categoryId?: string;
  featured?: string;
  marquee?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: Project[]; total: number }> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  if (!isSupabaseConfigured()) {
    let list = [...demoProjects];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (filters.status && filters.status !== "all") {
      list = list.filter((p) => p.status === filters.status);
    }
    const total = list.length;
    const start = (page - 1) * pageSize;
    return { items: list.slice(start, start + pageSize), total };
  }

  const supabase = await db();
  let q = supabase
    .from("projects")
    .select("*, category:project_categories(*)", { count: "exact" })
    .is("deleted_at", null);

  if (filters.search) q = q.ilike("name", `%${filters.search}%`);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.categoryId) q = q.eq("category_id", filters.categoryId);
  if (filters.featured === "true") q = q.eq("featured", true);
  if (filters.featured === "false") q = q.eq("featured", false);
  if (filters.marquee === "true") q = q.eq("show_in_marquee", true);
  if (filters.marquee === "false") q = q.eq("show_in_marquee", false);

  const sort = filters.sort || "sort_order";
  if (sort === "name") q = q.order("name");
  else if (sort === "updated") q = q.order("updated_at", { ascending: false });
  else q = q.order("sort_order").order("updated_at", { ascending: false });

  const from = (page - 1) * pageSize;
  const { data, count, error } = await q.range(from, from + pageSize - 1);
  if (error) throw new Error(error.message);
  return {
    items: ((data as Record<string, unknown>[]) ?? []).map(mapProject),
    total: count ?? 0,
  };
}

export async function getAdminProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return demoProjects.find((p) => p.id === id) ?? null;
  }
  const supabase = await db();
  const { data } = await supabase
    .from("projects")
    .select(
      "*, category:project_categories(*), images:project_images(*), technologies:project_technologies(technology:technologies(*)), feature_items:project_features(*)"
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  return mapProject(data as Record<string, unknown>);
}

export async function getProjectFormOptions() {
  if (!isSupabaseConfigured()) {
    return {
      categories: demoCategories as ProjectCategory[],
      technologies: demoTechnologies as Technology[],
    };
  }
  const supabase = await db();
  const [{ data: categories }, { data: technologies }] = await Promise.all([
    supabase.from("project_categories").select("*").order("sort_order"),
    supabase.from("technologies").select("*").order("name"),
  ]);
  return {
    categories: (categories as ProjectCategory[]) ?? [],
    technologies: (technologies as Technology[]) ?? [],
  };
}

export async function getTrashedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await db();
  const { data } = await supabase
    .from("projects")
    .select("*, category:project_categories(*)")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });
  return ((data as Record<string, unknown>[]) ?? []).map(mapProject);
}

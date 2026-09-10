import { isSupabaseConfigured } from "@/lib/supabase/config";
import { demoPosts } from "@/lib/demo-data";
import { isPostPubliclyVisible } from "@/lib/posts/utils";
import { publishDueScheduledPosts } from "@/lib/posts/publish-due";
import type { Post, PostCategory, Profile, Tag } from "@/types/database";

async function db() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

function mapPost(data: Record<string, unknown>): Post {
  const tagsRaw = data.tags as { tag: Tag }[] | Tag[] | undefined;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map((t) => ("tag" in (t as { tag?: Tag }) ? (t as { tag: Tag }).tag : (t as Tag)))
    : [];
  return {
    ...(data as unknown as Post),
    tags,
    category: (data.category as PostCategory) || null,
    author: (data.author as Profile) || null,
  };
}

export async function ensureScheduledPostsPublished() {
  await publishDueScheduledPosts();
}

export async function getPublicPosts(opts?: {
  search?: string;
  limit?: number;
  categoryId?: string | null;
  featuredOnly?: boolean;
}): Promise<Post[]> {
  await ensureScheduledPostsPublished();

  if (!isSupabaseConfigured()) {
    let list = demoPosts.filter((p) => isPostPubliclyVisible(p));
    if (opts?.featuredOnly) list = list.filter((p) => p.featured);
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q)
      );
    }
    return opts?.limit ? list.slice(0, opts.limit) : list;
  }

  try {
    const supabase = await db();
    let q = supabase
      .from("posts")
      .select("*, category:post_categories(*), author:profiles(*)")
      .is("deleted_at", null)
      .order("published_at", { ascending: false });

    const { data, error } = await q;
    const { isMissingRelationError } = await import("@/lib/supabase/schema");
    if (error && isMissingRelationError(error.message)) {
      return demoPosts.filter((p) => isPostPubliclyVisible(p)).slice(0, opts?.limit);
    }
    let list = ((data as Record<string, unknown>[]) ?? []).map(mapPost).filter(isPostPubliclyVisible);

    if (opts?.featuredOnly) list = list.filter((p) => p.featured);
    if (opts?.categoryId) list = list.filter((p) => p.category_id === opts.categoryId);
    if (opts?.search) {
      const s = opts.search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(s) || p.excerpt?.toLowerCase().includes(s)
      );
    }
    const result = opts?.limit ? list.slice(0, opts.limit) : list;
    return result.length ? result : demoPosts.filter((p) => isPostPubliclyVisible(p)).slice(0, opts?.limit);
  } catch {
    return demoPosts.filter((p) => isPostPubliclyVisible(p)).slice(0, opts?.limit);
  }
}

export async function getPublicPostBySlug(slug: string): Promise<Post | null> {
  await ensureScheduledPostsPublished();

  if (!isSupabaseConfigured()) {
    const post = demoPosts.find((p) => p.slug === slug);
    return post && isPostPubliclyVisible(post) ? post : null;
  }

  try {
    const supabase = await db();
    const { data } = await supabase
      .from("posts")
      .select(
        "*, category:post_categories(*), author:profiles(*), tags:post_tags(tag:tags(*))"
      )
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();

    if (!data) return null;
    const post = mapPost(data as Record<string, unknown>);
    return isPostPubliclyVisible(post) ? post : null;
  } catch {
    return null;
  }
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const all = await getPublicPosts({ limit: 50 });
  const tagIds = new Set((post.tags ?? []).map((t) => t.id));

  const scored = all
    .filter((p) => p.id !== post.id)
    .map((p) => {
      let score = 0;
      if (post.category_id && p.category_id === post.category_id) score += 3;
      for (const tag of p.tags ?? []) {
        if (tagIds.has(tag.id)) score += 1;
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const related = scored.map((x) => x.p).slice(0, limit);
  if (related.length >= limit) return related;

  const fillers = all
    .filter((p) => p.id !== post.id && !related.some((r) => r.id === p.id))
    .slice(0, limit - related.length);
  return [...related, ...fillers];
}

export async function getAdminPosts(filters: {
  search?: string;
  status?: string;
  categoryId?: string;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: Post[]; total: number }> {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  if (!isSupabaseConfigured()) {
    let list = demoPosts.map((p) => ({ ...p, view_count: p.view_count ?? 0 }));
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
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
    .from("posts")
    .select("*, category:post_categories(*), author:profiles(*)", { count: "exact" })
    .is("deleted_at", null);

  if (filters.search) q = q.ilike("title", `%${filters.search}%`);
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.categoryId) q = q.eq("category_id", filters.categoryId);
  if (filters.from) q = q.gte("published_at", filters.from);
  if (filters.to) q = q.lte("published_at", filters.to);

  const sort = filters.sort || "updated_at_desc";
  if (sort === "title_asc") q = q.order("title", { ascending: true });
  else if (sort === "views_desc") q = q.order("view_count", { ascending: false });
  else if (sort === "published_at_desc") q = q.order("published_at", { ascending: false });
  else q = q.order("updated_at", { ascending: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await q.range(from, to);
  if (error) {
    const { isMissingRelationError } = await import("@/lib/supabase/schema");
    if (isMissingRelationError(error.message)) {
      let list = demoPosts.map((p) => ({ ...p, view_count: p.view_count ?? 0 }));
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(s));
      }
      if (filters.status && filters.status !== "all") {
        list = list.filter((p) => p.status === filters.status);
      }
      const total = list.length;
      const start = (page - 1) * pageSize;
      return { items: list.slice(start, start + pageSize), total };
    }
    throw new Error(error.message);
  }

  return {
    items: ((data as Record<string, unknown>[]) ?? []).map(mapPost),
    total: count ?? 0,
  };
}

export async function getAdminPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) {
    return demoPosts.find((p) => p.id === id) ?? null;
  }
  try {
    const supabase = await db();
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*, category:post_categories(*), author:profiles(*), tags:post_tags(tag:tags(*))"
      )
      .eq("id", id)
      .maybeSingle();
    const { isMissingRelationError } = await import("@/lib/supabase/schema");
    if (error && isMissingRelationError(error.message)) {
      return demoPosts.find((p) => p.id === id) ?? null;
    }
    if (!data) return null;
    return mapPost(data as Record<string, unknown>);
  } catch {
    return demoPosts.find((p) => p.id === id) ?? null;
  }
}

export async function getPostFormOptions() {
  if (!isSupabaseConfigured()) {
    return {
      categories: [] as PostCategory[],
      tags: [] as Tag[],
      authors: [] as Profile[],
    };
  }
  try {
    const supabase = await db();
    const [{ data: categories, error: cErr }, { data: tags, error: tErr }, { data: authors }] =
      await Promise.all([
        supabase.from("post_categories").select("*").order("name"),
        supabase.from("tags").select("*").order("name"),
        supabase.from("profiles").select("*").eq("is_active", true).order("full_name"),
      ]);
    const { isMissingRelationError } = await import("@/lib/supabase/schema");
    if (isMissingRelationError(cErr?.message) || isMissingRelationError(tErr?.message)) {
      return {
        categories: [] as PostCategory[],
        tags: [] as Tag[],
        authors: [] as Profile[],
      };
    }
    return {
      categories: (categories as PostCategory[]) ?? [],
      tags: (tags as Tag[]) ?? [],
      authors: (authors as Profile[]) ?? [],
    };
  } catch {
    return {
      categories: [] as PostCategory[],
      tags: [] as Tag[],
      authors: [] as Profile[],
    };
  }
}

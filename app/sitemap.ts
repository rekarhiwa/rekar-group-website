import type { MetadataRoute } from "next";
import { getPosts, getProjects, getServices, getSiteSettings } from "@/services/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    settings.website_url ||
    "https://www.rekar.group";

  const staticRoutes = ["", "/services", "/projects", "/insights", "/about", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const [projects, posts, services] = await Promise.all([
    getProjects(),
    getPosts(),
    getServices(),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${base}/insights/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...services.map((s) => ({
      url: `${base}/services`,
      lastModified: new Date(s.updated_at || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: pages } = await supabase
        .from("pages")
        .select("slug, updated_at")
        .eq("status", "published")
        .is("deleted_at", null);
      for (const page of pages ?? []) {
        dynamicRoutes.push({
          url: `${base}/${page.slug}`,
          lastModified: new Date(page.updated_at || Date.now()),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    } catch {
      // ignore
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}

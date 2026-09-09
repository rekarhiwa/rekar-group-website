import { Suspense } from "react";
import { ProjectsAdminTable } from "@/components/admin/projects-admin-table";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getAdminProjects, getProjectFormOptions } from "@/services/projects";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const p = await searchParams; const page = Math.max(1, Number(p.page) || 1); const pageSize = 20;
  const [result, options] = await Promise.all([getAdminProjects({ search: typeof p.search === "string" ? p.search : undefined, status: typeof p.status === "string" ? p.status : undefined, categoryId: typeof p.categoryId === "string" ? p.categoryId : undefined, featured: typeof p.featured === "string" ? p.featured : undefined, marquee: typeof p.marquee === "string" ? p.marquee : undefined, sort: typeof p.sort === "string" ? p.sort : undefined, page, pageSize }), getProjectFormOptions()]);
  return <div className="space-y-4">{isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}<Suspense fallback={<p className="text-muted">بارکردن...</p>}><ProjectsAdminTable items={result.items} total={result.total} categories={options.categories} page={page} pageSize={pageSize} /></Suspense></div>;
}

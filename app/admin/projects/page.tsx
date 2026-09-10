import { Suspense } from "react";
import { AdminSectionTabs } from "@/components/admin/admin-section-tabs";
import { ProjectCategoriesManager } from "@/components/admin/project-categories-manager";
import { ProjectTechnologiesManager } from "@/components/admin/project-technologies-manager";
import { ProjectsAdminTable } from "@/components/admin/projects-admin-table";
import { ProjectsTrashTable } from "@/components/admin/projects-trash-table";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import {
  getAdminProjects,
  getProjectCategories,
  getProjectFormOptions,
  getTrashedProjects,
} from "@/services/projects";

const tabs = [
  { id: "list", label: "پڕۆژەکان" },
  { id: "categories", label: "پۆلەکان" },
  { id: "technologies", label: "تەکنەلۆژیا" },
  { id: "trash", label: "زبڵ" },
];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const tab = typeof p.tab === "string" ? p.tab : "list";
  const page = Math.max(1, Number(p.page) || 1);
  const pageSize = 20;

  const [result, options, categories, trashed] = await Promise.all([
    tab === "list"
      ? getAdminProjects({
          search: typeof p.search === "string" ? p.search : undefined,
          status: typeof p.status === "string" ? p.status : undefined,
          categoryId: typeof p.categoryId === "string" ? p.categoryId : undefined,
          featured: typeof p.featured === "string" ? p.featured : undefined,
          marquee: typeof p.marquee === "string" ? p.marquee : undefined,
          sort: typeof p.sort === "string" ? p.sort : undefined,
          page,
          pageSize,
        })
      : Promise.resolve({ items: [], total: 0 }),
    getProjectFormOptions(),
    tab === "categories" ? getProjectCategories(false) : Promise.resolve([]),
    tab === "trash" ? getTrashedProjects() : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-4">
      {isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}
      <Suspense fallback={null}>
        <AdminSectionTabs tabs={tabs} basePath="/admin/projects" />
      </Suspense>

      {tab === "list" ? (
        <Suspense fallback={<p className="text-muted">بارکردن...</p>}>
          <ProjectsAdminTable
            items={result.items}
            total={result.total}
            categories={options.categories}
            page={page}
            pageSize={pageSize}
          />
        </Suspense>
      ) : null}

      {tab === "categories" ? (
        <ProjectCategoriesManager categories={categories.length ? categories : options.categories} />
      ) : null}

      {tab === "technologies" ? (
        <ProjectTechnologiesManager technologies={options.technologies} />
      ) : null}

      {tab === "trash" ? <ProjectsTrashTable items={trashed} /> : null}
    </div>
  );
}

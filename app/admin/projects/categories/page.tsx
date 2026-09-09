import { ProjectCategoriesManager } from "@/components/admin/project-categories-manager";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getProjectCategories } from "@/services/projects";

export default async function ProjectCategoriesPage() {
  const categories = await getProjectCategories(false);
  return <div className="space-y-4">{isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}<ProjectCategoriesManager categories={categories} /></div>;
}

import { ProjectsTrashTable } from "@/components/admin/projects-trash-table";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getTrashedProjects } from "@/services/projects";

export default async function ProjectsTrashPage() {
  const items = await getTrashedProjects();
  return <div className="space-y-4">{isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}<ProjectsTrashTable items={items} /></div>;
}

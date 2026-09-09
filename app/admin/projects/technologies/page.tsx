import { ProjectTechnologiesManager } from "@/components/admin/project-technologies-manager";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getProjectFormOptions } from "@/services/projects";

export default async function ProjectTechnologiesPage() {
  const { technologies } = await getProjectFormOptions();
  return <div className="space-y-4">{isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}<ProjectTechnologiesManager technologies={technologies} /></div>;
}

import { ProjectEditor } from "@/components/admin/project-editor";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getProjectFormOptions } from "@/services/projects";

export default async function NewProjectPage() {
  const options = await getProjectFormOptions();
  return <div className="space-y-4">{isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}<ProjectEditor categories={options.categories} technologies={options.technologies} /></div>;
}

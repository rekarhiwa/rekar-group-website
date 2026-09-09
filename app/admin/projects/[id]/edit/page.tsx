import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/project-editor";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getAdminProjectById, getProjectFormOptions } from "@/services/projects";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, options] = await Promise.all([getAdminProjectById(id), getProjectFormOptions()]);
  if (!project) notFound();
  return <div className="space-y-4">{isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}<ProjectEditor project={project} categories={options.categories} technologies={options.technologies} /></div>;
}

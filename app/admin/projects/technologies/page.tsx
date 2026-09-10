import { redirect } from "next/navigation";

export default function ProjectTechnologiesRedirect() {
  redirect("/admin/projects?tab=technologies");
}

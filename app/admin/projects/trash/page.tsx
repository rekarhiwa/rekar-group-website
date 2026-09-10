import { redirect } from "next/navigation";

export default function ProjectsTrashRedirect() {
  redirect("/admin/projects?tab=trash");
}

import { redirect } from "next/navigation";

export default function ProjectCategoriesRedirect() {
  redirect("/admin/projects?tab=categories");
}

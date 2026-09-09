export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "switch"
  | "image"
  | "tags"
  | "richtext"
  | "hidden";

export interface AdminFieldOption {
  label: string;
  value: string;
}

export interface AdminField {
  name: string;
  label: string;
  type: AdminFieldType;
  placeholder?: string;
  options?: AdminFieldOption[];
  description?: string;
}

export const adminSidebarLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/projects/categories", label: "Project Categories" },
  { href: "/admin/projects/technologies", label: "Project Technologies" },
  { href: "/admin/projects/trash", label: "Projects Trash" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/process", label: "Process" },
  { href: "/admin/stats", label: "Stats" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/activity", label: "Activity" },
  { href: "/admin/trash", label: "Trash" },
];

export function getAdminSetupMessage() {
  return "CMS گۆڕانکارییەکان پێویستیان بە ڕێکخستنی Supabase هەیە. UI ئێستا لە دۆخی demo / read-only دایە.";
}

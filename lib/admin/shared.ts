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

export type AdminSidebarLink = {
  href: string;
  label: string;
};

export type AdminSidebarGroup = {
  id: "site" | "posts";
  label: string;
  links: AdminSidebarLink[];
};

/** Slim admin nav — website and posts are separate categories */
export const adminSidebarGroups: AdminSidebarGroup[] = [
  {
    id: "site",
    label: "وێبسایت",
    links: [
      { href: "/admin", label: "داشبۆرد" },
      { href: "/admin/home", label: "ماڵەوە" },
      { href: "/admin/projects", label: "پڕۆژەکان" },
      { href: "/admin/services", label: "خزمەتگوزارییەکان" },
      { href: "/admin/content", label: "ناوەڕۆک" },
      { href: "/admin/pages", label: "پەڕەکان" },
      { href: "/admin/messages", label: "نامەکان" },
      { href: "/admin/settings", label: "ڕێکخستنەکان" },
    ],
  },
  {
    id: "posts",
    label: "پۆستەکان",
    links: [
      { href: "/admin/posts", label: "هەموو پۆستەکان" },
      { href: "/admin/posts?tab=categories", label: "پۆلەکان" },
      { href: "/admin/posts?tab=tags", label: "تاگەکان" },
    ],
  },
];

export const adminSidebarLinks = adminSidebarGroups.flatMap((group) => group.links);

export function getAdminSetupMessage() {
  return "گۆڕانکارییەکانی CMS پێویستیان بە ڕێکخستنی Supabase هەیە. ئێستا تەنها لە دۆخی دیمۆ / خوێندنەوەدایە.";
}

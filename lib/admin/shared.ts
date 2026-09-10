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

/** Slim admin nav — related tools live as tabs inside each hub page */
export const adminSidebarLinks = [
  { href: "/admin", label: "داشبۆرد" },
  { href: "/admin/home", label: "ماڵەوە" },
  { href: "/admin/projects", label: "پڕۆژەکان" },
  { href: "/admin/services", label: "خزمەتگوزارییەکان" },
  { href: "/admin/posts", label: "پۆستەکان" },
  { href: "/admin/content", label: "ناوەڕۆک" },
  { href: "/admin/pages", label: "پەڕەکان" },
  { href: "/admin/messages", label: "نامەکان" },
  { href: "/admin/settings", label: "ڕێکخستنەکان" },
];

export function getAdminSetupMessage() {
  return "گۆڕانکارییەکانی CMS پێویستیان بە ڕێکخستنی Supabase هەیە. ئێستا تەنها لە دۆخی دیمۆ / خوێندنەوەدایە.";
}

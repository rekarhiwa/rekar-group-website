"use server";

import { z } from "zod";
import { writeAuditLog } from "@/lib/auth/admin";
import { withMutationGuard } from "@/app/admin/actions/_shared";
import { revalidatePath } from "next/cache";

const siteSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_name_en: z.string().min(1, "English company name is required"),
  tagline: z.string().optional().default(""),
  logo_url: z.string().optional().default(""),
  logo_mark_url: z.string().optional().default(""),
  favicon_url: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  address: z.string().optional().default(""),
  whatsapp: z.string().optional().default(""),
  website_url: z.string().optional().default(""),
  default_seo_title: z.string().optional().default(""),
  default_seo_description: z.string().optional().default(""),
  og_image_url: z.string().optional().default(""),
  google_maps_url: z.string().optional().default(""),
  footer_description: z.string().optional().default(""),
  copyright_text: z.string().optional().default(""),
});

const themeSchema = z.object({
  primary_color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Hex color required"),
  secondary_color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Hex color required"),
  accent_color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Hex color required"),
  background_color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Hex color required"),
});

export async function saveSiteSettingsAction(formData: FormData) {
  const guard = await withMutationGuard("admin");
  if (!guard.ok) return guard.state;

  const parsed = siteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error" as const, message: parsed.error.issues[0]?.message ?? "هەڵەیەک ڕوویدا" };
  }

  const { data: existing } = await guard.supabase.from("site_settings").select("id").limit(1).single();
  if (existing?.id) {
    const { error } = await guard.supabase.from("site_settings").update(parsed.data).eq("id", existing.id);
    if (error) return { status: "error" as const, message: error.message };
  } else {
    const { error } = await guard.supabase.from("site_settings").insert(parsed.data);
    if (error) return { status: "error" as const, message: error.message };
  }

  await writeAuditLog({ action: "updated", entity: "settings", entity_label: "site_settings" });
  revalidatePath("/admin/settings");
  revalidatePath("/admin/settings/footer");
  revalidatePath("/");
  return { status: "success" as const, message: "پاشەکەوت کرا" };
}

export async function saveThemeSettingsAction(formData: FormData) {
  const guard = await withMutationGuard("admin");
  if (!guard.ok) return guard.state;

  const parsed = themeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error" as const, message: parsed.error.issues[0]?.message ?? "هەڵەیەک ڕوویدا" };
  }

  const { data: existing } = await guard.supabase.from("theme_settings").select("id").limit(1).single();
  if (existing?.id) {
    const { error } = await guard.supabase.from("theme_settings").update(parsed.data).eq("id", existing.id);
    if (error) return { status: "error" as const, message: error.message };
  } else {
    const { error } = await guard.supabase.from("theme_settings").insert(parsed.data);
    if (error) return { status: "error" as const, message: error.message };
  }

  await writeAuditLog({ action: "updated", entity: "settings", entity_label: "theme_settings" });
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { status: "success" as const, message: "پاشەکەوت کرا" };
}

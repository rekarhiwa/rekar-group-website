"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  initialActionState,
  type ActionState,
  parseBoolean,
  withMutationGuard,
} from "@/app/admin/actions/_shared";

const heroSchema = z.object({
  badge: z.string().optional().default(""),
  heading: z.string().min(1, "سەردێڕ پێویستە"),
  highlighted_heading: z.string().optional().default(""),
  description: z.string().optional().default(""),
  primary_button_label: z.string().optional().default(""),
  primary_button_url: z.string().optional().default(""),
  secondary_button_label: z.string().optional().default(""),
  secondary_button_url: z.string().optional().default(""),
  visual_enabled: z.string().optional().default(""),
  stats_enabled: z.string().optional().default(""),
});

export async function saveHomepageSectionsAction(
  sections: {
    id: string;
    enabled: boolean;
    sort_order: number;
    heading?: string | null;
    subtitle?: string | null;
    settings?: Record<string, unknown>;
  }[]
): Promise<ActionState> {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  const updates = sections.map((section) =>
    guard.supabase
      .from("homepage_sections")
      .update({
        enabled: section.enabled,
        sort_order: section.sort_order,
        heading: section.heading ?? null,
        subtitle: section.subtitle ?? null,
        settings: section.settings ?? {},
      })
      .eq("id", section.id)
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { status: "error" as const, message: failed.error.message };
  }

  await writeAuditLog({ action: "reordered", entity: "homepage_sections" });
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { status: "success", message: "پاشەکەوت کرا" };
}

export async function saveHeroSettingsAction(
  state: ActionState = initialActionState,
  formData: FormData
): Promise<ActionState> {
  void state;
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  const parsed = heroSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      status: "error" as const,
      message: parsed.error.issues[0]?.message ?? "هەڵەیەک ڕوویدا",
    };
  }

  const payload = {
    ...parsed.data,
    visual_enabled: parseBoolean(formData.get("visual_enabled")),
    stats_enabled: parseBoolean(formData.get("stats_enabled")),
  };

  const { data: existing } = await guard.supabase.from("hero_settings").select("id").limit(1).single();
  if (existing?.id) {
    const { error } = await guard.supabase.from("hero_settings").update(payload).eq("id", existing.id);
    if (error) return { status: "error", message: error.message };
  } else {
    const { error } = await guard.supabase.from("hero_settings").insert(payload);
    if (error) return { status: "error", message: error.message };
  }

  await writeAuditLog({ action: "updated", entity: "hero_settings", entity_label: payload.heading });
  revalidatePath("/admin/home");
  revalidatePath("/");
  return { status: "success", message: "پاشەکەوت کرا" };
}

export async function ensureHomepageActionReady() {
  if (!isSupabaseConfigured()) return false;
  await createClient();
  return true;
}

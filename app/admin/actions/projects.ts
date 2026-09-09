"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type ActionState,
  hardDeleteRecord,
  initialActionState,
  parseBoolean,
  parseNumber,
  parseTags,
  softDeleteRecord,
  withMutationGuard,
  getActionMessage,
} from "@/app/admin/actions/_shared";
import { writeAuditLog } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils";
import { normalizeStatus } from "@/lib/admin/data";

const optionalUrl = z
  .string()
  .optional()
  .default("")
  .refine((v) => !v || /^https?:\/\//i.test(v) || v.startsWith("/"), {
    message: "URL دەبێت بە http یان https دەست پێ بکات",
  });

const projectSchema = z.object({
  name: z.string().min(1, "ناوی پڕۆژە پێویستە").max(160),
  slug: z.string().optional().default(""),
  category_id: z.string().optional().default(""),
  subtitle: z.string().optional().default(""),
  short_description: z.string().optional().default("").refine((v) => v.length <= 500, {
    message: "کورتە وەسف زۆر درێژە",
  }),
  full_description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  cover_image: z.string().optional().default(""),
  featured: z.string().optional().default(""),
  show_in_marquee: z.string().optional().default(""),
  status: z.string().optional().default("draft"),
  client_name: z.string().optional().default(""),
  completion_date: z.string().optional().default(""),
  website_url: optionalUrl,
  play_store_url: optionalUrl,
  app_store_url: optionalUrl,
  github_url: optionalUrl,
  challenge: z.string().optional().default(""),
  solution: z.string().optional().default(""),
  result: z.string().optional().default(""),
  case_study: z.string().optional().default(""),
  platforms: z.string().optional().default(""),
  technology_ids: z.string().optional().default(""),
  features_json: z.string().optional().default("[]"),
  gallery_json: z.string().optional().default("[]"),
  seo_title: z.string().optional().default(""),
  seo_description: z.string().optional().default(""),
  og_image: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
});

function emptyToNull(value: string | null | undefined) {
  const v = (value ?? "").trim();
  return v ? v : null;
}

function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

async function syncTechnologies(supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>, projectId: string, raw: string) {
  await supabase.from("project_technologies").delete().eq("project_id", projectId);
  const ids = raw
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (!ids.length) return;
  await supabase.from("project_technologies").insert(
    ids.map((technology_id) => ({ project_id: projectId, technology_id }))
  );
}

async function syncFeatures(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  projectId: string,
  featuresJson: string
) {
  const features = parseJsonArray<{
    id?: string;
    title: string;
    description?: string;
    icon?: string;
    sort_order?: number;
  }>(featuresJson, []);

  await supabase.from("project_features").delete().eq("project_id", projectId);

  const rows = features
    .filter((f) => f.title?.trim())
    .map((f, index) => ({
      project_id: projectId,
      title: f.title.trim(),
      description: emptyToNull(f.description),
      icon: emptyToNull(f.icon),
      sort_order: f.sort_order ?? index,
    }));

  if (rows.length) {
    await supabase.from("project_features").insert(rows);
  }

  // Keep legacy text[] in sync for listing fallbacks
  return rows.map((r) => r.title);
}

async function syncGallery(
  supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>,
  projectId: string,
  galleryJson: string
) {
  const images = parseJsonArray<{
    id?: string;
    image_url: string;
    alt_text?: string;
    caption?: string;
    sort_order?: number;
  }>(galleryJson, []);

  await supabase.from("project_images").delete().eq("project_id", projectId);

  const rows = images
    .filter((img) => img.image_url?.trim())
    .map((img, index) => ({
      project_id: projectId,
      image_url: img.image_url.trim(),
      alt_text: emptyToNull(img.alt_text),
      caption: emptyToNull(img.caption),
      sort_order: img.sort_order ?? index,
    }));

  if (rows.length) {
    await supabase.from("project_images").insert(rows);
  }
}

function resolveStatus(intent: string, statusInput: string) {
  if (intent === "publish") return "published";
  if (intent === "archive") return "archived";
  if (intent === "save_draft") return "draft";
  return normalizeStatus(statusInput || "draft");
}

function revalidateProjectPaths(slug?: string | null) {
  const paths = ["/admin/projects", "/admin/projects/trash", "/admin", "/", "/projects"];
  if (slug) paths.push(`/projects/${slug}`);
  for (const path of paths) revalidatePath(path);
}

export async function saveProjectAction(
  prevState: ActionState = initialActionState,
  formData: FormData
): Promise<ActionState & { id?: string; slug?: string }> {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "save");
  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "هەڵەیەک ڕوویدا" };
  }

  try {
    const input = parsed.data;
    const status = resolveStatus(intent, input.status);
    const slug = slugify(input.slug || input.name);

    const featureTitles = await (async () => {
      // Will sync after we have id; compute titles for payload now
      const features = parseJsonArray<{ title: string }>(input.features_json, []);
      return features.map((f) => f.title).filter(Boolean);
    })();

    const payload = {
      name: input.name.trim(),
      slug,
      category_id: emptyToNull(input.category_id),
      subtitle: emptyToNull(input.subtitle),
      short_description: emptyToNull(input.short_description),
      full_description: emptyToNull(input.full_description),
      icon: emptyToNull(input.icon),
      cover_image: emptyToNull(input.cover_image),
      featured: parseBoolean(formData.get("featured")),
      show_in_marquee: parseBoolean(formData.get("show_in_marquee")),
      status,
      client_name: emptyToNull(input.client_name),
      completion_date: emptyToNull(input.completion_date),
      website_url: emptyToNull(input.website_url),
      play_store_url: emptyToNull(input.play_store_url),
      app_store_url: emptyToNull(input.app_store_url),
      github_url: emptyToNull(input.github_url),
      challenge: emptyToNull(input.challenge),
      solution: emptyToNull(input.solution),
      result: emptyToNull(input.result),
      case_study: emptyToNull(input.case_study),
      platforms: parseTags(formData.get("platforms")),
      features: featureTitles,
      seo_title: emptyToNull(input.seo_title),
      seo_description: emptyToNull(input.seo_description),
      og_image: emptyToNull(input.og_image),
      sort_order: parseNumber(formData.get("sort_order")),
    };

    let recordId = id;
    if (id) {
      const { error } = await guard.supabase.from("projects").update(payload).eq("id", id);
      if (error) {
        if (error.code === "23505") return { status: "error", message: "ئەم slug ـە پێشتر بەکارهاتووە" };
        return { status: "error", message: error.message };
      }
    } else {
      const { data, error } = await guard.supabase
        .from("projects")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        if (error.code === "23505") return { status: "error", message: "ئەم slug ـە پێشتر بەکارهاتووە" };
        return { status: "error", message: error.message };
      }
      recordId = String(data.id);
    }

    await syncTechnologies(guard.supabase, recordId, input.technology_ids);
    const syncedTitles = await syncFeatures(guard.supabase, recordId, input.features_json);
    if (syncedTitles.length !== payload.features.length) {
      await guard.supabase.from("projects").update({ features: syncedTitles }).eq("id", recordId);
    }
    await syncGallery(guard.supabase, recordId, input.gallery_json);

    await writeAuditLog({
      action: intent === "publish" ? "published" : id ? "updated" : "created",
      entity: "projects",
      entity_id: recordId,
      entity_label: payload.name,
    });

    revalidateProjectPaths(slug);

    return {
      status: "success",
      message:
        intent === "publish"
          ? "پڕۆژەکە بڵاوکرایەوە"
          : intent === "archive"
            ? "پڕۆژەکە ئەرشیف کرا"
            : "پڕۆژەکە پاشەکەوت کرا",
      id: recordId,
      slug,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "هەڵەیەک ڕوویدا",
    };
  }
}

export async function trashProjectAction(id: string) {
  const result = await softDeleteRecord({
    table: "projects",
    section: "projects",
    id,
    publicPaths: ["/", "/projects"],
  });
  revalidatePath("/admin/projects/trash");
  return {
    ...result,
    message: result.status === "success" ? "پڕۆژەکە گوازرایەوە بۆ Trash" : result.message,
  };
}

export async function restoreProjectAction(id: string) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  const { data, error } = await guard.supabase
    .from("projects")
    .update({ deleted_at: null })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return { status: "error" as const, message: error.message };

  await writeAuditLog({
    action: "restored",
    entity: "projects",
    entity_id: id,
    entity_label: data?.slug,
  });

  revalidateProjectPaths(data?.slug);
  return { status: "success" as const, message: "پڕۆژەکە گەڕێندرایەوە" };
}

export async function purgeProjectAction(id: string) {
  const result = await hardDeleteRecord({ table: "projects", section: "projects", id });
  revalidatePath("/admin/projects/trash");
  return result;
}

export async function deleteProjectAction(id: string) {
  return trashProjectAction(id);
}

export async function reorderProjectsAction(orderedIds: string[]) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  await Promise.all(
    orderedIds.map((id, index) =>
      guard.supabase.from("projects").update({ sort_order: index + 1 }).eq("id", id)
    )
  );

  revalidateProjectPaths();
  return { status: "success" as const, message: "ڕیزبەندی نوێکرایەوە" };
}

export async function saveProjectCategoryAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  const description = emptyToNull(String(formData.get("description") ?? ""));
  const sort_order = parseNumber(formData.get("sort_order"));
  const is_active = parseBoolean(formData.get("is_active"));

  if (!name) return { status: "error", message: "ناوی پۆل پێویستە" };

  const payload = { name, slug, description, sort_order, is_active };

  if (id) {
    const { error } = await guard.supabase.from("project_categories").update(payload).eq("id", id);
    if (error) return { status: "error", message: error.message };
  } else {
    const { error } = await guard.supabase.from("project_categories").insert(payload);
    if (error) return { status: "error", message: error.message };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin/projects/categories");
  revalidatePath("/projects");
  revalidatePath("/");
  return { status: "success", message: getActionMessage("save") };
}

export async function deleteProjectCategoryAction(id: string) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;
  const { error } = await guard.supabase.from("project_categories").delete().eq("id", id);
  if (error) return { status: "error", message: error.message };
  revalidatePath("/admin/projects/categories");
  revalidatePath("/projects");
  return { status: "success", message: "پۆل سڕایەوە" };
}

export async function reorderProjectCategoriesAction(orderedIds: string[]) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;
  await Promise.all(
    orderedIds.map((id, index) =>
      guard.supabase.from("project_categories").update({ sort_order: index + 1 }).eq("id", id)
    )
  );
  revalidatePath("/admin/projects/categories");
  revalidatePath("/projects");
  revalidatePath("/");
  return { status: "success" as const, message: "ڕیزبەندی پۆلەکان نوێکرایەوە" };
}

export async function saveTechnologyAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") || name));
  if (!name) return { status: "error", message: "ناوی تەکنەلۆژیا پێویستە" };

  if (id) {
    const { error } = await guard.supabase.from("technologies").update({ name, slug }).eq("id", id);
    if (error) return { status: "error", message: error.message };
  } else {
    const { error } = await guard.supabase.from("technologies").insert({ name, slug });
    if (error) return { status: "error", message: error.message };
  }

  revalidatePath("/admin/projects/technologies");
  return { status: "success", message: getActionMessage("save") };
}

export async function deleteTechnologyAction(id: string) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;
  const { error } = await guard.supabase.from("technologies").delete().eq("id", id);
  if (error) return { status: "error", message: error.message };
  revalidatePath("/admin/projects/technologies");
  return { status: "success", message: "تەکنەلۆژیا سڕایەوە" };
}

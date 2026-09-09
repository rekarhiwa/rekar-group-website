"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type ActionState,
  hardDeleteRecord,
  initialActionState,
  parseBoolean,
  softDeleteRecord,
  withMutationGuard,
  getActionMessage,
} from "@/app/admin/actions/_shared";
import { writeAuditLog } from "@/lib/auth/admin";
import { requireProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { slugify } from "@/lib/utils";
import { normalizeStatus } from "@/lib/admin/data";

const postSchema = z.object({
  title: z.string().min(1, "ناونیشان پێویستە"),
  slug: z.string().optional().default(""),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  cover_image: z.string().optional().nullable().default(""),
  category_id: z.string().optional().nullable().default(""),
  author_id: z.string().optional().nullable().default(""),
  tag_ids: z.string().optional().default(""),
  featured: z.string().optional().default(""),
  status: z.string().optional().default("draft"),
  published_at: z.string().optional().nullable().default(""),
  seo_title: z.string().optional().default(""),
  seo_description: z.string().optional().default(""),
  og_image: z.string().optional().nullable().default(""),
});

function emptyToNull(value: string | null | undefined) {
  const v = (value ?? "").trim();
  return v ? v : null;
}

async function syncPostTags(postId: string, tagIdsRaw: string) {
  const supabase = await createClient();
  await supabase.from("post_tags").delete().eq("post_id", postId);

  const ids = tagIdsRaw
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!ids.length) return;

  // Support both UUIDs and slugs
  const uuidLike = ids.filter((id) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  );
  const slugs = ids.filter((id) => !uuidLike.includes(id));

  const tagIds: string[] = [...uuidLike];
  if (slugs.length) {
    const { data: tags } = await supabase.from("tags").select("id, slug").in("slug", slugs);
    for (const tag of tags ?? []) tagIds.push(tag.id);
  }

  if (!tagIds.length) return;
  await supabase.from("post_tags").insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
}

function resolveStatusAndDate(intent: string, statusInput: string, publishedAtInput: string | null) {
  let status = normalizeStatus(statusInput || "draft");
  let published_at = emptyToNull(publishedAtInput);

  if (intent === "publish" || intent === "publish_now") {
    status = "published";
    published_at = published_at || new Date().toISOString();
  } else if (intent === "schedule") {
    status = "scheduled";
    if (!published_at) {
      throw new Error("بۆ خشتەکردن دەبێت بەرواری بڵاوکردنەوە دیاری بکرێت");
    }
  } else if (intent === "unpublish" || intent === "save_draft") {
    status = "draft";
  } else if (intent === "archive") {
    status = "archived";
  }

  return { status, published_at };
}

export async function savePostAction(
  prevState: ActionState = initialActionState,
  formData: FormData
): Promise<ActionState & { id?: string; slug?: string }> {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "save");
  const raw = Object.fromEntries(formData.entries());
  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "هەڵەیەک ڕوویدا" };
  }

  try {
    const profile = await requireProfile();
    const input = parsed.data;
    const { status, published_at } = resolveStatusAndDate(
      intent,
      input.status,
      input.published_at
    );

    const slug = slugify(input.slug || input.title);
    const payload = {
      title: input.title,
      slug,
      excerpt: emptyToNull(input.excerpt),
      content: input.content || "",
      cover_image: emptyToNull(input.cover_image),
      category_id: emptyToNull(input.category_id),
      author_id: emptyToNull(input.author_id) || profile.id,
      featured: parseBoolean(formData.get("featured")),
      status,
      published_at,
      seo_title: emptyToNull(input.seo_title),
      seo_description: emptyToNull(input.seo_description),
      og_image: emptyToNull(input.og_image),
    };

    let recordId = id;
    if (id) {
      const { error } = await guard.supabase.from("posts").update(payload).eq("id", id);
      if (error) return { status: "error", message: error.message };
    } else {
      const { data, error } = await guard.supabase
        .from("posts")
        .insert(payload)
        .select("id")
        .single();
      if (error) return { status: "error", message: error.message };
      recordId = String(data.id);
    }

    await syncPostTags(recordId, input.tag_ids);

    await writeAuditLog({
      action:
        intent === "publish" || intent === "publish_now"
          ? "published"
          : intent === "schedule"
            ? "scheduled"
            : id
              ? "updated"
              : "created",
      entity: "posts",
      entity_id: recordId,
      entity_label: payload.title,
    });

    for (const path of [
      "/admin/posts",
      `/admin/posts/${recordId}`,
      "/admin",
      "/",
      "/insights",
      `/insights/${slug}`,
    ]) {
      revalidatePath(path);
    }

    return {
      status: "success",
      message: getActionMessage(
        intent === "publish_now" || intent === "publish" ? "publish" : "save"
      ),
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

export async function autosavePostAction(payload: {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string | null;
  category_id?: string | null;
  author_id?: string | null;
  tag_ids?: string[];
  featured?: boolean;
  status?: string;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  og_image?: string | null;
}): Promise<ActionState & { id?: string }> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase ڕێک نەخراوە" };
  }

  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;

  try {
    const profile = await requireProfile();
    const title = payload.title?.trim() || "پۆستی بێ ناونیشان";
    const slug = slugify(payload.slug || title);
    const row = {
      title,
      slug,
      excerpt: emptyToNull(payload.excerpt),
      content: payload.content || "",
      cover_image: emptyToNull(payload.cover_image),
      category_id: emptyToNull(payload.category_id),
      author_id: emptyToNull(payload.author_id) || profile.id,
      featured: Boolean(payload.featured),
      status: normalizeStatus(payload.status || "draft"),
      published_at: emptyToNull(payload.published_at),
      seo_title: emptyToNull(payload.seo_title),
      seo_description: emptyToNull(payload.seo_description),
      og_image: emptyToNull(payload.og_image),
    };

    let recordId = payload.id || "";
    if (recordId) {
      const { error } = await guard.supabase.from("posts").update(row).eq("id", recordId);
      if (error) return { status: "error", message: error.message };
    } else {
      const { data, error } = await guard.supabase
        .from("posts")
        .insert({ ...row, status: "draft" })
        .select("id")
        .single();
      if (error) return { status: "error", message: error.message };
      recordId = String(data.id);
    }

    if (payload.tag_ids?.length) {
      await syncPostTags(recordId, payload.tag_ids.join(","));
    }

    revalidatePath("/admin/posts");
    revalidatePath(`/admin/posts/${recordId}`);

    return { status: "success", message: "پاشەکەوت کرا", id: recordId };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "هەڵەیەک ڕوویدا",
    };
  }
}

export async function deletePostAction(id: string) {
  return softDeleteRecord({
    table: "posts",
    section: "posts",
    id,
    publicPaths: ["/", "/insights"],
  });
}

export async function restorePostFromEditorAction(id: string) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;
  const { error } = await guard.supabase
    .from("posts")
    .update({ deleted_at: null })
    .eq("id", id);
  if (error) return { status: "error", message: error.message };
  await writeAuditLog({ action: "restored", entity: "posts", entity_id: id });
  revalidatePath("/admin/posts");
  revalidatePath("/admin/trash");
  return { status: "success", message: "گەڕێندرایەوە" };
}

export async function purgePostAction(id: string) {
  return hardDeleteRecord({ table: "posts", section: "posts", id });
}

export async function bulkUpdatePostsAction(input: {
  ids: string[];
  action: "publish" | "unpublish" | "archive" | "trash" | "feature" | "unfeature";
}) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state as ActionState;
  if (!input.ids.length) return { status: "error", message: "هیچ پۆستێک هەڵنەبژێردراوە" };

  const patch: Record<string, unknown> = {};
  if (input.action === "publish") {
    patch.status = "published";
    patch.published_at = new Date().toISOString();
  } else if (input.action === "unpublish") {
    patch.status = "draft";
  } else if (input.action === "archive") {
    patch.status = "archived";
  } else if (input.action === "trash") {
    patch.deleted_at = new Date().toISOString();
  } else if (input.action === "feature") {
    patch.featured = true;
  } else if (input.action === "unfeature") {
    patch.featured = false;
  }

  const { error } = await guard.supabase.from("posts").update(patch).in("id", input.ids);
  if (error) return { status: "error", message: error.message };

  await writeAuditLog({
    action: `bulk_${input.action}`,
    entity: "posts",
    entity_label: `${input.ids.length} posts`,
  });

  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/insights");
  return { status: "success", message: "پاشەکەوت کرا" };
}

export async function publishDueScheduledPostsAction() {
  const { publishDueScheduledPosts } = await import("@/lib/posts/publish-due");
  const count = await publishDueScheduledPosts();
  return { count };
}

export async function uploadEditorImageAction(formData: FormData): Promise<{
  ok: boolean;
  url?: string;
  error?: string;
}> {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return { ok: false, error: "Unauthorized or demo mode" };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "فایل نەدۆزرایەوە" };
  if (!file.type.startsWith("image/")) return { ok: false, error: "تەنها وێنە ڕێگەپێدراوە" };
  if (file.size > 8 * 1024 * 1024) return { ok: false, error: "قەبارەی فایل زۆر گەورەیە" };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await guard.supabase.storage.from("media").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { ok: false, error: error.message };

  const { data } = guard.supabase.storage.from("media").getPublicUrl(path);

  try {
    const profile = await requireProfile();
    await guard.supabase.from("media").insert({
      filename: file.name,
      url: data.publicUrl,
      size: file.size,
      mime_type: file.type,
      uploaded_by: profile.id,
    });
  } catch {
    // non-fatal
  }

  return { ok: true, url: data.publicUrl };
}

"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog, requireRole } from "@/lib/auth/admin";
import { withMutationGuard } from "@/app/admin/actions/_shared";
import { isClerkConfigured } from "@/lib/auth/clerk";

export async function deleteMediaAction(id: string) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state;

  const { data: record } = await guard.supabase.from("media").select("*").eq("id", id).single();
  const { error } = await guard.supabase.from("media").delete().eq("id", id);
  if (error) return { status: "error" as const, message: error.message };

  if (record?.url) {
    const maybePath = String(record.url).split("/media/")[1];
    if (maybePath) {
      await guard.supabase.storage.from("media").remove([maybePath]);
    }
  }

  await writeAuditLog({ action: "deleted", entity: "media", entity_id: id, entity_label: record?.filename });
  revalidatePath("/admin/media");
  return { status: "success" as const, message: "سڕایەوە" };
}

export async function uploadMediaFileAction(formData: FormData): Promise<{
  ok: boolean;
  url?: string;
  error?: string;
}> {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) {
    return { ok: false, error: guard.state.message || "دەسەڵاتت نییە یان دۆخی demo چالاکە" };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "فایل نەدۆزرایەوە" };
  if (!file.type.startsWith("image/")) return { ok: false, error: "تەنها وێنە ڕێگەپێدراوە" };
  if (file.size > 8 * 1024 * 1024) return { ok: false, error: "قەبارەی فایل زۆر گەورەیە (٨MB)" };

  const bucket = String(formData.get("bucket") || "media");
  if (bucket !== "media" && bucket !== "project-media") {
    return { ok: false, error: "باکێتی نادروست" };
  }

  const prefix = String(formData.get("prefix") || "uploads").replace(/[^a-zA-Z0-9/_-]/g, "");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await guard.supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { ok: false, error: error.message };

  const { data } = guard.supabase.storage.from(bucket).getPublicUrl(path);

  if (bucket === "media") {
    try {
      const profile = await requireRole("editor");
      await guard.supabase.from("media").insert({
        filename: file.name,
        url: data.publicUrl,
        size: file.size,
        mime_type: file.type,
        // Clerk user IDs are not rows in public.profiles
        uploaded_by: isClerkConfigured() ? null : profile.id,
      });
    } catch {
      // non-fatal
    }
  }

  return { ok: true, url: data.publicUrl };
}

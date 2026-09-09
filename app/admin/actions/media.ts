"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/auth/admin";
import { withMutationGuard } from "@/app/admin/actions/_shared";

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

"use server";

import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/auth/admin";
import { withMutationGuard } from "@/app/admin/actions/_shared";

export async function updateMessageStateAction(args: {
  id: string;
  patch: { is_read?: boolean; is_important?: boolean; is_archived?: boolean };
}) {
  const guard = await withMutationGuard("editor");
  if (!guard.ok) return guard.state;

  const { error } = await guard.supabase.from("contact_messages").update(args.patch).eq("id", args.id);
  if (error) return { status: "error" as const, message: error.message };

  await writeAuditLog({ action: "updated", entity: "messages", entity_id: args.id });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { status: "success" as const, message: "پاشەکەوت کرا" };
}

export async function deleteMessageAction(id: string) {
  const guard = await withMutationGuard("admin");
  if (!guard.ok) return guard.state;

  const { error } = await guard.supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { status: "error" as const, message: error.message };
  await writeAuditLog({ action: "deleted", entity: "messages", entity_id: id });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { status: "success" as const, message: "سڕایەوە" };
}

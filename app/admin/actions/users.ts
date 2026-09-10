"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { withMutationGuard } from "@/app/admin/actions/_shared";

const schema = z.object({
  id: z.string().optional().default(""),
  email: z.email("ئیمەیڵی دروست پێویستە"),
  full_name: z.string().optional().default(""),
  role: z.enum(["super_admin", "admin", "editor"]),
  is_active: z.string().optional().default(""),
});

export async function saveUserAction(formData: FormData) {
  const guard = await withMutationGuard("super_admin");
  if (!guard.ok) return guard.state;

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error" as const, message: parsed.error.issues[0]?.message ?? "هەڵەیەک ڕوویدا" };
  }

  const payload = {
    email: parsed.data.email,
    full_name: parsed.data.full_name || null,
    role: parsed.data.role,
    is_active: parsed.data.is_active === "on" || parsed.data.is_active === "true",
  };

  if (parsed.data.id) {
    const { error } = await guard.supabase.from("profiles").update(payload).eq("id", parsed.data.id);
    if (error) return { status: "error" as const, message: error.message };
  } else {
    const service = createServiceClient();
    const { error } = await service.auth.admin.inviteUserByEmail(parsed.data.email, {
      data: {
        full_name: parsed.data.full_name,
      },
    });
    if (error) return { status: "error" as const, message: error.message };
  }

  await writeAuditLog({ action: "updated", entity: "users", entity_label: parsed.data.email });
  revalidatePath("/admin/users");
  return { status: "success" as const, message: "پاشەکەوت کرا" };
}

export async function disableUserAction(id: string) {
  const guard = await withMutationGuard("super_admin");
  if (!guard.ok) return guard.state;

  const { error } = await guard.supabase.from("profiles").update({ is_active: false }).eq("id", id);
  if (error) return { status: "error" as const, message: error.message };
  await writeAuditLog({ action: "disabled", entity: "users", entity_id: id });
  revalidatePath("/admin/users");
  return { status: "success" as const, message: "پاشەکەوت کرا" };
}

import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import type { UserRole } from "@/types/database";
import { hasMinRole } from "@/lib/permissions/rbac";
import { revalidatePath } from "next/cache";

export async function requireRole(minRole: UserRole) {
  const profile = await requireProfile();
  if (!hasMinRole(profile.role, minRole)) {
    throw new Error("Forbidden");
  }
  return profile;
}

export async function writeAuditLog(input: {
  action: string;
  entity: string;
  entity_id?: string;
  entity_label?: string;
}) {
  try {
    const profile = await requireProfile();
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      user_id: profile.id,
      user_name: profile.full_name ?? profile.email,
      action: input.action,
      entity: input.entity,
      entity_id: input.entity_id ?? null,
      entity_label: input.entity_label ?? null,
    });
  } catch {
    // non-fatal
  }
}

export function revalidatePublic(paths: string[] = ["/"]) {
  for (const p of paths) revalidatePath(p);
}

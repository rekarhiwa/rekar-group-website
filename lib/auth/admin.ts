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
    const uuidLike =
      typeof profile.id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        profile.id
      );
    await supabase.from("audit_logs").insert({
      // Clerk IDs are not UUIDs referencing auth.users / profiles
      user_id: uuidLike ? profile.id : null,
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

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole, revalidatePublic, writeAuditLog } from "@/lib/auth/admin";
import { initialActionState, type ActionState } from "@/lib/admin/action-state";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { normalizeStatus } from "@/lib/admin/data";
import type { UserRole } from "@/types/database";

const successMessages = {
  saved: "پاشەکەوت کرا",
  published: "بڵاوکرایەوە",
  deleted: "سڕایەوە",
  error: "هەڵەیەک ڕوویدا",
};

function demoError(): ActionState {
  return {
    status: "error",
    message:
      "CMS mutations پێویستیان بە NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY هەیە.",
  };
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

function parseNumber(value: FormDataEntryValue | null, fallback = 0) {
  const num = Number(value ?? fallback);
  return Number.isFinite(num) ? num : fallback;
}

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getActionMessage(intent: string) {
  if (intent === "publish") return successMessages.published;
  if (intent === "delete") return successMessages.deleted;
  return successMessages.saved;
}

export async function withMutationGuard(role: UserRole = "editor") {
  if (!isSupabaseConfigured()) return { ok: false as const, state: demoError() };
  try {
    await requireRole(role);
    return { ok: true as const, supabase: await createClient() };
  } catch {
    return { ok: false as const, state: { status: "error", message: successMessages.error } };
  }
}

export async function saveSimpleCollectionItem(args: {
  section: string;
  table: string;
  entityLabel: string;
  role?: UserRole;
  prevState: ActionState;
  formData: FormData;
  schema: z.ZodType<Record<string, unknown>>;
  transform?: (input: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
  afterSave?: (id: string, input: Record<string, unknown>) => Promise<void>;
  revalidate?: string[];
}): Promise<ActionState> {
  const guard = await withMutationGuard(args.role);
  if (!guard.ok) return guard.state as ActionState;

  const id = String(args.formData.get("id") ?? "");
  const intent = String(args.formData.get("intent") ?? "save");
  const raw = Object.fromEntries(args.formData.entries());
  const parsed = args.schema.safeParse(raw);

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? successMessages.error };
  }

  const payloadBase = await args.transform?.(parsed.data) ?? parsed.data;
  const payload = {
    ...payloadBase,
    slug: "slug" in payloadBase ? slugify(String(payloadBase.slug || payloadBase.name || payloadBase.title || "")) : undefined,
    status: "status" in payloadBase ? normalizeStatus(String(payloadBase.status ?? "draft")) : undefined,
  };

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );

  let recordId = id;
  if (id) {
    const { error } = await guard.supabase.from(args.table).update(cleanPayload).eq("id", id);
    if (error) return { status: "error", message: error.message };
  } else {
    const { data, error } = await guard.supabase
      .from(args.table)
      .insert(cleanPayload)
      .select("id")
      .single();
    if (error) return { status: "error", message: error.message };
    recordId = String(data?.id ?? "");
  }

  if (args.afterSave) {
    await args.afterSave(recordId, cleanPayload);
  }

  await writeAuditLog({
    action: intent === "publish" ? "published" : id ? "updated" : "created",
    entity: args.section,
    entity_id: recordId,
    entity_label: String(cleanPayload.title ?? cleanPayload.name ?? cleanPayload.label ?? args.entityLabel),
  });

  for (const path of args.revalidate ?? [`/admin/${args.section}`, "/admin"]) {
    revalidatePath(path);
  }
  revalidatePublic(["/", `/${args.section}`]);

  return { status: "success", message: getActionMessage(intent) };
}

export async function softDeleteRecord(args: {
  table: string;
  section: string;
  role?: UserRole;
  id: string;
  publicPaths?: string[];
}): Promise<ActionState> {
  const guard = await withMutationGuard(args.role);
  if (!guard.ok) return guard.state as ActionState;
  const { error } = await guard.supabase
    .from(args.table)
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", args.id);
  if (error) return { status: "error", message: error.message };
  await writeAuditLog({
    action: "deleted",
    entity: args.section,
    entity_id: args.id,
  });
  revalidatePath(`/admin/${args.section}`);
  revalidatePath("/admin/trash");
  revalidatePublic(args.publicPaths ?? ["/"]);
  return { status: "success", message: successMessages.deleted };
}

export async function hardDeleteRecord(args: {
  table: string;
  section: string;
  role?: UserRole;
  id: string;
}): Promise<ActionState> {
  const guard = await withMutationGuard(args.role);
  if (!guard.ok) return guard.state as ActionState;
  const { error } = await guard.supabase.from(args.table).delete().eq("id", args.id);
  if (error) return { status: "error", message: error.message };
  await writeAuditLog({
    action: "deleted",
    entity: args.section,
    entity_id: args.id,
  });
  revalidatePath(`/admin/${args.section}`);
  return { status: "success", message: successMessages.deleted };
}

export async function restoreRecord(args: {
  table: string;
  section: string;
  role?: UserRole;
  id: string;
}): Promise<ActionState> {
  const guard = await withMutationGuard(args.role);
  if (!guard.ok) return guard.state as ActionState;
  const { error } = await guard.supabase
    .from(args.table)
    .update({ deleted_at: null })
    .eq("id", args.id);
  if (error) return { status: "error", message: error.message };
  await writeAuditLog({
    action: "restored",
    entity: args.section,
    entity_id: args.id,
  });
  revalidatePath(`/admin/${args.section}`);
  revalidatePath("/admin/trash");
  revalidatePublic(["/"]);
  return { status: "success", message: successMessages.saved };
}

export function simpleNameSchema() {
  return z.object({
    name: z.string().min(1, "ناو پێویستە"),
    slug: z.string().optional().default(""),
  });
}

export function simpleVisibilitySchema() {
  return z.object({
    name: z.string().min(1, "ناو پێویستە"),
    logo: z.string().optional().default(""),
    website: z.string().optional().default(""),
    sort_order: z.coerce.number().int().default(0),
    visible: z.string().optional().default(""),
  });
}

export { initialActionState, parseBoolean, parseNumber, parseTags, successMessages };
export type { ActionState };

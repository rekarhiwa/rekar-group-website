"use server";

import { z } from "zod";
import {
  type ActionState,
  hardDeleteRecord,
  initialActionState,
  parseBoolean,
  parseNumber,
  saveSimpleCollectionItem,
} from "@/app/admin/actions/_shared";

const navSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
  type: z.string().optional().default("link"),
  parent_id: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
  open_in_new_tab: z.string().optional().default(""),
  visible: z.string().optional().default(""),
});

const socialSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().min(1, "URL is required"),
  enabled: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
});

export async function saveNavigationItemAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "navigation",
    table: "navigation_items",
    entityLabel: "navigation item",
    prevState,
    formData,
    schema: navSchema,
    transform: async (input) => ({
      ...input,
      parent_id: input.parent_id || null,
      sort_order: parseNumber(formData.get("sort_order")),
      open_in_new_tab: parseBoolean(formData.get("open_in_new_tab")),
      visible: parseBoolean(formData.get("visible")),
    }),
    revalidate: ["/admin/navigation", "/admin", "/"],
  });
}

export async function saveSocialLinkAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "navigation",
    table: "social_links",
    entityLabel: "social link",
    prevState,
    formData,
    schema: socialSchema,
    transform: async (input) => ({
      ...input,
      enabled: parseBoolean(formData.get("enabled")),
      sort_order: parseNumber(formData.get("sort_order")),
    }),
    revalidate: ["/admin/navigation", "/admin/settings/footer", "/"],
  });
}

export async function deleteNavigationItemAction(id: string) {
  return hardDeleteRecord({ table: "navigation_items", section: "navigation", id });
}

export async function deleteSocialLinkAction(id: string) {
  return hardDeleteRecord({ table: "social_links", section: "navigation", id });
}

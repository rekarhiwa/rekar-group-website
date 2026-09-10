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

const schema = z.object({
  value: z.string().min(1, "بەها پێویستە"),
  label: z.string().min(1, "ناو پێویستە"),
  icon: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
  visible: z.string().optional().default(""),
  show_in_hero: z.string().optional().default(""),
});

export async function saveStatAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "stats",
    table: "stats",
    entityLabel: "stat",
    prevState,
    formData,
    schema,
    transform: async (input) => ({
      ...input,
      sort_order: parseNumber(formData.get("sort_order")),
      visible: parseBoolean(formData.get("visible")),
      show_in_hero: parseBoolean(formData.get("show_in_hero")),
    }),
    revalidate: ["/admin/stats", "/admin", "/", "/admin/home"],
  });
}

export async function deleteStatAction(id: string) {
  return hardDeleteRecord({ table: "stats", section: "stats", id });
}

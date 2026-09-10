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
  step_number: z.coerce.number().int().default(1),
  title: z.string().min(1, "ناونیشان پێویستە"),
  description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
  visible: z.string().optional().default(""),
});

export async function saveProcessAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "process",
    table: "process_steps",
    entityLabel: "process step",
    prevState,
    formData,
    schema,
    transform: async (input) => ({
      ...input,
      step_number: parseNumber(formData.get("step_number"), 1),
      sort_order: parseNumber(formData.get("sort_order")),
      visible: parseBoolean(formData.get("visible")),
    }),
    revalidate: ["/admin/process", "/admin", "/"],
  });
}

export async function deleteProcessAction(id: string) {
  return hardDeleteRecord({ table: "process_steps", section: "process", id });
}

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
  name: z.string().min(1, "ناو پێویستە"),
  logo: z.string().optional().default(""),
  website: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
  visible: z.string().optional().default(""),
});

export async function saveClientAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "clients",
    table: "clients",
    entityLabel: "client",
    prevState,
    formData,
    schema,
    transform: async (input) => ({
      ...input,
      sort_order: parseNumber(formData.get("sort_order")),
      visible: parseBoolean(formData.get("visible")),
    }),
    revalidate: ["/admin/clients", "/admin", "/"],
  });
}

export async function deleteClientAction(id: string) {
  return hardDeleteRecord({ table: "clients", section: "clients", id });
}

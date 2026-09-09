"use server";

import { z } from "zod";
import {
  type ActionState,
  hardDeleteRecord,
  initialActionState,
  parseNumber,
  parseTags,
  saveSimpleCollectionItem,
  softDeleteRecord,
} from "@/app/admin/actions/_shared";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional().default(""),
  short_description: z.string().optional().default(""),
  full_description: z.string().optional().default(""),
  icon: z.string().optional().default(""),
  cover_image: z.string().optional().default(""),
  features: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
  status: z.string().optional().default("draft"),
  seo_title: z.string().optional().default(""),
  seo_description: z.string().optional().default(""),
});

export async function saveServiceAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "services",
    table: "services",
    entityLabel: "service",
    prevState,
    formData,
    schema,
    transform: async (input) => ({
      ...input,
      sort_order: parseNumber(formData.get("sort_order")),
      features: parseTags(formData.get("features")),
    }),
    revalidate: ["/admin/services", "/admin", "/", "/services"],
  });
}

export async function deleteServiceAction(id: string) {
  return softDeleteRecord({
    table: "services",
    section: "services",
    id,
    publicPaths: ["/", "/services"],
  });
}

export async function purgeServiceAction(id: string) {
  return hardDeleteRecord({ table: "services", section: "services", id });
}

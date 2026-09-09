"use server";

import { z } from "zod";
import {
  type ActionState,
  hardDeleteRecord,
  initialActionState,
  parseNumber,
  saveSimpleCollectionItem,
} from "@/app/admin/actions/_shared";

const projectCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
});

const postCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional().default(""),
});

export async function saveProjectCategoryAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "categories",
    table: "project_categories",
    entityLabel: "project category",
    prevState,
    formData,
    schema: projectCategorySchema,
    transform: async (input) => ({
      ...input,
      sort_order: parseNumber(formData.get("sort_order")),
    }),
    revalidate: ["/admin/categories", "/admin/projects"],
  });
}

export async function savePostCategoryAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "categories",
    table: "post_categories",
    entityLabel: "post category",
    prevState,
    formData,
    schema: postCategorySchema,
    revalidate: ["/admin/categories", "/admin/posts"],
  });
}

export async function deleteProjectCategoryAction(id: string) {
  return hardDeleteRecord({ table: "project_categories", section: "categories", id });
}

export async function deletePostCategoryAction(id: string) {
  return hardDeleteRecord({ table: "post_categories", section: "categories", id });
}

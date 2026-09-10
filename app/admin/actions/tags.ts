"use server";

import { z } from "zod";
import {
  type ActionState,
  hardDeleteRecord,
  initialActionState,
  saveSimpleCollectionItem,
} from "@/app/admin/actions/_shared";

const schema = z.object({
  name: z.string().min(1, "ناو پێویستە"),
  slug: z.string().optional().default(""),
});

export async function saveTagAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "tags",
    table: "tags",
    entityLabel: "tag",
    prevState,
    formData,
    schema,
    revalidate: ["/admin/tags", "/admin/posts"],
  });
}

export async function deleteTagAction(id: string) {
  return hardDeleteRecord({ table: "tags", section: "tags", id });
}

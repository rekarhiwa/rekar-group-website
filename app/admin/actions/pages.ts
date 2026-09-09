"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  type ActionState,
  hardDeleteRecord,
  initialActionState,
  saveSimpleCollectionItem,
  softDeleteRecord,
} from "@/app/admin/actions/_shared";

const blockSchema = z.array(
  z.object({
    type: z.string(),
    content: z.record(z.string(), z.unknown()).default({}),
    sort_order: z.number().default(0),
    visible: z.boolean().default(true),
  })
);

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional().default(""),
  status: z.string().optional().default("draft"),
  seo_title: z.string().optional().default(""),
  seo_description: z.string().optional().default(""),
  blocks_json: z.string().optional().default("[]"),
});

export async function savePageAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "pages",
    table: "pages",
    entityLabel: "page",
    prevState,
    formData,
    schema,
    afterSave: async (id, input) => {
      const rawBlocks = String(input.blocks_json ?? "[]");
      const parsedJson = JSON.parse(rawBlocks);
      const blocks = blockSchema.parse(parsedJson);
      const supabase = await createClient();
      await supabase.from("page_blocks").delete().eq("page_id", id);
      if (!blocks.length) return;
      await supabase.from("page_blocks").insert(
        blocks.map((block, index) => ({
          page_id: id,
          type: block.type,
          content: block.content,
          visible: block.visible,
          sort_order: block.sort_order || index + 1,
        }))
      );
    },
    transform: async (input) => ({
      title: input.title,
      slug: input.slug,
      status: input.status,
      seo_title: input.seo_title,
      seo_description: input.seo_description,
    }),
    revalidate: ["/admin/pages", "/admin", "/"],
  });
}

export async function deletePageAction(id: string) {
  return softDeleteRecord({
    table: "pages",
    section: "pages",
    id,
    publicPaths: ["/"],
  });
}

export async function purgePageAction(id: string) {
  return hardDeleteRecord({ table: "pages", section: "pages", id });
}

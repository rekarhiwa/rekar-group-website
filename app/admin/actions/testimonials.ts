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
  name: z.string().min(1, "Name is required"),
  job_title: z.string().optional().default(""),
  company: z.string().optional().default(""),
  avatar: z.string().optional().default(""),
  testimonial: z.string().min(1, "Testimonial is required"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  featured: z.string().optional().default(""),
  visible: z.string().optional().default(""),
  sort_order: z.coerce.number().int().default(0),
});

export async function saveTestimonialAction(
  prevState: ActionState = initialActionState,
  formData: FormData
) {
  return saveSimpleCollectionItem({
    section: "testimonials",
    table: "testimonials",
    entityLabel: "testimonial",
    prevState,
    formData,
    schema,
    transform: async (input) => ({
      ...input,
      rating: parseNumber(formData.get("rating"), 5),
      featured: parseBoolean(formData.get("featured")),
      visible: parseBoolean(formData.get("visible")),
      sort_order: parseNumber(formData.get("sort_order")),
    }),
    revalidate: ["/admin/testimonials", "/admin", "/"],
  });
}

export async function deleteTestimonialAction(id: string) {
  return hardDeleteRecord({ table: "testimonials", section: "testimonials", id });
}

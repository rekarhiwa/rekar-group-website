"use server";

import { restoreRecord } from "@/app/admin/actions/_shared";

export async function restoreProjectAction(id: string) {
  return restoreRecord({ table: "projects", section: "projects", id });
}

export async function restorePostAction(id: string) {
  return restoreRecord({ table: "posts", section: "posts", id });
}

export async function restorePageAction(id: string) {
  return restoreRecord({ table: "pages", section: "pages", id });
}

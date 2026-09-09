"use server";

import { submitContactMessage } from "@/services/content";

export type ContactFormState = {
  ok: boolean;
  message: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const project_type = String(formData.get("project_type") || "").trim();
  const budget = String(formData.get("budget") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!full_name || !message) {
    return {
      ok: false,
      message: "تکایە ناو و نامەکەت پڕ بکەرەوە.",
    };
  }

  const result = await submitContactMessage({
    full_name,
    phone: phone || null,
    email: email || null,
    company: company || null,
    project_type: project_type || null,
    budget: budget || null,
    message,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.error || "هەڵەیەک ڕوویدا، تکایە دواتر هەوڵ بدەرەوە.",
    };
  }

  return {
    ok: true,
    message: "نامەکەت بە سەرکەوتوویی نێردرا. زوو پەیوەندیت پێوە دەکەین.",
  };
}

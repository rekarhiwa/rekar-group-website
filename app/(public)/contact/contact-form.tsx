"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import type { ContactFormState } from "@/app/(public)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full rounded-2xl" disabled={pending}>
      {pending ? "لە ناردندانە..." : "ناردنی داواکاری"}
    </Button>
  );
}

const initialState: ContactFormState = {
  ok: false,
  message: "",
};

export function ContactForm({
  action,
}: {
  action: (
    state: ContactFormState,
    formData: FormData
  ) => Promise<ContactFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="glass rounded-[2rem] p-6 sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm text-muted">
            ناوی تەواو
          </label>
          <Input id="full_name" name="full_name" required placeholder="ناوت بنووسە" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm text-muted">
            ژمارەی مۆبایل
          </label>
          <Input id="phone" name="phone" placeholder="07xx xxx xxxx" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-muted">
            ئیمەیڵ
          </label>
          <Input id="email" name="email" type="email" placeholder="name@example.com" />
        </div>
        <div>
          <label htmlFor="company" className="mb-2 block text-sm text-muted">
            ناوی کۆمپانیا
          </label>
          <Input id="company" name="company" placeholder="ناوی دامەزراوە" />
        </div>
        <div>
          <label htmlFor="project_type" className="mb-2 block text-sm text-muted">
            جۆری پڕۆژە
          </label>
          <Input id="project_type" name="project_type" placeholder="وێبسایت، ئەپ، براند..." />
        </div>
        <div>
          <label htmlFor="budget" className="mb-2 block text-sm text-muted">
            بودجەی نزیک
          </label>
          <Input id="budget" name="budget" placeholder="بۆ نموونە: $3k - $10k" />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="mb-2 block text-sm text-muted">
          وردەکاری داواکاری
        </label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="ئامانج، کات، و پێداویستییە سەرەکییەکانت باس بکە"
          className="min-h-40"
        />
      </div>

      <div className="mt-6">
        <SubmitButton />
      </div>
    </form>
  );
}

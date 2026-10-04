"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function SupabaseSignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError("ئیمەیڵ یان پاسۆرد هەڵەیە.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("چوونەژوورەوە سەرکەوتوو نەبوو. دووبارە هەوڵبدەرەوە.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        name="email"
        type="email"
        autoComplete="username"
        required
        placeholder="ئیمەیڵ"
        dir="ltr"
      />
      <Input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="پاسۆرد"
        dir="ltr"
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "چاوەڕوان بە..." : "چوونەژوورەوە"}
      </Button>
    </form>
  );
}

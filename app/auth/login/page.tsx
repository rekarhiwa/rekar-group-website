"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured()) {
      toast.error("هەڵەیەک ڕوویدا");
      return;
    }

    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("پاشەکەوت کرا");
      const next = new URLSearchParams(window.location.search).get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch (error) {
      toast.error("هەڵەیەک ڕوویدا", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="ambient-bg flex min-h-screen items-center justify-center px-4 py-10"
    >
      <Card className="w-full max-w-md border-white/10 bg-[#14001f]/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(123,0,200,0.4)]">
            <Image src="/brand/logo-mark.png" alt="Rekar Group" width={64} height={64} className="h-full w-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">چوونەژوورەوەی Rekar CMS</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            بە ئیمەیڵ و وشەی نهێنیی Supabase بچۆرە ژوورەوە بۆ بەڕێوەبردنی ناوەڕۆک.
          </p>
        </div>

        {!isSupabaseConfigured() ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100">
            <p className="font-semibold">Supabase ڕێک نەخراوە</p>
            <p>
              تکایە `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` لە
              `.env.local` دابنێ. تا ئەو کاتە CMS تەنها بە دۆخی demo کار دەکات.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="mb-2 block">
                ئیمەیڵ
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="border-white/10 bg-[#160021]"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-2 block">
                وشەی نهێنی
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-white/10 bg-[#160021]"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "چاوەڕێ بکە..." : "چوونەژوورەوە"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="text-light-violet hover:underline">
            گەڕانەوە بۆ وێبسایت
          </Link>
        </div>
      </Card>
    </main>
  );
}

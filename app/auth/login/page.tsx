import Image from "next/image";
import Link from "next/link";

import { ClerkSignIn } from "@/app/auth/login/clerk-sign-in";
import { SupabaseSignIn } from "@/app/auth/login/supabase-sign-in";
import { Card } from "@/components/ui/card";
import { isClerkConfigured } from "@/lib/auth/clerk";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const clerkReady = isClerkConfigured();
  const supabaseReady = isSupabaseConfigured();

  return (
    <main
      dir="rtl"
      className="ambient-bg flex min-h-screen items-center justify-center px-4 py-10"
    >
      <Card className="w-full max-w-md border-border bg-card/90 p-6 shadow-[0_24px_80px_rgba(80,20,120,0.12)] sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(123,0,200,0.4)]">
            <Image
              src="/brand/logo-mark.png"
              alt="Rekar Group"
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">چوونەژوورەوە بۆ ئەدمین</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            {clerkReady
              ? "بە هەژماری Clerk بچۆرە ژوورەوە بۆ بەڕێوەبردنی ناوەڕۆک."
              : supabaseReady
                ? "بە ئیمەیڵ و پاسۆردی ئەدمین بچۆرە ژوورەوە."
                : "Clerk / Supabase دانەنراوە. دەتوانیت ئەدمین لە دۆخی دیمۆدا ببینیت."}
          </p>
        </div>

        {clerkReady ? (
          <ClerkSignIn />
        ) : supabaseReady ? (
          <SupabaseSignIn />
        ) : (
          <div className="space-y-3 text-center">
            <Link
              href="/admin"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-accent"
            >
              چوونە ناو ئەدمین (دیمۆ)
            </Link>
          </div>
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

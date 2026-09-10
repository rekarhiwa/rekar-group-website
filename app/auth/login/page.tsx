"use client";

import Image from "next/image";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main
      dir="rtl"
      className="ambient-bg flex min-h-screen items-center justify-center px-4 py-10"
    >
      <Card className="w-full max-w-md border-white/10 bg-[#14001f]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
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
          <h1 className="text-2xl font-bold text-white">چوونەژوورەوە بۆ ئەدمین</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            بە هەژماری Clerk بچۆرە ژوورەوە بۆ بەڕێوەبردنی ناوەڕۆک.
          </p>
        </div>

        <div className="flex justify-center" dir="ltr">
          <SignIn
            routing="hash"
            forceRedirectUrl="/admin"
            fallbackRedirectUrl="/admin"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-white/10 bg-white/5 text-white",
                formFieldInput: "border-white/10 bg-[#160021] text-white",
                formButtonPrimary: "bg-[#7B00C8] hover:bg-[#9A24F0]",
                footerActionLink: "text-[#C878FF]",
                identityPreviewText: "text-white",
                formFieldLabel: "text-[#C8ABD9]",
              },
            }}
          />
        </div>

        <div className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="text-light-violet hover:underline">
            گەڕانەوە بۆ وێبسایت
          </Link>
        </div>
      </Card>
    </main>
  );
}

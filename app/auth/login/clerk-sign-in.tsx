"use client";

import { SignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { SupabaseSignIn } from "@/app/auth/login/supabase-sign-in";

export function ClerkSignIn() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowFallback(true), 6000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="flex min-h-[16rem] justify-center" dir="ltr">
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

      {showFallback ? (
        <div className="space-y-3 border-t border-border pt-5" dir="rtl">
          <p className="text-center text-sm text-muted">
            فۆرمی Clerk بار نەبوو. دەتوانیت بە ئیمەیڵ/پاسۆردی ئەدمین بچیتە ژوورەوە:
          </p>
          <SupabaseSignIn />
        </div>
      ) : null}
    </div>
  );
}

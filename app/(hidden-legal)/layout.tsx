import type { ReactNode } from "react";

/** Standalone legal pages — no site header/footer/nav. */
export default function HiddenLegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection({
  title,
  subtitle,
  buttonLabel,
  buttonUrl,
}: {
  title: string;
  subtitle?: string | null;
  buttonLabel?: string;
  buttonUrl?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-border px-4 py-28 sm:px-6 lg:px-8 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(123,0,200,0.22),transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9A24F0]/20 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        <div className="glass-panel rounded-[2rem] px-6 py-12 text-center sm:px-10 sm:py-14">
          <p className="section-index mb-6">
            <span>04</span>
            <span className="section-index-sep">/</span>
            <span>دەستپێکردن</span>
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-tight text-foreground leading-[1.12]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {buttonLabel && buttonUrl ? (
              <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-none">
                <Link href={buttonUrl}>{buttonLabel}</Link>
              </Button>
            ) : null}
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 rounded-full border-white/15 px-8"
            >
              <Link href="/projects">سەیری پڕۆژەکان</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section className="border-t border-border px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">{subtitle}</p>
        ) : null}
        {buttonLabel && buttonUrl ? (
          <div className="mt-10">
            <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-none">
              <Link href={buttonUrl}>{buttonLabel}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

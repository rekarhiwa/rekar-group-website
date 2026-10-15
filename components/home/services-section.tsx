import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { Service } from "@/types/database";

export function ServicesSection({
  title,
  subtitle,
  services,
}: {
  title: string;
  subtitle?: string | null;
  services: Service[];
}) {
  if (!services.length) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          index={1}
          eyebrow="خزمەتگوزاری"
          title={title}
          subtitle={subtitle}
          className="mb-10"
        />

        <div className="divide-y divide-border">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services#${service.slug}`}
              className="group flex items-baseline justify-between gap-6 py-4 transition sm:gap-10"
            >
              <div className="min-w-0 flex-1 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-baseline sm:gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
                <h3 className="text-[0.95rem] font-medium text-foreground/90 transition group-hover:text-foreground">
                  {service.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[0.85rem] leading-6 text-muted sm:mt-0">
                  {service.short_description || service.full_description}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted/70 transition group-hover:text-light-violet">
                زیاتر
                <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

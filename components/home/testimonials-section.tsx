import { Star } from "lucide-react";

import { SectionHeading } from "@/components/public/section-heading";
import type { Testimonial } from "@/types/database";

export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
}: {
  title: string;
  subtitle?: string | null;
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Testimonials" title={title} subtitle={subtitle} />
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.id} className="glass rounded-[2rem] p-8">
              <div className="mb-5 flex gap-1 text-light-violet">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={`${testimonial.id}-${index}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg leading-9 text-foreground">
                “{testimonial.testimonial}”
              </blockquote>
              <figcaption className="mt-6">
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted">
                  {[testimonial.job_title, testimonial.company].filter(Boolean).join(" - ")}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

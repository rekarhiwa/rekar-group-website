import { CmsIcon } from "@/components/public/icon-map";
import { SectionHeading } from "@/components/public/section-heading";
import type { ProcessStep } from "@/types/database";

export function ProcessSection({
  title,
  subtitle,
  steps,
}: {
  title: string;
  subtitle?: string | null;
  steps: ProcessStep[];
}) {
  if (!steps.length) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Process" title={title} subtitle={subtitle} />
        <div className="grid gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.id} className="glass rounded-[2rem] p-7">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-5xl font-black text-white/12">{step.step_number}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-light-violet">
                  <CmsIcon name={step.icon ?? undefined} className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
              {step.description ? (
                <p className="mt-4 text-sm leading-7 text-muted">{step.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

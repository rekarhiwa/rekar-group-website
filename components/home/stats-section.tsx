import { CmsIcon } from "@/components/public/icon-map";
import { SectionHeading } from "@/components/public/section-heading";
import type { StatItem } from "@/types/database";

export function StatsSection({
  title,
  subtitle,
  stats,
}: {
  title: string;
  subtitle?: string | null;
  stats: StatItem[];
}) {
  if (!stats.length) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Impact" title={title} subtitle={subtitle} />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="glass rounded-[2rem] p-7 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-light-violet">
                <CmsIcon name={stat.icon ?? undefined} className="h-6 w-6" />
              </div>
              <div className="text-4xl font-black text-foreground">{stat.value}</div>
              <p className="mt-3 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

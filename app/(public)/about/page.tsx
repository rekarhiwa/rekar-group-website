import { ClientsSection } from "@/components/home/clients-section";
import { ProcessSection } from "@/components/home/process-section";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import {
  getClients,
  getProcessSteps,
  getSiteSettings,
  getStats,
  getTestimonials,
} from "@/services/content";

export default async function AboutPage() {
  const [settings, stats, steps, clients, testimonials] = await Promise.all([
    getSiteSettings(),
    getStats(false),
    getProcessSteps(),
    getClients(),
    getTestimonials(),
  ]);

  return (
    <div className="py-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-5 text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-light-violet uppercase">
            About
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            دەربارەی ڕێکار گروپ
          </h1>
          <p className="text-lg leading-8 text-muted">
            {settings.default_seo_description}
          </p>
        </div>
      </section>
      <StatsSection title="ئامارەکانمان" subtitle="بە ئەنجامی کارکردنی بەردەوام" stats={stats} />
      <ProcessSection title="شێوازی کارکردن" subtitle="هەنگاو بە هەنگاو لەگەڵت دەڕۆین" steps={steps} />
      <ClientsSection title="هاوبەش و کڕیارەکان" subtitle="براند و دامەزراوەی جۆراوجۆر" clients={clients} />
      <TestimonialsSection title="ڕای کڕیارەکان" subtitle="ئەزموونی کارکردن لەگەڵ ئێمە" testimonials={testimonials} />
    </div>
  );
}

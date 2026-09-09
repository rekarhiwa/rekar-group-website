import { ServicesSection } from "@/components/home/services-section";
import { getServices } from "@/services/content";

export default async function ServicesPage() {
  const services = await getServices(true);

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl space-y-4 text-start">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-light-violet uppercase">
            Services
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            خزمەتگوزارییەکانمان
          </h1>
          <p className="text-lg leading-8 text-muted">
            لە ستراتیژی و براندینگەوە تا وێبسایت، ئەپ و سیستەم؛ چارەسەری تەواومان هەیە.
          </p>
        </div>
      </div>
      <ServicesSection title="هەموو خزمەتگوزارییەکان" subtitle={null} services={services} />
    </div>
  );
}

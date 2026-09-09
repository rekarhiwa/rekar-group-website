import type { Metadata } from "next";

import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getProjectCategories, getPublishedProjects } from "@/services/projects";

export const metadata: Metadata = {
  title: "پڕۆژەکانمان",
  description:
    "کۆمەڵێک لە ئەپ، وێبسایت و سیستەمە دیجیتاڵییەکانی ڕێکار گروپ ببینە.",
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getPublishedProjects(),
    getProjectCategories(),
  ]);

  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#6F00B8]/20 blur-[120px]" />
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-12 max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-light-violet uppercase">
            Portfolio
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            پڕۆژەکانمان
          </h1>
          <p className="text-lg leading-8 text-muted">
            نمونەی ئەپ، وێبسایت و سیستەمەکانمان کە لە Rekar Group دروست کراون.
          </p>
        </div>
        <ProjectsExplorer categories={categories} projects={projects} />
      </div>
    </section>
  );
}

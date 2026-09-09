import type { Project } from "@/types/database";

import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({
  projects,
  loading = false,
}: {
  projects: Project[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="بارکردن">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="glass h-[31rem] animate-pulse rounded-[2rem] bg-white/[0.03]"
          />
        ))}
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="glass rounded-[2rem] px-6 py-16 text-center">
        <p className="text-lg font-semibold text-[#FBF7FF]">هیچ پڕۆژەیەک نەدۆزرایەوە</p>
        <p className="mt-2 text-sm text-[#C8ABD9]">گەڕان یان فلتەرەکەت بگۆڕە.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp } from "lucide-react";

import type { Project, ProjectCategory } from "@/types/database";

import { ProjectFilter } from "./ProjectFilter";
import { ProjectGrid } from "./ProjectGrid";
import { ProjectSearch } from "./ProjectSearch";

type SortValue = "newest" | "oldest" | "name";

function projectDate(project: Project) {
  const value = project.completion_date || project.created_at;
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function ProjectsExplorer({
  categories,
  projects,
}: {
  categories: ProjectCategory[];
  projects: Project[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    const filtered = projects.filter((project) => {
      if (project.status !== "published" || project.deleted_at) return false;
      if (category && project.category?.slug !== category) return false;
      if (!query) return true;

      return [
        project.name,
        project.subtitle,
        project.short_description,
        project.category?.name,
        ...(project.technologies?.map((technology) => technology.name) ?? []),
      ].some((value) => value?.toLocaleLowerCase().includes(query));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, ["ku", "en"]);
      return sort === "oldest" ? projectDate(a) - projectDate(b) : projectDate(b) - projectDate(a);
    });
  }, [category, projects, search, sort]);

  return (
    <div>
      <div className="glass mb-8 rounded-[2rem] p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <ProjectSearch value={search} onChange={setSearch} />
          <label className="relative flex min-w-52 items-center">
            <span className="sr-only">ڕیزکردن</span>
            <ArrowDownUp className="pointer-events-none absolute right-4 h-4 w-4 text-[#C8ABD9]" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="h-12 w-full appearance-none rounded-2xl border border-white/10 bg-[#190026] pr-11 pl-4 text-sm text-[#FBF7FF] outline-none transition focus:border-[#C878FF]/45"
            >
              <option value="newest">نوێترین</option>
              <option value="oldest">کۆنترین</option>
              <option value="name">ناو A-Z</option>
            </select>
          </label>
        </div>
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <ProjectFilter categories={categories} value={category} onChange={setCategory} />
        </div>
      </div>

      <motion.div
        key={`${category ?? "all"}-${search}-${sort}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-5 text-sm text-[#C8ABD9]">
          {visibleProjects.length} پڕۆژە
        </div>
        <ProjectGrid projects={visibleProjects} />
      </motion.div>
    </div>
  );
}

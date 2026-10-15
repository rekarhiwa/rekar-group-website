"use client";

import Image from "next/image";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { useMemo } from "react";

import { CmsIcon } from "@/components/public/icon-map";
import type { Project } from "@/types/database";

function ProjectIcon({ project }: { project: Project }) {
  if (project.icon?.startsWith("/") || project.icon?.startsWith("http")) {
    return (
      <Image
        src={project.icon}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-lg object-contain"
        unoptimized
      />
    );
  }

  return (
    <CmsIcon
      name={project.icon ?? undefined}
      fallback={Briefcase}
      className="h-4 w-4 text-light-violet"
    />
  );
}

function MarqueeItem({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="marquee-chip glass group flex shrink-0 items-center gap-2.5 !rounded-full"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.08] ring-1 ring-white/10">
        <ProjectIcon project={project} />
      </span>
      <span dir="auto" className="text-sm font-medium text-muted transition group-hover:text-foreground">
        {project.name}
      </span>
      <span className="text-white/20" aria-hidden>
        ·
      </span>
    </Link>
  );
}

export function ProjectMarquee({ projects }: { projects: Project[] }) {
  const loopProjects = useMemo(() => {
    if (!projects.length) return [];
    const minItems = 14;
    const copies = Math.max(3, Math.ceil(minItems / projects.length));
    return Array.from({ length: copies }, () => projects).flat();
  }, [projects]);

  if (!projects.length) return null;

  const halves = [loopProjects, loopProjects];

  return (
    <section
      className="glass-nav overflow-hidden border-y border-white/10 py-4"
      aria-label="پڕۆژەکانمان"
    >
      <div className="project-marquee group" dir="ltr">
        <div className="project-marquee-track">
          {halves.map((half, halfIndex) => (
            <div
              key={halfIndex}
              className="flex shrink-0 items-center gap-1 px-1"
              aria-hidden={halfIndex > 0}
            >
              {half.map((project, index) => (
                <MarqueeItem
                  key={`${halfIndex}-${project.id}-${index}`}
                  project={project}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

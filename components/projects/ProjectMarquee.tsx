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
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg object-contain"
      />
    );
  }

  return (
    <CmsIcon
      name={project.icon ?? undefined}
      fallback={Briefcase}
      className="h-5 w-5 text-[#C878FF]"
    />
  );
}

function MarqueeItem({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="glass flex shrink-0 items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold text-[#C8ABD9] transition hover:border-[#C878FF]/35 hover:text-white"
    >
      <ProjectIcon project={project} />
      <span dir="auto">{project.name}</span>
    </Link>
  );
}

export function ProjectMarquee({ projects }: { projects: Project[] }) {
  const loopProjects = useMemo(() => {
    if (!projects.length) return [];
    // Keep the strip wide enough for a seamless loop on large screens.
    const minItems = 12;
    const copies = Math.max(2, Math.ceil(minItems / projects.length));
    return Array.from({ length: copies }, () => projects).flat();
  }, [projects]);

  if (!projects.length) return null;

  // Two identical halves → animate exactly -50% with no visible jump.
  const halves = [loopProjects, loopProjects];

  return (
    <section
      className="overflow-hidden border-y border-white/[0.06] bg-[#190026]/45 py-5"
      aria-label="پڕۆژەکانمان"
    >
      <div className="project-marquee group" dir="ltr">
        <div className="project-marquee-track">
          {halves.map((half, halfIndex) => (
            <div
              key={halfIndex}
              className="flex shrink-0 items-center gap-4 px-2"
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

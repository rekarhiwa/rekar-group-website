import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";

import { CmsIcon } from "@/components/public/icon-map";
import type { Project } from "@/types/database";

import { ProjectExternalLinks } from "./ProjectExternalLinks";
import { TechnologyChip } from "./TechnologyChip";

function ProjectIcon({ project }: { project: Project }) {
  if (project.icon?.startsWith("/") || project.icon?.startsWith("http")) {
    return (
      <Image
        src={project.icon}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
      />
    );
  }

  return (
    <CmsIcon
      name={project.icon ?? undefined}
      fallback={Briefcase}
      className="h-8 w-8 text-[#C878FF]"
    />
  );
}

export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#190026]/70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(154,36,240,0.24),transparent_35%)]" />
      <div className="relative grid items-stretch lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <Link
            href="/projects"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm text-[#C878FF] transition hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            گەڕانەوە بۆ پڕۆژەکان
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/[0.05] p-3">
              <ProjectIcon project={project} />
            </div>
            {project.category?.name ? (
              <span className="rounded-full border border-[#C878FF]/25 bg-[#6F00B8]/10 px-4 py-1.5 text-xs font-semibold text-[#E7C5FF]">
                {project.category.name}
              </span>
            ) : null}
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-tight text-[#FBF7FF] sm:text-5xl lg:text-6xl">
            {project.name}
          </h1>
          {project.subtitle ? (
            <p className="mt-3 text-lg font-semibold text-[#C878FF]">{project.subtitle}</p>
          ) : null}
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#C8ABD9] sm:text-lg">
            {project.short_description || project.full_description}
          </p>

          {project.technologies?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <TechnologyChip key={technology.id} name={technology.name} />
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            <ProjectExternalLinks project={project} />
          </div>
        </div>

        <div className="relative min-h-80 overflow-hidden border-t border-white/10 lg:min-h-[36rem] lg:border-t-0 lg:border-r">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,120,255,0.3),transparent_28%),linear-gradient(145deg,#27003b,#100018)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#100018]/70 via-transparent to-transparent" />
        </div>
      </div>
    </header>
  );
}

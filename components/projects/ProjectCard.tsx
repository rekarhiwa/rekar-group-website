import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

import { CmsIcon } from "@/components/public/icon-map";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

import { TechnologyChip } from "./TechnologyChip";

function isImageSource(value?: string | null) {
  return Boolean(value && (value.startsWith("/") || value.startsWith("http")));
}

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const technologies = project.technologies?.slice(0, 4) ?? [];

  return (
    <article
      className={cn(
        "group glass relative flex h-full flex-col overflow-hidden rounded-[2rem] transition duration-500 hover:-translate-y-2 hover:border-[#C878FF]/45 hover:shadow-[0_24px_80px_rgba(111,0,184,0.28)]",
        className
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${project.name} ـ وردەکاری پڕۆژە`}
        className="absolute inset-0 z-10"
      />

      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.08] bg-[#190026]">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(154,36,240,0.42),transparent_42%),linear-gradient(135deg,#190026,#100018)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100018]/90 via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[#100018]/80 p-3 shadow-lg backdrop-blur">
            {isImageSource(project.icon) ? (
              <Image
                src={project.icon!}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            ) : (
              <CmsIcon
                name={project.icon ?? undefined}
                fallback={Briefcase}
                className="h-7 w-7 text-[#C878FF]"
              />
            )}
          </div>
          {project.category?.name ? (
            <span className="rounded-full border border-white/10 bg-[#100018]/70 px-3 py-1 text-xs text-[#E7C5FF] backdrop-blur">
              {project.category.name}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div>
          <h3 className="text-2xl font-bold text-[#FBF7FF]">{project.name}</h3>
          {project.subtitle ? (
            <p className="mt-1 text-sm font-medium text-[#C878FF]">{project.subtitle}</p>
          ) : null}
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#C8ABD9]">
            {project.short_description || project.full_description}
          </p>
        </div>

        {technologies.length ? (
          <div className="relative z-20 mt-5 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <TechnologyChip key={technology.id} name={technology.name} />
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center gap-2 pt-7 text-sm font-semibold text-[#FBF7FF]">
          وردەکاری پڕۆژە
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </div>
      </div>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";

function FeaturedLead({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded-[1.75rem] border border-border bg-background-secondary shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
    >
      <div className="relative aspect-[16/10] sm:aspect-[21/10]">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(154,36,240,0.42),transparent_42%),linear-gradient(135deg,#190026,#100018)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100018] via-[#100018]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
          <div className="glass-panel max-w-xl rounded-2xl p-5 sm:p-6">
            <p className="section-index mb-3 text-start">
              <span>Featured</span>
            </p>
            <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {project.name}
            </h3>
            {project.short_description || project.subtitle ? (
              <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">
                {project.short_description || project.subtitle}
              </p>
            ) : null}
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
              وردەکاری پڕۆژە
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProjects({
  title,
  subtitle,
  projects,
}: {
  title: string;
  subtitle?: string | null;
  projects: Project[];
}) {
  if (!projects.length) return null;

  const lead = projects[0];
  const side = projects.slice(1, 3);
  const rest = projects.slice(3, 6);

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index={2}
          eyebrow="کارەکان"
          title={title || "پڕۆژەکانمان"}
          subtitle={subtitle || "باشترین ناسنامەی کارمانن"}
          align="center"
        />

        <div className="space-y-6">
          <FeaturedLead project={lead} />

          {side.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {side.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}

          {rest.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild size="lg" variant="secondary" className="h-12 rounded-full px-8">
            <Link href="/projects">
              هەموو پڕۆژەکان
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

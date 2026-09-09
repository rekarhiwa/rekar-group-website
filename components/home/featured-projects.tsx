import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";

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

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="کارە هەڵبژێردراوەکان"
          title={title || "پڕۆژەکانمان"}
          subtitle={subtitle || "باشترین ناسنامەی کارمانن"}
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="secondary" size="lg">
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

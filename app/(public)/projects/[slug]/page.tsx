import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFeatureCard } from "@/components/projects/ProjectFeatureCard";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { TechnologyChip } from "@/components/projects/TechnologyChip";
import { RichContent } from "@/components/public/rich-content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  getPublishedProjectBySlug,
  getRelatedProjects,
} from "@/services/projects";
import type { ProjectFeature } from "@/types/database";

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return { title: "پڕۆژە نەدۆزرایەوە" };
  }

  return buildPageMetadata({
    title: project.seo_title || project.name,
    description: project.seo_description || project.short_description,
    image: project.og_image || project.cover_image,
    path: `/projects/${project.slug}`,
  });
}

function DetailSection({
  title,
  content,
}: {
  title: string;
  content?: string | null;
}) {
  if (!content) return null;

  return (
    <section className="glass rounded-[2rem] p-7 sm:p-8">
      <h2 className="text-2xl font-bold text-[#FBF7FF]">{title}</h2>
      <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#C8ABD9]">
        {content}
      </p>
    </section>
  );
}

export default async function ProjectDetailsPage(
  props: PageProps<"/projects/[slug]">
) {
  const { slug } = await props.params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) notFound();

  const relatedProjects = await getRelatedProjects(project);
  const featureItems: ProjectFeature[] =
    project.feature_items?.length
      ? project.feature_items
      : project.features.map((title, index) => ({
          id: `${project.id}-feature-${index}`,
          project_id: project.id,
          title,
          description: null,
          icon: "star",
          sort_order: index,
        }));

  return (
    <main className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute top-48 right-0 h-[30rem] w-[30rem] rounded-full bg-[#6F00B8]/15 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl space-y-16">
        <ProjectHero project={project} />

        <div className="grid gap-6 lg:grid-cols-2">
          <DetailSection title="دەربارەی پڕۆژە" content={project.full_description} />
          <DetailSection title="کێشەکە" content={project.challenge} />
          <DetailSection title="چارەسەر" content={project.solution} />
          <DetailSection title="ئەنجام" content={project.result} />
        </div>

        {featureItems.length ? (
          <section>
            <h2 className="text-3xl font-bold text-[#FBF7FF]">تایبەتمەندییەکان</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featureItems.map((feature) => (
                <ProjectFeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </section>
        ) : null}

        {project.technologies?.length ? (
          <section className="glass rounded-[2rem] p-7 sm:p-8">
            <h2 className="text-2xl font-bold text-[#FBF7FF]">
              تەکنەلۆژیا بەکارهاتووەکان
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.technologies.map((technology) => (
                <TechnologyChip
                  key={technology.id}
                  name={technology.name}
                  className="px-4 py-2 text-sm"
                />
              ))}
            </div>
          </section>
        ) : null}

        {project.case_study ? (
          <section className="glass rounded-[2rem] p-7 sm:p-8">
            <h2 className="text-2xl font-bold text-[#FBF7FF]">وردەکاری توێژینەوە</h2>
            <RichContent html={project.case_study} className="mt-6" />
          </section>
        ) : null}

        {project.images?.length ? (
          <section>
            <h2 className="text-3xl font-bold text-[#FBF7FF]">وێنەکانی پڕۆژە</h2>
            <div className="mt-7">
              <ProjectGallery images={project.images} />
            </div>
          </section>
        ) : null}

        {relatedProjects.length ? (
          <section>
            <h2 className="text-3xl font-bold text-[#FBF7FF]">
              پڕۆژە پەیوەندیدارەکان
            </h2>
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedProjects.map((relatedProject) => (
                <ProjectCard key={relatedProject.id} project={relatedProject} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

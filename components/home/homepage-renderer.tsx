import {
  getClients,
  getHeroSettings,
  getPosts,
  getProcessSteps,
  getServices,
  getStats,
  getTestimonials,
} from "@/services/content";
import {
  getFeaturedProjects,
  getMarqueeProjects,
} from "@/services/projects";
import type { HomepageSection } from "@/types/database";

import { ClientsSection } from "./clients-section";
import { CtaSection } from "./cta-section";
import { FeaturedProjects } from "./featured-projects";
import { HeroSection } from "./hero-section";
import { PostsSection } from "./posts-section";
import { ProcessSection } from "./process-section";
import { ProjectMarquee } from "./project-marquee";
import { ServicesSection } from "./services-section";
import { StatsSection } from "./stats-section";
import { TestimonialsSection } from "./testimonials-section";

function postsSettings(section: HomepageSection) {
  const settings = section.settings || {};
  const limit = Number(settings.limit ?? 3);
  return {
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 12) : 3,
    categoryId:
      typeof settings.category_id === "string" && settings.category_id
        ? settings.category_id
        : null,
    featuredOnly: Boolean(settings.featured_only),
  };
}

export async function HomepageRenderer({
  sections,
}: {
  sections: HomepageSection[];
}) {
  const postsSection = sections.find((s) => s.type === "posts" && s.enabled);
  const postsCfg = postsSection ? postsSettings(postsSection) : { limit: 3, categoryId: null, featuredOnly: false };

  const [
    hero,
    heroStats,
    stats,
    services,
    featuredProjects,
    marqueeProjects,
    posts,
    processSteps,
    clients,
    testimonials,
  ] = await Promise.all([
    getHeroSettings(),
    getStats(true),
    getStats(false),
    getServices(true),
    getFeaturedProjects(),
    getMarqueeProjects(),
    getPosts({
      limit: postsCfg.limit,
      publishedOnly: true,
      categoryId: postsCfg.categoryId,
      featuredOnly: postsCfg.featuredOnly,
    }),
    getProcessSteps(),
    getClients(),
    getTestimonials(),
  ]);

  return (
    <>
      {sections
        .filter((section) => section.enabled)
        .map((section) => {
          switch (section.type) {
            case "hero":
              return <HeroSection key={section.id} hero={hero} stats={heroStats} />;
            case "project_marquee":
              return <ProjectMarquee key={section.id} projects={marqueeProjects} />;
            case "services":
              return (
                <ServicesSection
                  key={section.id}
                  title={section.heading || "خزمەتگوزارییەکانمان"}
                  subtitle={section.subtitle}
                  services={services}
                />
              );
            case "featured_projects":
              return (
                <FeaturedProjects
                  key={section.id}
                  title={section.heading || "پڕۆژەکانمان"}
                  subtitle={section.subtitle || "باشترین ناسنامەی کارمانن"}
                  projects={featuredProjects}
                />
              );
            case "stats":
              return (
                <StatsSection
                  key={section.id}
                  title={section.heading || "ئامارەکانمان"}
                  subtitle={section.subtitle}
                  stats={stats}
                />
              );
            case "process":
              return (
                <ProcessSection
                  key={section.id}
                  title={section.heading || "شێوازی کارکردن"}
                  subtitle={section.subtitle}
                  steps={processSteps}
                />
              );
            case "clients":
              return (
                <ClientsSection
                  key={section.id}
                  title={section.heading || "کڕیارەکانمان"}
                  subtitle={section.subtitle}
                  clients={clients}
                />
              );
            case "posts":
              return (
                <PostsSection
                  key={section.id}
                  title={section.heading || "نوێترین زانیاری"}
                  subtitle={section.subtitle}
                  posts={posts}
                />
              );
            case "testimonials":
              return (
                <TestimonialsSection
                  key={section.id}
                  title={section.heading || "ڕای کڕیارەکان"}
                  subtitle={section.subtitle}
                  testimonials={testimonials}
                />
              );
            case "cta": {
              const buttonLabel =
                typeof section.settings.button_label === "string"
                  ? section.settings.button_label
                  : "پەیوەندی";
              const buttonUrl =
                typeof section.settings.button_url === "string"
                  ? section.settings.button_url
                  : "/contact";

              return (
                <CtaSection
                  key={section.id}
                  title={section.heading || "ئامادەیت بۆ دەستپێکردن؟"}
                  subtitle={section.subtitle}
                  buttonLabel={buttonLabel}
                  buttonUrl={buttonUrl}
                />
              );
            }
            default:
              return null;
          }
        })}
    </>
  );
}

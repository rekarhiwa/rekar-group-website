import { Code, ExternalLink, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";

export function ProjectExternalLinks({ project }: { project: Project }) {
  const links = [
    project.website_url
      ? { href: project.website_url, label: "بینینی سایت", icon: ExternalLink }
      : null,
    project.play_store_url
      ? { href: project.play_store_url, label: "Google Play", icon: Smartphone }
      : null,
    project.app_store_url
      ? { href: project.app_store_url, label: "App Store", icon: Smartphone }
      : null,
    project.github_url ? { href: project.github_url, label: "GitHub", icon: Code } : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: typeof ExternalLink;
  }[];

  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Button key={label} asChild variant="secondary">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <Icon className="h-4 w-4" />
            <span dir={label === "بینینی سایت" ? "rtl" : "ltr"}>{label}</span>
          </a>
        </Button>
      ))}
    </div>
  );
}

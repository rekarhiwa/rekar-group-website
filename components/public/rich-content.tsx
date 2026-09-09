import DOMPurify from "isomorphic-dompurify";

import { cn } from "@/lib/utils";

export function RichContent({
  html,
  className,
}: {
  html?: string | null;
  className?: string;
}) {
  if (!html) return null;

  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["iframe", "figure", "figcaption"],
    ADD_ATTR: [
      "class",
      "data-type",
      "allow",
      "allowfullscreen",
      "frameborder",
      "src",
      "target",
      "rel",
      "style",
    ],
  });

  return (
    <div
      className={cn("prose-cms max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

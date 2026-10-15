"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ALLOWED_ATTR = [
  "class",
  "data-type",
  "allow",
  "allowfullscreen",
  "frameborder",
  "src",
  "href",
  "target",
  "rel",
  "style",
  "alt",
  "title",
  "width",
  "height",
];

/** Lightweight SSR-safe fallback (admin CMS HTML only). */
function basicSanitize(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "$1=$2#$2");
}

export function RichContent({
  html,
  className,
}: {
  html?: string | null;
  className?: string;
}) {
  const [cleanHtml, setCleanHtml] = useState(() =>
    html ? basicSanitize(html) : ""
  );

  useEffect(() => {
    if (!html) {
      setCleanHtml("");
      return;
    }

    let cancelled = false;

    void import("dompurify").then((mod) => {
      if (cancelled) return;
      const DOMPurify = mod.default;
      setCleanHtml(
        DOMPurify.sanitize(html, {
          USE_PROFILES: { html: true },
          ADD_TAGS: ["iframe", "figure", "figcaption"],
          ADD_ATTR: ALLOWED_ATTR,
        })
      );
    });

    return () => {
      cancelled = true;
    };
  }, [html]);

  if (!html) return null;

  return (
    <div
      className={cn("prose-cms max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}

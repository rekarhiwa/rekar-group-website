"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types/database";

export function ProjectFilter({
  categories,
  value,
  onChange,
}: {
  categories: ProjectCategory[];
  value: string | null;
  onChange: (slug: string | null) => void;
}) {
  const items = [{ name: "هەموو", slug: null }, ...categories];

  return (
    <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full gap-2" role="tablist" aria-label="پۆلەکانی پڕۆژە">
        {items.map((item) => {
          const active = value === item.slug;
          return (
            <button
              key={item.slug ?? "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.slug)}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-full border px-5 py-2.5 text-sm font-semibold transition",
                active
                  ? "border-[#C878FF]/40 text-white"
                  : "border-white/10 bg-white/[0.03] text-[#C8ABD9] hover:border-[#C878FF]/25 hover:text-white"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="project-filter-active"
                  className="absolute inset-0 bg-gradient-to-l from-[#6F00B8] to-[#9A24F0]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type AdminTab = {
  id: string;
  label: string;
};

export function AdminSectionTabs({
  tabs,
  basePath,
  paramName = "tab",
}: {
  tabs: AdminTab[];
  basePath: string;
  paramName?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(paramName) || tabs[0]?.id;

  return (
    <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3" dir="rtl">
      {tabs.map((tab) => {
        const href =
          tab.id === tabs[0]?.id
            ? basePath
            : `${basePath}?${paramName}=${tab.id}`;
        const isActive = active === tab.id || (tab.id === tabs[0]?.id && !searchParams.get(paramName));
        return (
          <Link
            key={tab.id}
            href={href}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition",
              isActive
                ? "bg-primary/25 text-white ring-1 ring-primary/40"
                : "text-muted hover:bg-white/5 hover:text-white",
              pathname.startsWith(basePath) ? "" : ""
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

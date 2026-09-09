import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/types/database";

const styles: Record<ContentStatus, string> = {
  draft: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  published: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  archived: "border-slate-400/25 bg-slate-400/10 text-slate-200",
  scheduled: "border-sky-400/25 bg-sky-400/10 text-sky-200",
};

const labels: Record<ContentStatus, string> = {
  draft: "ڕەشنووس",
  published: "بڵاوکراوە",
  archived: "ئەرشیفکراو",
  scheduled: "پلاندانراو",
};

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ContentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}

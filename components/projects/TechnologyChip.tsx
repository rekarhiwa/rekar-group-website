import { cn } from "@/lib/utils";

export function TechnologyChip({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-chip",
        className
      )}
    >
      {name}
    </span>
  );
}

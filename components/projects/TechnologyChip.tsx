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
        "inline-flex items-center rounded-full border border-[#C878FF]/20 bg-[#6F00B8]/10 px-3 py-1 text-xs font-medium text-[#E7C5FF]",
        className
      )}
    >
      {name}
    </span>
  );
}

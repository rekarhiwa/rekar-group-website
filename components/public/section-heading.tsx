import { cn } from "@/lib/utils";

function formatSectionIndex(index?: number | string | null) {
  if (index === undefined || index === null || index === "") return null;
  if (typeof index === "number") return String(index).padStart(2, "0");
  return String(index);
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  subtitle,
  align = "start",
  className,
}: {
  eyebrow?: string;
  /** Numbered label like ArtCraft `01 /` — accepts 1 or "01" */
  index?: number | string | null;
  title: string;
  subtitle?: string | null;
  align?: "center" | "start";
  className?: string;
}) {
  const indexLabel = formatSectionIndex(index);

  return (
    <div
      className={cn(
        "mb-16 max-w-3xl space-y-5",
        align === "center" ? "mx-auto text-center" : "text-start",
        className
      )}
    >
      {indexLabel || eyebrow ? (
        <p className="section-index">
          {indexLabel ? <span>{indexLabel}</span> : null}
          {indexLabel && eyebrow ? <span className="section-index-sep">/</span> : null}
          {eyebrow ? <span>{eyebrow}</span> : null}
        </p>
      ) : null}
      <h2 className="text-[clamp(1.85rem,4vw,3.15rem)] font-semibold tracking-tight text-foreground leading-[1.15]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

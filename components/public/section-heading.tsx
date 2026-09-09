import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-14 max-w-3xl space-y-4",
        align === "center" ? "mx-auto text-center" : "text-start",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-sm text-[#C8ABD9]">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-base leading-8 text-[#C8ABD9] sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

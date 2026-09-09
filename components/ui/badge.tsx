import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  ...props
}: React.ComponentProps<"span"> & { variant?: "default" | "outline" | "success" | "warning" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium",
        "bg-primary/20 text-light-violet border border-primary/30",
        className
      )}
      {...props}
    />
  );
}

export { Badge };

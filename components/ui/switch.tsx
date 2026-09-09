"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root>) {
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-card",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow transition-transform data-[state=checked]:-translate-x-4 data-[state=unchecked]:-translate-x-0.5"
        )}
      />
    </SwitchPrimitives.Root>
  );
}

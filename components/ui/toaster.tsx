"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "light" ? "light" : "dark"}
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "glass border-border text-foreground",
        },
      }}
    />
  );
}

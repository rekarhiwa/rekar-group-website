"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ActionButton({
  action,
  children,
  variant = "outline",
  className,
}: {
  action: () => Promise<{ status: string; message: string }>;
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await action();
          if (result.status === "success") toast.success(result.message);
          else toast.error(result.message);
        })
      }
    >
      {pending ? "..." : children}
    </Button>
  );
}

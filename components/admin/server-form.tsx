"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { initialActionState, type ActionState } from "@/lib/admin/action-state";

export function ServerForm({
  action,
  className,
  children,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, initialActionState);

  useEffect(() => {
    if (state.status === "success" && state.message) toast.success(state.message);
    if (state.status === "error" && state.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
}

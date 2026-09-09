"use client";

import { useEffect } from "react";

export function UnsavedGuard({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);

  return null;
}

"use client";

import { useEffect } from "react";

export function TrackPostView({ postId }: { postId: string }) {
  useEffect(() => {
    const key = `post-viewed:${postId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch("/api/posts/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
  }, [postId]);

  return null;
}

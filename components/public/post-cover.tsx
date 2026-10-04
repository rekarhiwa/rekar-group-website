import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Post } from "@/types/database";

export function PostCover({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  if (post.cover_image) {
    return (
      <div className={cn("relative overflow-hidden bg-background-secondary", className)}>
        <Image
          src={post.cover_image}
          alt={post.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex overflow-hidden bg-background-secondary",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(154,36,240,0.45),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(111,0,184,0.35),transparent_40%),linear-gradient(145deg,#190026,#100018)]" />
      <div className="relative z-10 flex h-full w-full flex-col justify-between p-5">
        <span className="w-fit rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs text-[#E7C5FF] backdrop-blur">
          {post.category?.name || "پۆستەکان"}
        </span>
        <p className="max-w-[16rem] text-sm font-medium leading-6 text-white/80">
          {post.title}
        </p>
      </div>
    </div>
  );
}

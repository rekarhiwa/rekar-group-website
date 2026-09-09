"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { ProjectImage } from "@/types/database";

export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index === null ? null : (index + 1) % images.length));
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === null ? null : (index - 1 + images.length) % images.length
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length]);

  if (!images.length) return null;

  const activeImage = activeIndex === null ? null : images[activeIndex];
  const move = (direction: 1 | -1) => {
    setActiveIndex((index) =>
      index === null ? null : (index + direction + images.length) % images.length
    );
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#190026] text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C878FF]"
          >
            <Image
              src={image.image_url}
              alt={image.alt_text || image.caption || `وێنەی پڕۆژە ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            {image.caption ? (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-sm text-white">
                {image.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#100018]/95 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="گەلەری وێنەکان"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute top-5 left-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
            aria-label="داخستن"
          >
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  move(-1);
                }}
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white sm:right-6"
                aria-label="وێنەی پێشوو"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  move(1);
                }}
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white sm:left-6"
                aria-label="وێنەی دواتر"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            </>
          ) : null}

          <figure
            className="w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[75vh] w-full">
              <Image
                src={activeImage.image_url}
                alt={activeImage.alt_text || activeImage.caption || ""}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {activeImage.caption ? (
              <figcaption className="mt-3 text-center text-sm text-[#C8ABD9]">
                {activeImage.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </>
  );
}

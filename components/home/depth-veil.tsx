"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** Soft parallax veil used under homepage sections for depth continuity with the 3D hero. */
export function DepthVeil({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, 1, 1, 0.4]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none absolute -inset-x-10 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_center,rgba(154,36,240,0.18),transparent_70%)]"
      />
      {children}
    </div>
  );
}

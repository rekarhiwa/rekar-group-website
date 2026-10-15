"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { AtmosphereBg } from "@/components/home/atmosphere-bg";
import { CodeStage } from "@/components/home/code-stage";
import { Button } from "@/components/ui/button";
import type { HeroSettings, StatItem } from "@/types/database";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection({
  hero,
  stats: _stats,
}: {
  hero: HeroSettings;
  stats: StatItem[];
}) {
  const mission =
    [hero.heading, hero.highlighted_heading].filter(Boolean).join(" ") ||
    "تەکنەلۆجیا بەهێزتر بۆ داهاتوویەکی باشتر";

  return (
    <section className="relative overflow-hidden">
      <AtmosphereBg />

      <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-20 text-center sm:px-6 lg:px-8 lg:pb-14 lg:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="hero-brand"
        >
          ڕێکار گروپ
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease }}
          className="hero-display mx-auto mt-5 max-w-4xl text-foreground"
        >
          {mission}
        </motion.h1>

        {hero.description ? (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9"
          >
            {hero.description}
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          {hero.primary_button_label && hero.primary_button_url ? (
            <Button asChild size="lg" className="h-12 rounded-full px-8 shadow-none">
              <Link href={hero.primary_button_url}>{hero.primary_button_label}</Link>
            </Button>
          ) : null}
          {hero.secondary_button_label && hero.secondary_button_url ? (
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 rounded-full border-white/15 px-8"
            >
              <Link href={hero.secondary_button_url}>{hero.secondary_button_label}</Link>
            </Button>
          ) : null}
        </motion.div>
      </div>

      {hero.visual_enabled ? (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.38, ease }}
          className="relative w-full"
        >
          <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-6">
            <div className="overflow-hidden border-y border-white/10 shadow-[0_30px_100px_rgba(111,0,184,0.22)] sm:rounded-[1.75rem] sm:border sm:backdrop-blur-sm">
              <CodeStage />
            </div>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}

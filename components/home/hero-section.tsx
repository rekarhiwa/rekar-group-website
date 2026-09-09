"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { CodeStage } from "@/components/home/code-stage";
import { Button } from "@/components/ui/button";
import type { HeroSettings, StatItem } from "@/types/database";

export function HeroSection({
  hero,
  stats,
}: {
  hero: HeroSettings;
  stats: StatItem[];
}) {
  const mission = [hero.heading, hero.highlighted_heading].filter(Boolean).join(" ");

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        {/* Anthropic-style opening: label + mission */}
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm text-white/45">ڕێکار گروپ</p>
            <h1 className="mt-4 border-b border-white/15 pb-3 text-4xl font-semibold tracking-tight text-white/90 sm:text-5xl">
              products
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <p className="text-[clamp(1.65rem,3.4vw,2.6rem)] font-medium leading-[1.25] tracking-tight text-white">
              {mission || "تەکنەلۆجیا بەهێزتر بۆ داهاتوویەکی باشتر"}
            </p>
            {hero.description ? (
              <p className="max-w-2xl text-base leading-8 text-[#C8ABD9] sm:text-lg sm:leading-9">
                {hero.description}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {hero.primary_button_label && hero.primary_button_url ? (
                <Button asChild size="lg" className="h-11 rounded-full px-6 shadow-none">
                  <Link href={hero.primary_button_url}>{hero.primary_button_label}</Link>
                </Button>
              ) : null}
              {hero.secondary_button_label && hero.secondary_button_url ? (
                <Link
                  href={hero.secondary_button_url}
                  className="text-sm font-medium text-white underline-offset-4 hover:underline"
                >
                  {hero.secondary_button_label}
                </Link>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* Coding stage — Anthropic-like media panel */}
        {hero.visual_enabled ? (
          <div className="mt-16 lg:mt-20">
            <CodeStage />
          </div>
        ) : null}

        {hero.stats_enabled && stats.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-14 grid grid-cols-3 gap-6 border-t border-white/[0.08] pt-10"
          >
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="text-2xl font-semibold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-2 text-sm text-[#C8ABD9]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

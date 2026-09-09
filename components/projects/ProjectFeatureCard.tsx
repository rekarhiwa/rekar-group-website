import { Sparkles } from "lucide-react";

import { CmsIcon } from "@/components/public/icon-map";
import type { ProjectFeature } from "@/types/database";

export function ProjectFeatureCard({ feature }: { feature: ProjectFeature }) {
  return (
    <article className="glass rounded-2xl p-6 transition hover:border-[#C878FF]/30 hover:bg-white/[0.06]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C878FF]/20 bg-[#6F00B8]/15">
        <CmsIcon
          name={feature.icon ?? undefined}
          fallback={Sparkles}
          className="h-6 w-6 text-[#C878FF]"
        />
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#FBF7FF]">{feature.title}</h3>
      {feature.description ? (
        <p className="mt-2 text-sm leading-7 text-[#C8ABD9]">{feature.description}</p>
      ) : null}
    </article>
  );
}

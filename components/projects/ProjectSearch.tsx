"use client";

import { Search } from "lucide-react";

export function ProjectSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">گەڕان لە پڕۆژەکان</span>
      <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C8ABD9]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="گەڕان لە پڕۆژەکان..."
        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pr-11 pl-4 text-sm text-[#FBF7FF] outline-none transition placeholder:text-[#C8ABD9]/65 focus:border-[#C878FF]/45 focus:ring-2 focus:ring-[#6F00B8]/20"
      />
    </label>
  );
}

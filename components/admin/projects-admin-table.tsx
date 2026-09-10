"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/types/database";

const statusLabels: Record<string, string> = {
  draft: "ڕەشنووس",
  published: "بڵاوکراو",
  archived: "ئەرشیفکراو",
};

export function ProjectsAdminTable({ items, total, categories, page, pageSize }: { items: Project[]; total: number; categories: ProjectCategory[]; page: number; pageSize: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const query = useMemo(() => Object.fromEntries(["search", "status", "categoryId", "featured", "marquee", "sort"].map((key) => [key, searchParams.get(key) || ""])), [searchParams]);
  function setParams(values: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(values).forEach(([key, value]) => value && value !== "all" ? params.set(key, value) : params.delete(key));
    if (!("page" in values)) params.set("page", "1");
    router.push(`/admin/projects?${params}`);
  }
  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-white">پڕۆژەکان</h1><p className="text-sm text-muted">{total} پڕۆژە</p></div>
        <Button asChild><Link href="/admin/projects/new"><Plus className="h-4 w-4" /> پڕۆژەی نوێ</Link></Button>
      </div>
      <form className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-3 xl:grid-cols-7" onSubmit={(e) => {
        e.preventDefault(); const fd = new FormData(e.currentTarget);
        setParams(Object.fromEntries(["search", "status", "categoryId", "featured", "marquee", "sort"].map((key) => [key, String(fd.get(key) || "")])));
      }}>
        <div className="relative xl:col-span-2"><Search className="absolute right-3 top-3 h-4 w-4 text-muted" /><Input name="search" defaultValue={query.search} className="pr-10" placeholder="گەڕان..." /></div>
        <select name="categoryId" defaultValue={query.categoryId} className="h-11 rounded-xl border border-border bg-card px-3"><option value="">هەموو پۆلەکان</option>{categories.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <select name="status" defaultValue={query.status} className="h-11 rounded-xl border border-border bg-card px-3"><option value="all">هەموو دۆخەکان</option><option value="draft">ڕەشنووس</option><option value="published">بڵاوکراو</option><option value="archived">ئەرشیفکراو</option></select>
        <select name="featured" defaultValue={query.featured} className="h-11 rounded-xl border border-border bg-card px-3"><option value="">تایبەت: هەموو</option><option value="true">بەڵێ</option><option value="false">نەخێر</option></select>
        <select name="marquee" defaultValue={query.marquee} className="h-11 rounded-xl border border-border bg-card px-3"><option value="">مارکیو: هەموو</option><option value="true">بەڵێ</option><option value="false">نەخێر</option></select>
        <select name="sort" defaultValue={query.sort || "sort_order"} className="h-11 rounded-xl border border-border bg-card px-3"><option value="sort_order">ڕیزبەندی</option><option value="updated">نوێترین</option><option value="name">ناو</option></select>
        <Button type="submit" variant="secondary">فلتەر</Button>
      </form>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm"><thead className="bg-white/5 text-muted"><tr>{["ئایکۆن","ناو","پۆل","دۆخ","تایبەت","مارکیو","نوێکردنەوە","کردار"].map((x) => <th key={x} className="p-3 text-start">{x}</th>)}</tr></thead>
          <tbody>{items.map((project) => <tr key={project.id} className="border-t border-white/10">
            <td className="p-3">{project.icon ? <Image src={project.icon} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" unoptimized /> : "—"}</td>
            <td className="p-3"><Link className="font-medium text-white hover:text-light-violet" href={`/admin/projects/${project.id}/edit`}>{project.name}</Link></td>
            <td className="p-3 text-muted">{project.category?.name || "—"}</td><td className="p-3"><Badge>{statusLabels[project.status] || project.status}</Badge></td>
            <td className="p-3">{project.featured ? "✓" : "—"}</td><td className="p-3">{project.show_in_marquee ? "✓" : "—"}</td>
            <td className="p-3 text-muted">{formatDate(project.updated_at)}</td><td className="p-3"><Button asChild size="sm" variant="outline"><Link href={`/admin/projects/${project.id}/edit`}>دەستکاری</Link></Button></td>
          </tr>)}
          {!items.length ? <tr><td colSpan={8} className="p-10 text-center text-muted">هیچ پڕۆژەیەک نییە. یەکەم پڕۆژەت زیاد بکە.</td></tr> : null}</tbody>
        </table>
      </div>
      <div className="flex items-center justify-between"><span className="text-sm text-muted">پەڕە {page} لە {pages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setParams({ page: String(page - 1) })}>پێشوو</Button><Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setParams({ page: String(page + 1) })}>دواتر</Button></div></div>
    </div>
  );
}

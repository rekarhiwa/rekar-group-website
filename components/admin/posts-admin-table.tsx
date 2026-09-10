"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { bulkUpdatePostsAction } from "@/app/admin/actions/posts";
import { formatDate } from "@/lib/utils";
import type { Post, PostCategory } from "@/types/database";

const statusColors: Record<string, string> = {
  draft: "bg-white/10 text-muted",
  published: "bg-emerald-500/20 text-emerald-200",
  scheduled: "bg-amber-500/20 text-amber-100",
  archived: "bg-slate-500/20 text-slate-200",
};

const statusLabels: Record<string, string> = {
  draft: "ڕەشنووس",
  published: "بڵاوکراو",
  scheduled: "خشتەکراو",
  archived: "ئەرشیفکراو",
};

export function PostsAdminTable({
  items,
  total,
  categories,
  page,
  pageSize,
}: {
  items: Post[];
  total: number;
  categories: PostCategory[];
  page: number;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const query = useMemo(() => {
    return {
      search: searchParams.get("search") ?? "",
      status: searchParams.get("status") ?? "all",
      categoryId: searchParams.get("categoryId") ?? "",
      from: searchParams.get("from") ?? "",
      to: searchParams.get("to") ?? "",
      sort: searchParams.get("sort") ?? "updated_at_desc",
    };
  }, [searchParams]);

  function setParams(patch: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    });
    if (!("page" in patch)) params.set("page", "1");
    router.push(`/admin/posts?${params.toString()}`);
  }

  function toggleAll() {
    if (selected.length === items.length) setSelected([]);
    else setSelected(items.map((p) => p.id));
  }

  function runBulk(action: "publish" | "unpublish" | "archive" | "trash" | "feature" | "unfeature") {
    if (!selected.length) {
      toast.error("هیچ پۆستێک هەڵنەبژێردراوە");
      return;
    }
    startTransition(async () => {
      const result = await bulkUpdatePostsAction({ ids: selected, action });
      if (result.status === "error") toast.error(result.message);
      else {
        toast.success(result.message);
        setSelected([]);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">پۆستەکان</h2>
          <p className="text-sm text-muted">{total} پۆست</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4" />
            پۆستی نوێ
          </Link>
        </Button>
      </div>

      <form
        className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-2 xl:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setParams({
            search: String(fd.get("search") ?? ""),
            status: String(fd.get("status") ?? "all"),
            categoryId: String(fd.get("categoryId") ?? ""),
            from: String(fd.get("from") ?? ""),
            to: String(fd.get("to") ?? ""),
            sort: String(fd.get("sort") ?? "updated_at_desc"),
          });
        }}
      >
        <div className="relative xl:col-span-2">
          <Search className="pointer-events-none absolute top-3 right-3 h-4 w-4 text-muted" />
          <Input name="search" defaultValue={query.search} placeholder="گەڕان..." className="pr-10" />
        </div>
        <select
          name="status"
          defaultValue={query.status}
          className="h-11 rounded-xl border border-border bg-card px-3 text-sm"
        >
          <option value="all">هەموو دۆخەکان</option>
          <option value="draft">ڕەشنووس</option>
          <option value="published">بڵاوکراو</option>
          <option value="scheduled">خشتەکراو</option>
          <option value="archived">ئەرشیفکراو</option>
        </select>
        <select
          name="categoryId"
          defaultValue={query.categoryId}
          className="h-11 rounded-xl border border-border bg-card px-3 text-sm"
        >
          <option value="">هەموو پۆلەکان</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Input name="from" type="date" defaultValue={query.from} dir="ltr" />
        <Input name="to" type="date" defaultValue={query.to} dir="ltr" />
        <select
          name="sort"
          defaultValue={query.sort}
          className="h-11 rounded-xl border border-border bg-card px-3 text-sm xl:col-span-2"
        >
          <option value="updated_at_desc">نوێترین نوێکردنەوە</option>
          <option value="published_at_desc">نوێترین بڵاوکردنەوە</option>
          <option value="title_asc">ناونیشان</option>
          <option value="views_desc">زۆرترین بینین</option>
        </select>
        <Button type="submit" variant="secondary" className="xl:col-span-2">
          فلتەر
        </Button>
      </form>

      {selected.length ? (
        <div className="flex flex-wrap gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-3">
          <span className="text-sm text-white">{selected.length} هەڵبژێردراو</span>
          <Button size="sm" variant="secondary" disabled={pending} onClick={() => runBulk("publish")}>
            بڵاوکردنەوە
          </Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => runBulk("unpublish")}>
            هەڵوەشاندنی بڵاوکردنەوە
          </Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => runBulk("archive")}>
            ئەرشیف
          </Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => runBulk("feature")}>
            تایبەت
          </Button>
          <Button size="sm" variant="destructive" disabled={pending} onClick={() => runBulk("trash")}>
            زبڵ
          </Button>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-muted">
            <tr>
              <th className="p-3 text-start">
                <input
                  type="checkbox"
                  checked={items.length > 0 && selected.length === items.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="p-3 text-start">ناونیشان</th>
              <th className="p-3 text-start">پۆل</th>
              <th className="p-3 text-start">نووسەر</th>
              <th className="p-3 text-start">دۆخ</th>
              <th className="p-3 text-start">بڵاوکراو</th>
              <th className="p-3 text-start">بینین</th>
              <th className="p-3 text-start">نوێکراوەتەوە</th>
            </tr>
          </thead>
          <tbody>
            {items.map((post) => (
              <tr key={post.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(post.id)}
                    onChange={() =>
                      setSelected((prev) =>
                        prev.includes(post.id)
                          ? prev.filter((id) => id !== post.id)
                          : [...prev, post.id]
                      )
                    }
                  />
                </td>
                <td className="p-3">
                  <Link href={`/admin/posts/${post.id}`} className="font-medium text-white hover:text-light-violet">
                    {post.title}
                  </Link>
                  {post.featured ? (
                    <Badge className="ms-2">تایبەت</Badge>
                  ) : null}
                </td>
                <td className="p-3 text-muted">{post.category?.name || "—"}</td>
                <td className="p-3 text-muted">
                  {post.author?.full_name || post.author?.email || "—"}
                </td>
                <td className="p-3">
                  <span className={`rounded-lg px-2 py-1 text-xs ${statusColors[post.status] || ""}`}>
                    {statusLabels[post.status] || post.status}
                  </span>
                </td>
                <td className="p-3 text-muted">
                  {post.published_at ? formatDate(post.published_at) : "—"}
                </td>
                <td className="p-3 text-muted">{post.view_count ?? 0}</td>
                <td className="p-3 text-muted">
                  {post.updated_at ? formatDate(post.updated_at) : "—"}
                </td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted">
                  هیچ پۆستێک نەدۆزرایەوە
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          پەڕە {page} لە {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setParams({ page: String(page - 1) })}
          >
            پێشوو
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setParams({ page: String(page + 1) })}
          >
            دواتر
          </Button>
        </div>
      </div>
    </div>
  );
}

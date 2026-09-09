import { Suspense } from "react";
import { PostsAdminTable } from "@/components/admin/posts-admin-table";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { isAdminDemoMode } from "@/lib/admin/data";
import { getAdminPosts, getPostFormOptions } from "@/services/posts";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 20;

  const [{ items, total }, { categories }] = await Promise.all([
    getAdminPosts({
      search: typeof params.search === "string" ? params.search : undefined,
      status: typeof params.status === "string" ? params.status : undefined,
      categoryId: typeof params.categoryId === "string" ? params.categoryId : undefined,
      from: typeof params.from === "string" ? params.from : undefined,
      to: typeof params.to === "string" ? params.to : undefined,
      sort: typeof params.sort === "string" ? params.sort : undefined,
      page,
      pageSize,
    }),
    getPostFormOptions(),
  ]);

  return (
    <div className="space-y-4">
      {isAdminDemoMode() ? <ReadonlyBanner demoMode /> : null}
      <Suspense fallback={<div className="text-muted">بارکردن...</div>}>
        <PostsAdminTable
          items={items}
          total={total}
          categories={categories}
          page={page}
          pageSize={pageSize}
        />
      </Suspense>
    </div>
  );
}

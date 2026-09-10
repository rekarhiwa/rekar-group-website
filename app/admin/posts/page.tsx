import { Suspense } from "react";
import { AdminSectionTabs } from "@/components/admin/admin-section-tabs";
import { PostsAdminTable } from "@/components/admin/posts-admin-table";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { ActionButton } from "@/components/admin/action-button";
import { ServerForm } from "@/components/admin/server-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  deletePostCategoryAction,
  savePostCategoryAction,
} from "@/app/admin/actions/categories";
import { deleteTagAction, saveTagAction } from "@/app/admin/actions/tags";
import { getCategoriesData, isAdminDemoMode } from "@/lib/admin/data";
import { getAdminPosts, getPostFormOptions } from "@/services/posts";

const tabs = [
  { id: "list", label: "پۆستەکان" },
  { id: "categories", label: "پۆلەکان" },
  { id: "tags", label: "تاگەکان" },
];

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tab = typeof params.tab === "string" ? params.tab : "list";
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 20;
  const demoMode = isAdminDemoMode();

  const [{ items, total }, formOptions, taxonomy] = await Promise.all([
    tab === "list"
      ? getAdminPosts({
          search: typeof params.search === "string" ? params.search : undefined,
          status: typeof params.status === "string" ? params.status : undefined,
          categoryId: typeof params.categoryId === "string" ? params.categoryId : undefined,
          from: typeof params.from === "string" ? params.from : undefined,
          to: typeof params.to === "string" ? params.to : undefined,
          sort: typeof params.sort === "string" ? params.sort : undefined,
          page,
          pageSize,
        })
      : Promise.resolve({ items: [], total: 0 }),
    getPostFormOptions(),
    tab === "categories" || tab === "tags"
      ? getCategoriesData()
      : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-4">
      {demoMode ? <ReadonlyBanner demoMode /> : null}
      <Suspense fallback={null}>
        <AdminSectionTabs tabs={tabs} basePath="/admin/posts" />
      </Suspense>

      {tab === "list" ? (
        <Suspense fallback={<div className="text-muted">بارکردن...</div>}>
          <PostsAdminTable
            items={items}
            total={total}
            categories={formOptions.categories}
            page={page}
            pageSize={pageSize}
          />
        </Suspense>
      ) : null}

      {tab === "categories" ? (
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">پۆلەکانی پۆست</h2>
          <ServerForm action={savePostCategoryAction} className="mb-6 grid gap-4 md:grid-cols-3">
            <input type="hidden" name="id" value="" />
            <Input name="name" placeholder="ناو" className="border-white/10 bg-[#160021]" />
            <Input name="slug" placeholder="slug" dir="ltr" className="border-white/10 bg-[#160021]" />
            <Button type="submit" disabled={demoMode}>
              پاشەکەوتکردن
            </Button>
          </ServerForm>
          <div className="space-y-3">
            {(taxonomy?.postCategories ?? formOptions.categories).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
              >
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-sm text-muted" dir="ltr">
                    {item.slug}
                  </p>
                </div>
                <ActionButton
                  action={() => deletePostCategoryAction(item.id)}
                  variant="destructive"
                >
                  سڕینەوە
                </ActionButton>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {tab === "tags" ? (
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">تاگەکان</h2>
          <ServerForm action={saveTagAction} className="mb-6 grid gap-4 md:grid-cols-3">
            <input type="hidden" name="id" value="" />
            <Input name="name" placeholder="ناو" className="border-white/10 bg-[#160021]" />
            <Input name="slug" placeholder="slug" dir="ltr" className="border-white/10 bg-[#160021]" />
            <Button type="submit" disabled={demoMode}>
              پاشەکەوتکردن
            </Button>
          </ServerForm>
          <div className="space-y-3">
            {(formOptions.tags ?? []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
              >
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-sm text-muted" dir="ltr">
                    {item.slug}
                  </p>
                </div>
                <ActionButton action={() => deleteTagAction(item.id)} variant="destructive">
                  سڕینەوە
                </ActionButton>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

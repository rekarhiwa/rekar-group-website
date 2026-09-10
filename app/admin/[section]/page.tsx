import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { InlineCollectionManager } from "@/components/admin/inline-collection-manager";
import { MessageManager } from "@/components/admin/message-manager";
import { ServerForm } from "@/components/admin/server-form";
import { ActionButton } from "@/components/admin/action-button";
import { AdminSectionTabs } from "@/components/admin/admin-section-tabs";
import {
  SettingsActivityPanel,
  SettingsMediaPanel,
  SettingsNavigationPanel,
  SettingsSitePanels,
  SettingsTrashPanel,
  SettingsUsersPanel,
} from "@/components/admin/settings-hub-panels";
import {
  getCategoriesData,
  getCollectionRecords,
  getMessagesData,
  isAdminDemoMode,
  getSectionConfig,
} from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";
import { saveClientAction, deleteClientAction } from "@/app/admin/actions/clients";
import {
  saveTestimonialAction,
  deleteTestimonialAction,
} from "@/app/admin/actions/testimonials";
import { saveProcessAction, deleteProcessAction } from "@/app/admin/actions/process";
import { saveStatAction, deleteStatAction } from "@/app/admin/actions/stats";
import {
  saveProjectCategoryAction,
  savePostCategoryAction,
  deleteProjectCategoryAction,
  deletePostCategoryAction,
} from "@/app/admin/actions/categories";
import { saveTagAction, deleteTagAction } from "@/app/admin/actions/tags";
import {
  updateMessageStateAction,
  deleteMessageAction,
} from "@/app/admin/actions/messages";

const mergedSectionRedirects: Record<string, string> = {
  categories: "/admin/posts?tab=categories",
  tags: "/admin/posts?tab=tags",
  clients: "/admin/content?tab=clients",
  testimonials: "/admin/content?tab=testimonials",
  process: "/admin/content?tab=process",
  stats: "/admin/content?tab=stats",
  navigation: "/admin/settings?tab=navigation",
  media: "/admin/settings?tab=media",
  users: "/admin/settings?tab=users",
  activity: "/admin/settings?tab=activity",
  trash: "/admin/settings?tab=trash",
};

const settingsTabs = [
  { id: "site", label: "سایت" },
  { id: "navigation", label: "گەشتکردن" },
  { id: "media", label: "میدیا" },
  { id: "users", label: "بەکارهێنەران" },
  { id: "activity", label: "چالاکی" },
  { id: "trash", label: "زبڵ" },
];

const inlineActions = {
  clients: { save: saveClientAction, remove: deleteClientAction },
  testimonials: { save: saveTestimonialAction, remove: deleteTestimonialAction },
  process: { save: saveProcessAction, remove: deleteProcessAction },
  stats: { save: saveStatAction, remove: deleteStatAction },
  tags: { save: saveTagAction, remove: deleteTagAction },
} as const;

function statusLabel(status: unknown) {
  const value = String(status ?? "");
  if (value === "draft") return "ڕەشنووس";
  if (value === "published") return "بڵاوکراوە";
  if (value === "archived") return "ئەرشیفکراو";
  if (value === "scheduled") return "خشتەکراو";
  return value || "-";
}

export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { section } = await params;
  const sp = await searchParams;

  if (mergedSectionRedirects[section]) {
    redirect(mergedSectionRedirects[section]);
  }

  const config = getSectionConfig(section);
  const demoMode = isAdminDemoMode();
  if (!config || section === "home") notFound();

  if (section === "settings") {
    const tab = typeof sp.tab === "string" ? sp.tab : "site";
    const known = settingsTabs.some((t) => t.id === tab);
    if (!known) redirect("/admin/settings");

    return (
      <div className="space-y-4">
        {demoMode ? <ReadonlyBanner demoMode /> : null}
        <div>
          <h1 className="text-2xl font-bold text-white">ڕێکخستنەکان</h1>
          <p className="text-sm text-muted">سایت، گەشتکردن، میدیا و بەڕێوەبردن لە یەک شوێن</p>
        </div>
        <Suspense fallback={null}>
          <AdminSectionTabs tabs={settingsTabs} basePath="/admin/settings" />
        </Suspense>
        {tab === "site" ? <SettingsSitePanels /> : null}
        {tab === "navigation" ? <SettingsNavigationPanel /> : null}
        {tab === "media" ? <SettingsMediaPanel /> : null}
        {tab === "users" ? <SettingsUsersPanel /> : null}
        {tab === "activity" ? <SettingsActivityPanel /> : null}
        {tab === "trash" ? <SettingsTrashPanel /> : null}
      </div>
    );
  }

  if (config.mode === "detail-collection") {
    const rows = await getCollectionRecords(section);
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={demoMode} />
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">{config.title}</h2>
            <p className="text-sm text-muted">{config.description}</p>
          </div>
          <Button asChild>
            <Link href={`/admin/${section}/new`}>بڕگەی نوێ</Link>
          </Button>
        </div>
        <Card className="border-white/10 bg-white/[0.03] p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted">
                  <th className="px-4 py-3">ناونیشان</th>
                  <th className="px-4 py-3">دۆخ</th>
                  <th className="px-4 py-3">نوێکراوەتەوە</th>
                  <th className="px-4 py-3">کردار</th>
                </tr>
              </thead>
              <tbody>
                {(rows as unknown as Record<string, unknown>[]).map((row) => (
                  <tr key={String(row.id)} className="border-b border-white/5">
                    <td className="px-4 py-3 text-white">
                      {String(row.title ?? row.name ?? "بێ ناونیشان")}
                    </td>
                    <td className="px-4 py-3 text-white">{statusLabel(row.status)}</td>
                    <td className="px-4 py-3 text-muted">
                      {row.updated_at ? formatDate(String(row.updated_at)) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/admin/${section}/${String(row.id)}`}>دەستکاری</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  if (config.mode === "inline-collection") {
    const rows = await getCollectionRecords(section);
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={demoMode} />
        <InlineCollectionManager
          title={config.title}
          description={config.description}
          fields={config.fields ?? []}
          items={rows as unknown as Record<string, unknown>[]}
          saveAction={inlineActions[section as keyof typeof inlineActions].save}
          deleteAction={inlineActions[section as keyof typeof inlineActions].remove}
          demoMode={demoMode}
        />
      </div>
    );
  }

  if (config.mode === "categories") {
    const data = await getCategoriesData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">پۆلەکانی پڕۆژە</h2>
            <ServerForm action={saveProjectCategoryAction} className="mb-6 grid gap-4">
              <input type="hidden" name="id" value="" />
              <Input name="name" placeholder="ئەپەکان" className="border-white/10 bg-[#160021]" />
              <Input name="slug" placeholder="apps" className="border-white/10 bg-[#160021]" />
              <Input name="sort_order" type="number" className="border-white/10 bg-[#160021]" />
              <Button type="submit" disabled={data.demoMode}>
                پاشەکەوتکردنی پۆلی پڕۆژە
              </Button>
            </ServerForm>
            <div className="space-y-3">
              {data.projectCategories.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
                >
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-sm text-muted">{item.slug}</p>
                  </div>
                  <ActionButton
                    action={() => deleteProjectCategoryAction(item.id)}
                    variant="destructive"
                  >
                    سڕینەوە
                  </ActionButton>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">پۆلەکانی پۆست</h2>
            <ServerForm action={savePostCategoryAction} className="mb-6 grid gap-4">
              <input type="hidden" name="id" value="" />
              <Input name="name" placeholder="تەکنەلۆجیا" className="border-white/10 bg-[#160021]" />
              <Input name="slug" placeholder="technology" className="border-white/10 bg-[#160021]" />
              <Button type="submit" disabled={data.demoMode}>
                پاشەکەوتکردنی پۆلی پۆست
              </Button>
            </ServerForm>
            <div className="space-y-3">
              {data.postCategories.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
                >
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-sm text-muted">{item.slug}</p>
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
        </div>
      </div>
    );
  }

  if (config.mode === "messages") {
    const data = await getMessagesData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <MessageManager
          items={data.items}
          updateAction={updateMessageStateAction}
          deleteAction={deleteMessageAction}
        />
      </div>
    );
  }

  notFound();
}

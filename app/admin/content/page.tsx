import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminSectionTabs } from "@/components/admin/admin-section-tabs";
import { InlineCollectionManager } from "@/components/admin/inline-collection-manager";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import {
  deleteClientAction,
  saveClientAction,
} from "@/app/admin/actions/clients";
import {
  deleteProcessAction,
  saveProcessAction,
} from "@/app/admin/actions/process";
import {
  deleteStatAction,
  saveStatAction,
} from "@/app/admin/actions/stats";
import {
  deleteTestimonialAction,
  saveTestimonialAction,
} from "@/app/admin/actions/testimonials";
import {
  getCollectionRecords,
  getSectionConfig,
  isAdminDemoMode,
} from "@/lib/admin/data";

const tabs = [
  { id: "clients", label: "کڕیارەکان" },
  { id: "testimonials", label: "شایەتحاڵییەکان" },
  { id: "process", label: "پرۆسە" },
  { id: "stats", label: "ئامارەکان" },
];

const actions = {
  clients: { save: saveClientAction, remove: deleteClientAction },
  testimonials: { save: saveTestimonialAction, remove: deleteTestimonialAction },
  process: { save: saveProcessAction, remove: deleteProcessAction },
  stats: { save: saveStatAction, remove: deleteStatAction },
} as const;

export default async function ContentHubPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tab = typeof params.tab === "string" ? params.tab : "clients";
  if (!tabs.some((t) => t.id === tab)) redirect("/admin/content?tab=clients");

  const config = getSectionConfig(tab);
  const demoMode = isAdminDemoMode();
  const rows = await getCollectionRecords(tab);
  const pair = actions[tab as keyof typeof actions];

  return (
    <div className="space-y-4">
      {demoMode ? <ReadonlyBanner demoMode /> : null}
      <div>
        <h1 className="text-2xl font-bold text-white">ناوەڕۆک</h1>
        <p className="text-sm text-muted">کڕیار، شایەتحاڵی، پرۆسە و ئامار لە یەک شوێن</p>
      </div>
      <Suspense fallback={null}>
        <AdminSectionTabs tabs={tabs} basePath="/admin/content" />
      </Suspense>
      {config && pair ? (
        <InlineCollectionManager
          title={config.title}
          description={config.description}
          fields={config.fields ?? []}
          items={rows as unknown as Record<string, unknown>[]}
          saveAction={pair.save}
          deleteAction={pair.remove}
          demoMode={demoMode}
        />
      ) : null}
    </div>
  );
}

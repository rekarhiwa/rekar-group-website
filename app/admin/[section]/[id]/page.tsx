import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { EntityForm } from "@/components/admin/entity-form";
import {
  getFormSelectOptions,
  getSectionConfig,
  getSettingsData,
  getSingleRecord,
  isAdminDemoMode,
} from "@/lib/admin/data";
import { saveServiceAction } from "@/app/admin/actions/services";
import { saveProjectAction } from "@/app/admin/actions/projects";
import { savePostAction } from "@/app/admin/actions/posts";
import { savePageAction } from "@/app/admin/actions/pages";

const detailActions = {
  services: saveServiceAction,
  projects: saveProjectAction,
  posts: savePostAction,
  pages: savePageAction,
} as const;

export default async function AdminSectionDetailPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section, id } = await params;
  const demoMode = isAdminDemoMode();

  if (section === "settings" && id === "footer") {
    const data = await getSettingsData();
    return (
      <div className="space-y-6">
        <ReadonlyBanner demoMode={data.demoMode} />
        <Card className="border-white/10 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">ڕێکخستنەکانی فووتەر</h2>
          <p className="mb-4 text-sm text-muted">
            وەسفی فووتەر، زانیاری پەیوەندی، و بەستەرە کۆمەڵایەتییەکان لە ڕێکخستنەکان و گەشتکردن دێن.
          </p>
          <div className="space-y-3">
            <p className="rounded-2xl border border-white/10 p-4 text-white">
              {data.site.footer_description ?? "هێشتا وەسفی فووتەر نییە."}
            </p>
            <div className="flex gap-3">
              <Button asChild variant="secondary">
                <Link href="/admin/settings">ڕێکخستنەکانی سایت</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/navigation">بەستەرەکانی فووتەر</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const config = getSectionConfig(section);
  if (!config || config.mode !== "detail-collection") notFound();

  const record = await getSingleRecord(section, id);
  const selectOptions = await getFormSelectOptions(section);
  if (!record) notFound();

  return (
    <div className="space-y-6">
      <ReadonlyBanner demoMode={demoMode} />
      <EntityForm
        title={id === "new" ? "بڕگەی نوێ" : "دەستکاری"}
        description={config.description}
        fields={config.fields ?? []}
        record={record as Record<string, unknown>}
        selectOptions={selectOptions as Record<string, { label: string; value: string }[]>}
        saveAction={detailActions[section as keyof typeof detailActions]}
        backHref={`/admin/${section}`}
        demoMode={demoMode}
      />
    </div>
  );
}

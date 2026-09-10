import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { HomepageSectionsManager } from "@/components/admin/homepage-sections-manager";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { ServerForm } from "@/components/admin/server-form";
import { getHomepageAdminData } from "@/lib/admin/data";
import { saveHeroSettingsAction } from "@/app/admin/actions/homepage";
import { getPostFormOptions } from "@/services/posts";

export default async function AdminHomePage() {
  const [{ sections, hero, demoMode }, { categories }] = await Promise.all([
    getHomepageAdminData(),
    getPostFormOptions(),
  ]);

  return (
    <div className="space-y-6">
      <ReadonlyBanner demoMode={demoMode} />
      <HomepageSectionsManager
        initialSections={sections}
        demoMode={demoMode}
        postCategories={categories}
      />

      <Card className="border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white">ڕێکخستنەکانی هیرۆ</h2>
          <p className="text-sm text-muted">دەستکاریکردنی نووسین و دوگمەکانی هیرۆی سەرەکی ماڵەوە.</p>
        </div>
        <ServerForm action={saveHeroSettingsAction} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label className="mb-2 block">نیشانە</Label>
              <Input name="badge" defaultValue={hero?.badge ?? ""} className="border-white/10 bg-[#160021]" />
            </div>
            <div>
              <Label className="mb-2 block">سەردێڕ</Label>
              <Input name="heading" defaultValue={hero?.heading ?? ""} className="border-white/10 bg-[#160021]" />
            </div>
            <div>
              <Label className="mb-2 block">سەردێڕی هایلایتکراو</Label>
              <Input
                name="highlighted_heading"
                defaultValue={hero?.highlighted_heading ?? ""}
                className="border-white/10 bg-[#160021]"
              />
            </div>
            <div>
              <Label className="mb-2 block">ناوی دوگمەی سەرەکی</Label>
              <Input
                name="primary_button_label"
                defaultValue={hero?.primary_button_label ?? ""}
                className="border-white/10 bg-[#160021]"
              />
            </div>
            <div>
              <Label className="mb-2 block">بەستەری دوگمەی سەرەکی</Label>
              <Input
                name="primary_button_url"
                defaultValue={hero?.primary_button_url ?? ""}
                className="border-white/10 bg-[#160021]"
              />
            </div>
            <div>
              <Label className="mb-2 block">ناوی دوگمەی لاوەکی</Label>
              <Input
                name="secondary_button_label"
                defaultValue={hero?.secondary_button_label ?? ""}
                className="border-white/10 bg-[#160021]"
              />
            </div>
            <div>
              <Label className="mb-2 block">بەستەری دوگمەی لاوەکی</Label>
              <Input
                name="secondary_button_url"
                defaultValue={hero?.secondary_button_url ?? ""}
                className="border-white/10 bg-[#160021]"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-2 block">وەسف</Label>
              <Textarea
                name="description"
                defaultValue={hero?.description ?? ""}
                className="min-h-32 border-white/10 bg-[#160021]"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#160021] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">بینین چالاکە</span>
                <Switch name="visual_enabled" defaultChecked={hero?.visual_enabled ?? true} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#160021] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">ئامارەکان چالاکن</span>
                <Switch name="stats_enabled" defaultChecked={hero?.stats_enabled ?? true} />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={demoMode}>
              پاشەکەوتکردنی هیرۆ
            </Button>
          </div>
        </ServerForm>
      </Card>
    </div>
  );
}

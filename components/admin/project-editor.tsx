"use client";
/* eslint-disable react-hooks/incompatible-library -- react-hook-form watch is intentional */

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Archive, Eye, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveProjectAction, trashProjectAction } from "@/app/admin/actions/projects";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ProjectFeaturesEditor, type ProjectFeatureDraft } from "@/components/admin/project-features-editor";
import { ProjectGalleryManager, type GalleryDraft } from "@/components/admin/project-gallery-manager";
import { ProjectImageUploader } from "@/components/admin/project-image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/utils";
import type { Project, ProjectCategory, Technology } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "ناوی پڕۆژە پێویستە"),
  slug: z.string(),
  subtitle: z.string(),
  short_description: z.string().max(500),
  full_description: z.string(),
  category_id: z.string(),
  client_name: z.string(),
  completion_date: z.string(),
  challenge: z.string(),
  solution: z.string(),
  result: z.string(),
  case_study: z.string(),
  platforms: z.string(),
  website_url: z.string(),
  play_store_url: z.string(),
  app_store_url: z.string(),
  github_url: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  og_image: z.string(),
  sort_order: z.string(),
  status: z.string(),
});
type Fields = z.infer<typeof schema>;
const section = "glass space-y-4 rounded-2xl p-5";

const statusLabels: Record<string, string> = {
  draft: "ڕەشنووس",
  published: "بڵاوکراو",
  archived: "ئەرشیفکراو",
};

export function ProjectEditor({ project, categories, technologies }: { project?: Project | null; categories: ProjectCategory[]; technologies: Technology[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [icon, setIcon] = useState(project?.icon || "");
  const [cover, setCover] = useState(project?.cover_image || "");
  const [featured, setFeatured] = useState(Boolean(project?.featured));
  const [marquee, setMarquee] = useState(Boolean(project?.show_in_marquee));
  const [technologyIds, setTechnologyIds] = useState((project?.technologies || []).map((x) => x.id));
  const [features, setFeatures] = useState<ProjectFeatureDraft[]>((project?.feature_items || []).map((x) => ({ id: x.id, title: x.title, description: x.description || "", icon: x.icon || "" })));
  const [gallery, setGallery] = useState<GalleryDraft[]>((project?.images || []).map((x) => ({ id: x.id, image_url: x.image_url, alt_text: x.alt_text || "", caption: x.caption || "" })));
  const form = useForm<Fields>({ resolver: zodResolver(schema), defaultValues: {
    name: project?.name || "", slug: project?.slug || "", subtitle: project?.subtitle || "", short_description: project?.short_description || "", full_description: project?.full_description || "",
    category_id: project?.category_id || "", client_name: project?.client_name || "", completion_date: project?.completion_date || "", challenge: project?.challenge || "", solution: project?.solution || "",
    result: project?.result || "", case_study: project?.case_study || "", platforms: (project?.platforms || []).join(", "), website_url: project?.website_url || "", play_store_url: project?.play_store_url || "",
    app_store_url: project?.app_store_url || "", github_url: project?.github_url || "", seo_title: project?.seo_title || "", seo_description: project?.seo_description || "", og_image: project?.og_image || "",
    sort_order: String(project?.sort_order || 0), status: project?.status || "draft",
  }});

  function submit(intent: string) {
    void form.handleSubmit((values) => startTransition(async () => {
      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => data.set(key, value));
      data.set("id", project?.id || ""); data.set("intent", intent); data.set("icon", icon); data.set("cover_image", cover);
      data.set("featured", String(featured)); data.set("show_in_marquee", String(marquee)); data.set("technology_ids", technologyIds.join(","));
      data.set("features_json", JSON.stringify(features.map((x, sort_order) => ({ ...x, sort_order }))));
      data.set("gallery_json", JSON.stringify(gallery.map((x, sort_order) => ({ ...x, sort_order }))));
      const result = await saveProjectAction(undefined, data);
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      if (result.id && !project?.id) router.replace(`/admin/projects/${result.id}/edit`);
      else router.refresh();
    }))();
  }
  async function trash() {
    if (!project?.id) return;
    const result = await trashProjectAction(project.id);
    if (result.status === "error") toast.error(result.message);
    else {
      toast.success(result.message);
      router.push("/admin/projects");
    }
  }
  const field = (name: keyof Fields, label: string, textarea = false, dir?: "ltr") => <div><Label className="mb-2 block">{label}</Label>{textarea ? <Textarea {...form.register(name)} dir={dir} /> : <Input {...form.register(name)} dir={dir} />}</div>;
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-white">{project ? "دەستکاری پڕۆژە" : "پڕۆژەی نوێ"}</h1><p className="text-sm text-muted">دۆخ: {statusLabels[form.watch("status")] || form.watch("status")}</p></div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" disabled={pending} onClick={() => submit("save_draft")}><Save className="h-4 w-4" /> پاشەکەوتکردن</Button>
          <Button type="button" variant="outline" onClick={() => project?.id ? window.open(`/admin/projects/preview/${project.id}`, "_blank") : toast.error("سەرەتا پاشەکەوتی بکە")}><Eye className="h-4 w-4" /> پێشبینین</Button>
          <Button type="button" disabled={pending} onClick={() => submit("publish")}><Send className="h-4 w-4" /> بڵاوکردنەوە</Button>
          <Button type="button" variant="outline" disabled={pending} onClick={() => submit("archive")}><Archive className="h-4 w-4" /> ئەرشیف</Button>
          {project?.id ? <ConfirmDialog title="گواستنەوە بۆ زبڵ" description="دڵنیایت لە گواستنەوەی ئەم پڕۆژەیە؟" confirmLabel="گواستنەوە" onConfirm={() => void trash()}><Button type="button" variant="destructive"><Trash2 className="h-4 w-4" /> گواستنەوە بۆ زبڵ</Button></ConfirmDialog> : null}
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]"><main className="space-y-5">
        <section className={section}><h2 className="font-bold">گشتی</h2>{field("name", "ناوی پڕۆژە")}<div><Label className="mb-2 block">Slug</Label><Input {...form.register("slug")} dir="ltr" onBlur={() => !form.getValues("slug") && form.setValue("slug", slugify(form.getValues("name")))} /></div>{field("subtitle", "ژێرناونیشان")}{field("short_description", "کورتە وەسف", true)}{field("full_description", "وەسفی تەواو", true)}<div><Label className="mb-2 block">پۆل</Label><select {...form.register("category_id")} className="h-11 w-full rounded-xl border border-border bg-card px-3"><option value="">—</option>{categories.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div></section>
        <section className={section}><h2 className="font-bold">میدیا</h2><Label>بەرگ</Label><ProjectImageUploader value={cover} onChange={setCover} projectId={project?.id} kind="cover" /><Label>گەلەری</Label><ProjectGalleryManager value={gallery} onChange={setGallery} projectId={project?.id} /></section>
        <section className={section}><h2 className="font-bold">وردەکاری</h2>{field("client_name", "کڕیار")}{field("completion_date", "بەرواری تەواوبوون")}{field("challenge", "ئاستەنگ", true)}{field("solution", "چارەسەر", true)}{field("result", "ئەنجام", true)}{field("case_study", "کەیس ستادی", true)}</section>
        <section className={section}><h2 className="font-bold">تایبەتمەندییەکان</h2><ProjectFeaturesEditor value={features} onChange={setFeatures} /></section>
        <section className={section}><h2 className="font-bold">بەستەرەکان</h2>{field("website_url", "وێبسایت", false, "ltr")}{field("play_store_url", "Play Store", false, "ltr")}{field("app_store_url", "App Store", false, "ltr")}{field("github_url", "GitHub", false, "ltr")}</section>
        <section className={section}><h2 className="font-bold">SEO</h2>{field("seo_title", "ناونیشانی SEO")}{field("seo_description", "وەسفی SEO", true)}{field("og_image", "وێنەی OG", false, "ltr")}</section>
      </main><aside className="space-y-5">
        <section className={section}><h2 className="font-bold">میدیا</h2><Label>ئایکۆن</Label><ProjectImageUploader value={icon} onChange={setIcon} projectId={project?.id} kind="icon" /></section>
        <section className={section}><h2 className="font-bold">تەکنەلۆژیا</h2><div className="flex flex-wrap gap-2" dir="ltr">{technologies.map((tech) => <button type="button" key={tech.id} onClick={() => setTechnologyIds((old) => old.includes(tech.id) ? old.filter((id) => id !== tech.id) : [...old, tech.id])} className={`rounded-lg border px-3 py-1 text-sm ${technologyIds.includes(tech.id) ? "border-primary bg-primary/20 text-white" : "border-white/10 text-muted"}`}>{tech.name}</button>)}</div>{field("platforms", "پلاتفۆرمەکان", false, "ltr")}</section>
        <section className={section}><h2 className="font-bold">پیشاندان</h2><div className="flex items-center justify-between"><Label>تایبەت</Label><Switch checked={featured} onCheckedChange={setFeatured} /></div><div className="flex items-center justify-between"><Label>مارکیو</Label><Switch checked={marquee} onCheckedChange={setMarquee} /></div>{field("sort_order", "ڕیزبەندی", false, "ltr")}</section>
        <section className={section}><h2 className="font-bold">دۆخ</h2><select {...form.register("status")} className="h-11 w-full rounded-xl border border-border bg-card px-3"><option value="draft">ڕەشنووس</option><option value="published">بڵاوکراو</option><option value="archived">ئەرشیفکراو</option></select></section>
      </aside></div>
    </div>
  );
}

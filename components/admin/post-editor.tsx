"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Archive,
  CalendarClock,
  Eye,
  ExternalLink,
  Save,
  Send,
  Trash2,
  Undo2,
} from "lucide-react";

import { PostRichEditor } from "@/components/admin/post-rich-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  autosavePostAction,
  deletePostAction,
  restorePostFromEditorAction,
  savePostAction,
} from "@/app/admin/actions/posts";
import { slugify } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Post, PostCategory, Profile, Tag } from "@/types/database";

type FormState = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: string;
  author_id: string;
  tag_ids: string[];
  featured: boolean;
  status: string;
  published_at: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  deleted_at: string | null;
};

const statusLabels: Record<string, string> = {
  draft: "ڕەشنووس",
  published: "بڵاوکراو",
  scheduled: "خشتەکراو",
  archived: "ئەرشیفکراو",
};

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function PostEditor({
  post,
  categories,
  tags,
  authors,
  currentUserId,
}: {
  post?: Post | null;
  categories: PostCategory[];
  tags: Tag[];
  authors: Profile[];
  currentUserId?: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [autosaveLabel, setAutosaveLabel] = useState<string | null>(null);
  const slugTouched = useRef(Boolean(post?.slug));
  const lastSaved = useRef("");

  const initial = useMemo<FormState>(
    () => ({
      id: post?.id ?? "",
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      cover_image: post?.cover_image ?? "",
      category_id: post?.category_id ?? "",
      author_id: post?.author_id ?? currentUserId ?? "",
      tag_ids: (post?.tags ?? []).map((t) => t.id),
      featured: Boolean(post?.featured),
      status: post?.status ?? "draft",
      published_at: toDatetimeLocal(post?.published_at),
      seo_title: post?.seo_title ?? "",
      seo_description: post?.seo_description ?? "",
      og_image: post?.og_image ?? "",
      deleted_at: post?.deleted_at ?? null,
    }),
    [post, currentUserId]
  );

  const [form, setForm] = useState<FormState>(initial);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const snapshot = useCallback(
    () =>
      JSON.stringify({
        ...form,
        published_at: fromDatetimeLocal(form.published_at),
      }),
    [form]
  );

  // Autosave every 20s when dirty
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const timer = setInterval(async () => {
      const current = snapshot();
      if (!form.title.trim() || current === lastSaved.current) return;
      const result = await autosavePostAction({
        id: form.id || undefined,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        cover_image: form.cover_image,
        category_id: form.category_id || null,
        author_id: form.author_id || null,
        tag_ids: form.tag_ids,
        featured: form.featured,
        status: form.status,
        published_at: fromDatetimeLocal(form.published_at),
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        og_image: form.og_image,
      });
      if (result.status === "success") {
        lastSaved.current = current;
        setAutosaveLabel("پاشەکەوت کرا");
        toast.success("پاشەکەوت کرا");
        if (!form.id && result.id) {
          update("id", result.id);
          router.replace(`/admin/posts/${result.id}`);
        }
        setTimeout(() => setAutosaveLabel(null), 2500);
      }
    }, 20000);
    return () => clearInterval(timer);
  }, [form, snapshot, router, update]);

  function runIntent(intent: string) {
    startTransition(async () => {
      const fd = new FormData();
      Object.entries({
        id: form.id,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        cover_image: form.cover_image,
        category_id: form.category_id,
        author_id: form.author_id,
        tag_ids: form.tag_ids.join(","),
        featured: form.featured ? "true" : "false",
        status: form.status,
        published_at: fromDatetimeLocal(form.published_at) ?? "",
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        og_image: form.og_image,
        intent,
      }).forEach(([k, v]) => fd.set(k, String(v ?? "")));

      const result = await savePostAction(undefined, fd);
      if (result.status === "error") {
        toast.error(result.message || "هەڵەیەک ڕوویدا");
        return;
      }
      toast.success(result.message || "پاشەکەوت کرا");
      lastSaved.current = snapshot();
      if (result.id && !form.id) {
        router.replace(`/admin/posts/${result.id}`);
      } else {
        router.refresh();
      }
    });
  }

  async function handleTrash() {
    if (!form.id) return;
    if (!confirm("ئەم پۆستە ببرێتە سەبەتەی زبڵ؟")) return;
    const result = await deletePostAction(form.id);
    if (result.status === "error") toast.error(result.message);
    else {
      toast.success("سڕایەوە");
      router.push("/admin/posts");
    }
  }

  async function handleRestore() {
    if (!form.id) return;
    const result = await restorePostFromEditorAction(form.id);
    if (result.status === "error") toast.error(result.message);
    else {
      toast.success(result.message);
      update("deleted_at", null);
      router.refresh();
    }
  }

  function openPreview() {
    if (!form.id) {
      toast.error("سەرەتا پاشەکەوتی بکە بۆ پێشبینین");
      return;
    }
    window.open(`/admin/posts/preview/${form.id}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">
              {form.id ? "دەستکاری پۆست" : "پۆستی نوێ"}
            </h2>
            {autosaveLabel ? (
              <span className="rounded-lg bg-primary/20 px-2 py-1 text-xs text-light-violet">
                {autosaveLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted">
            دۆخ: {statusLabels[form.status] || form.status}
            {form.deleted_at ? " · لە زبڵدایە" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" disabled={pending} onClick={() => runIntent("save_draft")}>
            <Save className="h-4 w-4" />
            پاشەکەوتی ڕەشنووس
          </Button>
          <Button type="button" variant="outline" onClick={openPreview}>
            <Eye className="h-4 w-4" />
            پێشبینین
          </Button>
          <Button type="button" disabled={pending} onClick={() => runIntent("publish_now")}>
            <Send className="h-4 w-4" />
            ئێستا بڵاوی بکەوە
          </Button>
          <Button type="button" variant="secondary" disabled={pending} onClick={() => runIntent("schedule")}>
            <CalendarClock className="h-4 w-4" />
            خشتەکردن
          </Button>
          {form.id ? (
            <Button type="button" variant="outline" disabled={pending} onClick={() => runIntent("update")}>
              نوێکردنەوە
            </Button>
          ) : null}
          {form.status === "published" ? (
            <Button type="button" variant="outline" disabled={pending} onClick={() => runIntent("unpublish")}>
              هەڵوەشاندنی بڵاوکردنەوە
            </Button>
          ) : null}
          <Button type="button" variant="outline" disabled={pending} onClick={() => runIntent("archive")}>
            <Archive className="h-4 w-4" />
            ئەرشیف
          </Button>
          {form.deleted_at ? (
            <Button type="button" variant="secondary" onClick={handleRestore}>
              <Undo2 className="h-4 w-4" />
              گەڕاندنەوە
            </Button>
          ) : form.id ? (
            <Button type="button" variant="destructive" onClick={handleTrash}>
              <Trash2 className="h-4 w-4" />
              زبڵ
            </Button>
          ) : null}
          {form.slug && form.status === "published" ? (
            <Button asChild variant="ghost">
              <Link href={`/insights/${form.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                بینین
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <Label className="mb-2 block">ناونیشان</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  update("title", title);
                  if (!slugTouched.current) update("slug", slugify(title));
                }}
                placeholder="ناونیشانی پۆست"
                className="text-lg"
              />
            </div>
            <div>
              <Label className="mb-2 block">Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  slugTouched.current = true;
                  update("slug", e.target.value);
                }}
                placeholder="post-slug"
                dir="ltr"
              />
            </div>
            <div>
              <Label className="mb-2 block">کورتەباس</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                placeholder="کورتەباسی پۆست"
              />
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <Label className="mb-3 block">ناوەڕۆکی تەواو</Label>
            <PostRichEditor
              value={form.content}
              onChange={(html) => update("content", html)}
              placeholder="ناوەڕۆکی پۆست بنووسە..."
            />
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-white">SEO</h3>
            <div>
              <Label className="mb-2 block">ناونیشانی SEO</Label>
              <Input value={form.seo_title} onChange={(e) => update("seo_title", e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">وەسفی SEO</Label>
              <Textarea
                value={form.seo_description}
                onChange={(e) => update("seo_description", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-2 block">وێنەی OG</Label>
              <ImageUpload
                name="og_image_upload"
                defaultValue={form.og_image}
                onUploaded={(url) => update("og_image", url)}
              />
              <Input
                className="mt-2"
                value={form.og_image}
                onChange={(e) => update("og_image", e.target.value)}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <Label className="mb-2 block">دۆخ</Label>
              <select
                className="flex h-11 w-full rounded-xl border border-border bg-card px-3 text-sm"
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                <option value="draft">ڕەشنووس</option>
                <option value="published">بڵاوکراو</option>
                <option value="scheduled">خشتەکراو</option>
                <option value="archived">ئەرشیفکراو</option>
              </select>
            </div>
            <div>
              <Label className="mb-2 block">بەرواری بڵاوکردنەوە</Label>
              <Input
                type="datetime-local"
                value={form.published_at}
                onChange={(e) => update("published_at", e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label>تایبەت</Label>
              <Switch
                checked={form.featured}
                onCheckedChange={(checked) => update("featured", checked)}
              />
            </div>
            <div>
              <Label className="mb-2 block">پۆل</Label>
              <select
                className="flex h-11 w-full rounded-xl border border-border bg-card px-3 text-sm"
                value={form.category_id}
                onChange={(e) => update("category_id", e.target.value)}
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">نووسەر</Label>
              <select
                className="flex h-11 w-full rounded-xl border border-border bg-card px-3 text-sm"
                value={form.author_id}
                onChange={(e) => update("author_id", e.target.value)}
              >
                <option value="">—</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name || a.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-2 block">تاگەکان</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const active = form.tag_ids.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      className={`rounded-lg border px-2.5 py-1 text-xs ${
                        active
                          ? "border-primary bg-primary/20 text-white"
                          : "border-white/10 text-muted"
                      }`}
                      onClick={() =>
                        update(
                          "tag_ids",
                          active
                            ? form.tag_ids.filter((id) => id !== tag.id)
                            : [...form.tag_ids, tag.id]
                        )
                      }
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-3">
            <Label>وێنەی بەرگ</Label>
            <ImageUpload
              name="cover_upload"
              defaultValue={form.cover_image}
              onUploaded={(url) => update("cover_image", url)}
            />
            {form.cover_image ? (
              <div className="relative mt-2 aspect-video overflow-hidden rounded-xl border border-white/10">
                <Image src={form.cover_image} alt="" fill className="object-cover" unoptimized />
              </div>
            ) : null}
            <Input
              value={form.cover_image}
              onChange={(e) => update("cover_image", e.target.value)}
              placeholder="https://..."
              dir="ltr"
            />
          </div>

          {typeof post?.view_count === "number" ? (
            <div className="glass rounded-2xl p-5 text-sm text-muted">
              <p>بینینەکان: <span className="text-white">{post.view_count}</span></p>
              <p className="mt-1">
                بینینی جیاواز: <span className="text-white">{post.unique_view_count ?? 0}</span>
              </p>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

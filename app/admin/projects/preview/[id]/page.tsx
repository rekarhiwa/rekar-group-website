import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAdminProjectById } from "@/services/projects";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProjectPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (isSupabaseConfigured()) { try { await requireProfile(); } catch { notFound(); } }
  const project = await getAdminProjectById(id); if (!project) notFound();
  return <main className="ambient-bg min-h-screen px-4 py-10" dir="rtl"><article className="mx-auto max-w-5xl space-y-8"><header className="flex flex-wrap items-center justify-between gap-3"><Badge>Preview · {project.status}</Badge><Button asChild variant="secondary"><Link href={`/admin/projects/${project.id}/edit`}>گەڕانەوە بۆ دەستکاری</Link></Button></header>{project.cover_image ? <div className="relative aspect-video overflow-hidden rounded-3xl"><Image src={project.cover_image} alt={project.name} fill className="object-cover" unoptimized /></div> : null}<div><p className="text-sm text-light-violet">{project.category?.name}</p><h1 className="mt-2 text-4xl font-black text-white">{project.name}</h1>{project.subtitle ? <p className="mt-3 text-xl text-muted">{project.subtitle}</p> : null}</div><p className="whitespace-pre-wrap leading-8 text-muted">{project.full_description || project.short_description}</p>{project.feature_items?.length ? <section className="grid gap-4 md:grid-cols-2">{project.feature_items.map(x => <div key={x.id} className="glass rounded-2xl p-5"><h2 className="font-bold text-white">{x.title}</h2><p className="mt-2 text-muted">{x.description}</p></div>)}</section> : null}</article></main>;
}

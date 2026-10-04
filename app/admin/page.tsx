import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReadonlyBanner } from "@/components/admin/readonly-banner";
import { getAdminDashboard } from "@/lib/admin/data";
import { formatDate } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  draft: "ڕەشنووس",
  published: "بڵاوکراو",
  archived: "ئەرشیفکراو",
  scheduled: "خشتەکراو",
};

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();

  return (
    <div className="space-y-6">
      <ReadonlyBanner demoMode={data.demoMode} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-light-violet uppercase">وێبسایت</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["کۆی پڕۆژەکان", data.counts.projects],
          ["پڕۆژە بڵاوکراوەکان", data.counts.publishedProjects],
          ["نامە نەخوێندراوەکان", data.counts.unreadMessages],
          ["خزمەتگوزارییەکان", data.counts.services],
          ["پەڕەکان", data.counts.pages],
        ].map(([label, value]) => (
          <Card key={String(label)} className="border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          </Card>
        ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-light-violet uppercase">پۆستەکان</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["کۆی پۆستەکان", data.counts.posts],
            ["پۆستە ڕەشنووسەکان", data.counts.draftPosts],
          ].map(([label, value]) => (
            <Card key={String(label)} className="border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-light-violet uppercase">چالاکی وێبسایت</h2>
        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">پڕۆژە نوێیەکان</h3>
              <Badge variant="outline">{data.recentProjects.length}</Badge>
            </div>
            <div className="space-y-3">
              {data.recentProjects.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 p-4">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-muted">{statusLabel[item.status] ?? item.status}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">نامە نوێیەکان</h3>
              <Badge variant="outline">{data.recentMessages.length}</Badge>
            </div>
            <div className="space-y-3">
              {data.recentMessages.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 p-4">
                  <p className="font-medium text-white">{item.full_name}</p>
                  <p className="text-sm text-muted">{formatDate(item.created_at)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-[0.18em] text-light-violet uppercase">چالاکی پۆستەکان</h2>
        <Card className="border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">پۆستە نوێیەکان</h3>
            <Badge variant="outline">{data.recentPosts.length}</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {data.recentPosts.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 p-4">
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-muted">{statusLabel[item.status] ?? item.status}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">دەستگەیشتنی خێرا</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-light-violet uppercase">وێبسایت</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/admin/projects", label: "پڕۆژەکان" },
                { href: "/admin/pages", label: "پەڕەکان" },
                { href: "/admin/messages", label: "نامەکان" },
                { href: "/", label: "بینینی وێبسایت" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-primary/40 hover:bg-primary/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-light-violet uppercase">پۆستەکان</p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "/admin/posts", label: "هەموو پۆستەکان" },
                { href: "/admin/posts/new", label: "پۆستی نوێ" },
                { href: "/admin/posts?tab=categories", label: "پۆلەکان" },
                { href: "/insights", label: "بینینی پۆستەکان" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-primary/40 hover:bg-primary/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

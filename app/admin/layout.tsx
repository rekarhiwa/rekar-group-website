import { SchemaSetupBanner } from "@/components/admin/schema-setup-banner";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getCurrentProfile } from "@/lib/auth/session";
import { isClerkConfigured } from "@/lib/auth/clerk";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

const roleLabels: Record<string, string> = {
  super_admin: "سوپەر ئەدمین",
  admin: "ئەدمین",
  editor: "دەستکاریکەر",
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const clerkReady = isClerkConfigured();
  const demoMode = !clerkReady && !isSupabaseConfigured();
  const profile = demoMode ? null : await getCurrentProfile();

  if (!demoMode && !profile) {
    redirect("/auth/login?redirect_url=/admin");
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#100018] text-foreground">
      <AdminSidebar clerkEnabled={clerkReady} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#100018]/85 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">سیستەمی بەڕێوەبردنی Rekar Group</h1>
              <p className="text-sm text-muted">
                {demoMode
                  ? "دۆخی دیمۆ چالاکە تا Clerk / Supabase ڕێک نەخرێن."
                  : `چوویتە ژوورەوە وەک ${profile?.full_name ?? profile?.email}`}
              </p>
            </div>
            <Badge variant="outline" className="w-fit bg-primary/20 text-white">
              {demoMode
                ? "دۆخی دیمۆ"
                : roleLabels[profile?.role ?? "editor"] ?? "دەستکاریکەر"}
            </Badge>
          </div>
        </header>
        <main className="space-y-4 p-6">
          <SchemaSetupBanner />
          {children}
        </main>
      </div>
    </div>
  );
}

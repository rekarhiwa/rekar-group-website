import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getCurrentProfile } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Badge } from "@/components/ui/badge";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const demoMode = !isSupabaseConfigured();
  const profile = demoMode ? null : await getCurrentProfile();

  if (!demoMode && !profile) {
    redirect("/auth/login?next=/admin");
  }

  return (
    <div className="flex min-h-screen bg-[#100018] text-foreground">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#100018]/85 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Rekar Group Admin CMS</h1>
              <p className="text-sm text-muted">
                {demoMode
                  ? "Demo mode is active until Supabase environment variables are configured."
                  : `Signed in as ${profile?.full_name ?? profile?.email}`}
              </p>
            </div>
            <Badge variant="outline" className="w-fit bg-primary/20 text-white">
              {demoMode ? "Demo mode" : profile?.role ?? "editor"}
            </Badge>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

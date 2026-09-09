"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminSidebarLinks } from "@/lib/admin/shared";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    if (!isSupabaseConfigured()) {
      router.push("/");
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-l border-white/10 bg-[#14001f]/95 backdrop-blur",
        collapsed ? "w-[96px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10">
            <Image src="/brand/logo-mark.png" alt="Rekar Group" width={44} height={44} className="h-full w-full object-cover" />
          </div>
          {!collapsed ? (
            <div>
              <p className="font-semibold text-white">Rekar CMS</p>
              <p className="text-xs text-muted">Admin control panel</p>
            </div>
          ) : null}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="rounded-lg border border-white/10 p-2 text-muted transition hover:text-white"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {adminSidebarLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-primary/20 text-white ring-1 ring-primary/30"
                    : "text-muted hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="truncate">{collapsed ? item.label.slice(0, 1) : item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        <Button asChild variant="secondary" className="w-full">
          <Link href="/" target="_blank" rel="noreferrer">
            {collapsed ? "View" : "View Website"}
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed ? "Logout" : null}
        </Button>
      </div>
    </aside>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminSidebarGroups } from "@/lib/admin/shared";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function ClerkLogoutButton({ collapsed }: { collapsed: boolean }) {
  const { signOut } = useClerk();
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center"
      onClick={() => void signOut({ redirectUrl: "/" })}
    >
      <LogOut className="h-4 w-4" />
      {!collapsed ? "چوونەدەرەوە" : null}
    </Button>
  );
}

function LegacyLogoutButton({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center"
      onClick={() => void handleLogout()}
    >
      <LogOut className="h-4 w-4" />
      {!collapsed ? "چوونەدەرەوە" : null}
    </Button>
  );
}

function linkIsActive(pathname: string, tab: string | null, href: string) {
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  const wantedTab = params.get("tab");

  if (path === "/admin") return pathname === "/admin";
  if (path === "/admin/posts") {
    if (!pathname.startsWith("/admin/posts")) return false;
    if (wantedTab) return tab === wantedTab;
    return !tab || tab === "list";
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

function AdminNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <div className="space-y-6">
      {adminSidebarGroups.map((group) => (
        <div key={group.id}>
          {group.id === "posts" ? (
            <div className={cn("mb-4 border-t border-white/10", collapsed ? "mx-2" : "mx-3")} />
          ) : null}
          {!collapsed ? (
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-light-violet uppercase">
              {group.label}
            </p>
          ) : group.id !== "posts" ? (
            <div className="mx-auto mb-2 h-px w-8 bg-white/10" />
          ) : null}
          <div className="space-y-1">
            {group.links.map((item) => {
              const active = linkIsActive(pathname, tab, item.href);
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
        </div>
      ))}
    </div>
  );
}

export function AdminSidebar({ clerkEnabled = true }: { clerkEnabled?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);

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
              <p className="text-xs text-muted">پانێڵی بەڕێوەبردن</p>
            </div>
          ) : null}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="rounded-lg border border-white/10 p-2 text-muted transition hover:text-white"
          aria-label="کردنەوە و داخستنی لایەن"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Suspense fallback={null}>
          <AdminNav collapsed={collapsed} />
        </Suspense>
      </nav>

      <div className="space-y-3 border-t border-white/10 p-4">
        <Button asChild variant="secondary" className="w-full">
          <Link href="/" target="_blank" rel="noreferrer">
            {collapsed ? "سایت" : "بینینی وێبسایت"}
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/insights" target="_blank" rel="noreferrer">
            {collapsed ? "پۆست" : "بینینی پۆستەکان"}
          </Link>
        </Button>
        {clerkEnabled ? (
          <ClerkLogoutButton collapsed={collapsed} />
        ) : (
          <LegacyLogoutButton collapsed={collapsed} />
        )}
      </div>
    </aside>
  );
}

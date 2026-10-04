"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { blogNavGroups } from "@/lib/posts/taxonomy";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/types/database";

export function BlogHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/insights" className="flex min-w-0 items-center gap-3">
          <span className="relative h-8 w-8 overflow-hidden rounded-lg">
            <Image
              src={settings.logo_mark_url || settings.logo_url || "/brand/logo-mark.png"}
              alt={settings.company_name}
              fill
              className="object-cover"
              sizes="32px"
              priority
            />
          </span>
          <span className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            پۆستەکان
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/insights"
            className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-soft hover:text-foreground"
          >
            سەرەتا
          </Link>
          {blogNavGroups.map((group) => (
            <div
              key={group.id}
              className="relative"
              onMouseEnter={() => setOpenGroup(group.id)}
              onMouseLeave={() => setOpenGroup((value) => (value === group.id ? null : value))}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-soft hover:text-foreground"
                aria-expanded={openGroup === group.id}
                onClick={() => setOpenGroup((value) => (value === group.id ? null : group.id))}
              >
                {group.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {openGroup === group.id ? (
                <div className="absolute end-0 top-full z-50 min-w-48 pt-1">
                  <div className="overflow-hidden rounded-xl border border-border bg-background py-1 shadow-xl">
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/insights?category=${item.slug}`}
                        className="block px-4 py-2.5 text-sm text-muted transition hover:bg-soft hover:text-foreground"
                        onClick={() => setOpenGroup(null)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          <Link
            href="/insights?category=news"
            className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-soft hover:text-foreground"
          >
            هەواڵ
          </Link>
          <Link
            href="/insights?category=tips"
            className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-soft hover:text-foreground"
          >
            ڕێنمایی
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href="/"
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
          >
            ڕێکار گروپ
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "داخستنی مێنیو" : "کردنەوەی مێنیو"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            <Link href="/insights" onClick={() => setOpen(false)} className="px-1 py-2 text-foreground">
              سەرەتا
            </Link>
            {blogNavGroups.map((group) => (
              <div key={group.id}>
                <p className="mb-1 px-1 text-xs font-semibold tracking-[0.16em] text-light-violet uppercase">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/insights?category=${item.slug}`}
                    onClick={() => setOpen(false)}
                    className={cn("block rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-soft hover:text-foreground")}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              href="/insights?category=news"
              onClick={() => setOpen(false)}
              className="px-1 py-2 text-foreground"
            >
              هەواڵ
            </Link>
            <Link
              href="/insights?category=tips"
              onClick={() => setOpen(false)}
              className="px-1 py-2 text-foreground"
            >
              ڕێنمایی
            </Link>
            <Link href="/" onClick={() => setOpen(false)} className="px-1 py-2 text-sm text-muted">
              ڕێکار گروپ
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

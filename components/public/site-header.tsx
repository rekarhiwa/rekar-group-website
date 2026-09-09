"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavigationItem, SiteSettings } from "@/types/database";

export function SiteHeader({
  navigation,
  settings,
}: {
  navigation: NavigationItem[];
  settings: SiteSettings;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#100018]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
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
          <span className="text-[15px] font-semibold tracking-tight text-white">
            {settings.company_name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navigation
            .filter((item) => item.visible)
            .map((item) => (
              <Link
                key={item.id}
                href={item.url}
                target={item.open_in_new_tab ? "_blank" : undefined}
                rel={item.open_in_new_tab ? "noreferrer" : undefined}
                className="text-sm text-[#C8ABD9] transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" className="h-9 rounded-full px-4 shadow-none">
            <Link href="/contact">پەیوەندی</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "داخستنی مێنیو" : "کردنەوەی مێنیو"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/[0.06] px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {navigation
              .filter((item) => item.visible)
              .map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3 text-base text-white transition hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            <Button asChild className="mt-2 w-full rounded-full shadow-none">
              <Link href="/contact" onClick={() => setOpen(false)}>
                پەیوەندی
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

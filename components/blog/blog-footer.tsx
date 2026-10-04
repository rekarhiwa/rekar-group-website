import Image from "next/image";
import Link from "next/link";

import { blogNavGroups } from "@/lib/posts/taxonomy";
import type { SiteSettings } from "@/types/database";

export function BlogFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 md:col-span-2 lg:col-span-1">
          <Link href="/insights" className="inline-flex items-center gap-3">
            <span className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image
                src={settings.logo_mark_url || settings.logo_url || "/brand/logo-mark.png"}
                alt={settings.company_name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </span>
            <span className="text-[15px] font-semibold text-foreground">پۆستەکان</span>
          </Link>
          <p className="max-w-md text-sm leading-7 text-muted">
            شیکاری تەکنەلۆجیا، AI، هاردوێر و ڕێنمایی لە ڕێکار گروپ.
          </p>
        </div>
        {blogNavGroups.map((group) => (
          <div key={group.id}>
            <p className="mb-4 text-sm font-semibold text-foreground">{group.label}</p>
            <div className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/insights?category=${item.slug}`}
                  className="text-sm text-muted transition hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:px-6 lg:px-8">
          <Link href="/insights" className="hover:text-foreground">
            {settings.copyright_text || `© ${settings.company_name}`}
          </Link>
          <Link href="/" className="hover:text-foreground">
            ڕێکار گروپ
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";

import type { NavigationItem, SiteSettings, SocialLink } from "@/types/database";

export function SiteFooter({
  settings,
  navigation,
  socialLinks,
}: {
  settings: SiteSettings;
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
}) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image
                src={settings.logo_mark_url || settings.logo_url || "/brand/logo-mark.png"}
                alt={settings.company_name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </span>
            <span className="text-[15px] font-semibold text-foreground">{settings.company_name}</span>
          </Link>
          <p className="max-w-md text-sm leading-7 text-muted">
            {settings.footer_description || settings.default_seo_description}
          </p>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted transition hover:text-foreground"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-medium text-foreground">لینکەکان</p>
          <div className="flex flex-col gap-3">
            {navigation
              .filter((item) => item.visible)
              .map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="text-sm text-muted transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-medium text-foreground">پەیوەندی</p>
          <div className="space-y-3 text-sm text-muted">
            {settings.phone ? <p>{settings.phone}</p> : null}
            {settings.email ? <p>{settings.email}</p> : null}
            {settings.address ? <p>{settings.address}</p> : null}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{settings.copyright_text || `© ${settings.company_name}`}</p>
          <p>{settings.company_name_en}</p>
        </div>
      </div>
    </footer>
  );
}

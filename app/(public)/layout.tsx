import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import {
  getNavigation,
  getSiteSettings,
  getSocialLinks,
  getThemeSettings,
} from "@/services/content";
import { organizationJsonLd } from "@/lib/seo/metadata";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navigation, socialLinks, theme] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
    getSocialLinks(),
    getThemeSettings(),
  ]);

  const style = {
    "--background": theme.background_color,
    "--background-secondary": theme.secondary_color,
    "--primary": theme.primary_color,
    "--accent": theme.accent_color,
  } as React.CSSProperties;

  return (
    <div className="relative min-h-screen bg-[#100018] text-foreground" style={style}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd(settings)),
        }}
      />
      <SiteHeader navigation={navigation} settings={settings} />
      <main>{children}</main>
      <SiteFooter
        settings={settings}
        navigation={navigation}
        socialLinks={socialLinks}
      />
    </div>
  );
}

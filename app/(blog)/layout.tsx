import { BlogFooter } from "@/components/blog/blog-footer";
import { BlogHeader } from "@/components/blog/blog-header";
import { getSiteSettings, getThemeSettings } from "@/services/content";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, theme] = await Promise.all([getSiteSettings(), getThemeSettings()]);

  const style = {
    "--primary": theme.primary_color,
    "--accent": theme.accent_color,
    "--brand-background": theme.background_color,
    "--brand-background-secondary": theme.secondary_color,
  } as React.CSSProperties;

  return (
    <div
      className="blog-shell public-shell relative flex min-h-screen flex-col bg-background text-foreground"
      style={style}
    >
      <BlogHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <BlogFooter settings={settings} />
    </div>
  );
}

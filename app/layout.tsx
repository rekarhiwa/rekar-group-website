import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from "@/services/content";
import { isClerkConfigured } from "@/lib/auth/clerk";
import "./globals.css";

const rabar = localFont({
  src: [
    {
      path: "./fonts/Rabar.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Rabar_022.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-rabar",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.default_seo_title || settings.company_name,
      template: `%s | ${settings.company_name}`,
    },
    description: settings.default_seo_description || undefined,
    metadataBase: settings.website_url ? new URL(settings.website_url) : undefined,
    openGraph: {
      title: settings.default_seo_title || settings.company_name,
      description: settings.default_seo_description || undefined,
      images: settings.og_image_url ? [settings.og_image_url] : undefined,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const body = (
    <>
      {children}
      <Toaster />
    </>
  );

  return (
    <html
      lang="ckb"
      dir="rtl"
      className={`${rabar.variable} h-full antialiased`}
    >
      <body className={`${rabar.className} min-h-full flex flex-col`}>
        {isClerkConfigured() ? (
          <ClerkProvider
            signInUrl="/auth/login"
            signUpUrl="/auth/login"
            afterSignOutUrl="/"
          >
            {body}
          </ClerkProvider>
        ) : (
          body
        )}
      </body>
    </html>
  );
}

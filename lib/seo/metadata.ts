import type { Metadata } from "next";

type SeoInput = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  path?: string;
  noIndex?: boolean;
};

export function buildPageMetadata(input: SeoInput): Metadata {
  const title = input.title || undefined;
  const description = input.description || undefined;
  const images = input.image ? [input.image] : undefined;

  return {
    title,
    description,
    alternates: input.path ? { canonical: input.path } : undefined,
    openGraph: {
      title,
      description,
      images,
      url: input.path,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function organizationJsonLd(settings: {
  company_name: string;
  company_name_en?: string | null;
  website_url?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name_en || settings.company_name,
    alternateName: settings.company_name,
    url: settings.website_url || undefined,
    logo: settings.logo_url || undefined,
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
  };
}

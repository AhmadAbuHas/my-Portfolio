import "server-only";
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getProfile, getSiteSettings } from "./content";
import { alternatesFor, localizedPath } from "./site";

const openGraphLocale: Record<Locale, string> = { en: "en_US", ar: "ar_AR" };

/**
 * Full metadata for a page: canonical + hreflang, Open Graph and Twitter.
 * (Next.js replaces nested objects like `openGraph` instead of merging them,
 * so every page builds the complete set here.)
 */
export async function pageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
}: {
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
  image?: string | null;
}): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSiteSettings(locale), getProfile(locale)]);
  const fullTitle = title ? `${title} · ${profile.name}` : settings.seoTitle;
  const finalDescription = description || settings.seoDescription;
  const ogImage = image ?? settings.ogImage ?? "/api/og";
  const images = [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }];

  return {
    ...(title ? { title } : {}),
    description: finalDescription,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: openGraphLocale[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => openGraphLocale[l]),
      url: localizedPath(locale, path),
      title: fullTitle,
      description: finalDescription,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images: [ogImage],
    },
  };
}

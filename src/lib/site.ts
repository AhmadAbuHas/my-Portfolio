import { routing, type Locale } from "@/i18n/routing";

/** Absolute site origin, without a trailing slash. */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Path for a locale, e.g. localizedPath("ar", "/projects") → "/ar/projects". */
export function localizedPath(locale: Locale, path = "") {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/** Canonical + hreflang alternates for a page that exists in every locale. */
export function alternatesFor(locale: Locale, path = "") {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedPath(l, path);
  languages["x-default"] = localizedPath(routing.defaultLocale, path);
  return { canonical: localizedPath(locale, path), languages };
}

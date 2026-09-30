import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "./routing";

/**
 * The route's locale, or a 404 for anything else. Paths with a file extension
 * (e.g. /favicon.ico) skip the proxy and land in [locale] with that value, and
 * pages and their metadata run even though the layout rejects them.
 */
export async function getLocaleParam(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

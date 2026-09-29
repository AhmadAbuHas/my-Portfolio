import NextLink from "next/link";
import { getLocale } from "next-intl/server";
import type { ComponentProps } from "react";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/site";

type LocaleLinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  /** A path without the locale, e.g. "/projects". */
  href: string;
};

/**
 * next/link with the current locale prefixed ("/projects" → "/ar/projects").
 * Server-only, so pages don't need an i18n provider on the client.
 */
export async function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const locale = (await getLocale()) as Locale;
  return <NextLink href={localizedPath(locale, href)} {...props} />;
}

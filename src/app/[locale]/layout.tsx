import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { localeDirection, routing } from "@/i18n/routing";
import { getProfile, getSiteSettings, getVisibleSections } from "@/lib/content";
import { fontVariables } from "@/lib/fonts";
import { getSiteUrl } from "@/lib/site";
import "../globals.css";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0a0e15",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const [settings, profile] = await Promise.all([getSiteSettings(locale), getProfile(locale)]);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: settings.seoTitle, template: `%s · ${profile.name}` },
    description: settings.seoDescription,
    applicationName: profile.name,
    authors: [{ name: profile.name }],
    creator: profile.name,
    formatDetection: { telephone: false, email: false, address: false },
  };
}

// Content hidden by scroll-reveal must still show when JavaScript is off.
const noscriptStyles =
  "<style>[data-reveal]{opacity:1!important;transform:none!important}</style>";

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const [t, profile, sections] = await Promise.all([
    getTranslations("common"),
    getProfile(locale),
    getVisibleSections(locale),
  ]);

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={fontVariables(locale)}
      data-scroll-behavior="smooth"
    >
      <body>
        <noscript dangerouslySetInnerHTML={{ __html: noscriptStyles }} />
        <a href="#main" className="skip-link">
          {t("skipToContent")}
        </a>
        {/* No i18n provider on the client: every string is rendered on the server. */}
        <SiteHeader locale={locale} sections={sections} name={profile.name} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} name={profile.name} />
        <div aria-hidden="true" className="grain" />
      </body>
    </html>
  );
}

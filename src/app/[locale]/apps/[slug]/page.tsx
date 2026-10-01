import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { AppBadges, AppIcon, StoreLinks } from "@/components/work/AppParts";
import { DetailBody } from "@/components/work/DetailBody";
import { Gallery } from "@/components/work/Gallery";
import { PageIntro } from "@/components/work/PageIntro";
import { getLocaleParam } from "@/i18n/locale";
import { getApp, getAppSlugs, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { appGraph, techList } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAppSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocaleParam(params);
  const [t, app, profile] = await Promise.all([
    getTranslations({ locale, namespace: "apps" }),
    getApp(slug, locale),
    getProfile(locale),
  ]);
  if (!app) return {};
  return pageMetadata({
    locale,
    path: `/apps/${slug}`,
    title: app.name,
    description: app.tech.length
      ? t("metaDescription", { summary: app.summary, name: profile.name, list: techList(locale, app.tech) })
      : app.summary,
  });
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);

  const [t, common, app] = await Promise.all([
    getTranslations("apps"),
    getTranslations("common"),
    getApp(slug, locale),
  ]);
  if (!app) notFound();

  const structuredData = await appGraph(locale, app, { home: common("home"), apps: t("title") });

  return (
    <article>
      <JsonLd data={structuredData} />
      <PageIntro
        back={{ href: "/apps", label: t("back") }}
        eyebrow={<AppIcon src={app.icon} name={app.name} className="size-20" />}
        title={app.name}
      >
        <AppBadges app={app} className="mt-5" />
        <p className="mt-5 max-w-[60ch] text-body text-pretty text-fg-muted">{app.summary}</p>
        <StoreLinks app={app} className="mt-8" />
      </PageIntro>

      {app.screenshots.length > 0 ? (
        <Container className="pt-14 md:pt-20">
          <h2 className="eyebrow">{t("screenshots")}</h2>
          <div className="mt-4">
            <Gallery
              images={app.screenshots}
              variant="phone"
              labels={{ region: t("screenshots"), previous: t("previous"), next: t("next") }}
            />
          </div>
        </Container>
      ) : null}

      <DetailBody body={app.body} bodyLabel={t("details")} tech={app.tech} stackLabel={t("stack")} />
    </article>
  );
}

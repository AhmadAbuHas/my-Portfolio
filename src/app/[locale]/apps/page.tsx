import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { AppCard } from "@/components/work/AppCard";
import { PageIntro } from "@/components/work/PageIntro";
import { getLocaleParam } from "@/i18n/locale";
import { getApps, getProfile } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { collectionGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  const [t, profile] = await Promise.all([
    getTranslations({ locale, namespace: "apps" }),
    getProfile(locale),
  ]);
  return pageMetadata({
    locale,
    path: "/apps",
    title: t("title"),
    description: t("description", { name: profile.name, headline: profile.headline }),
  });
}

export default async function AppsPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);

  const [t, apps] = await Promise.all([getTranslations(), getApps(locale)]);
  if (apps.length === 0) notFound();

  const structuredData = await collectionGraph(
    locale,
    { name: t("apps.title"), path: "/apps", homeLabel: t("common.home") },
    apps.map((app) => ({ name: app.name, path: `/apps/${app.slug}` })),
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PageIntro
        back={{ href: "/", label: t("common.home") }}
        eyebrow={<p className="eyebrow">{t("sections.apps.eyebrow")}</p>}
        title={t("apps.title")}
      />
      <Container className="py-16 md:py-24">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, index) => (
            <Reveal as="li" key={app.slug} delay={(index % 3) * 0.08}>
              <AppCard app={app} headingLevel="h2" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </>
  );
}

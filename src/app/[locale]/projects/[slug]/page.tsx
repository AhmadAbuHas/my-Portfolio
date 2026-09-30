import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SocialIcon } from "@/components/icons";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DetailBody } from "@/components/work/DetailBody";
import { Gallery } from "@/components/work/Gallery";
import { PageIntro } from "@/components/work/PageIntro";
import { getLocaleParam } from "@/i18n/locale";
import { getProject, getProjectSlugs } from "@/lib/content";
import { formatMonthYear } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocaleParam(params);
  const project = await getProject(slug, locale);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.name,
    description: project.summary,
    image: project.cover?.src,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);

  const [t, project] = await Promise.all([getTranslations(), getProject(slug, locale)]);
  if (!project) notFound();

  const timeline = [project.startDate, project.endDate]
    .filter((date): date is string => Boolean(date))
    .map((date) => formatMonthYear(date, locale))
    .join(" – ");
  const facts = [
    { label: t("projects.role"), value: project.role },
    { label: t("projects.client"), value: project.client },
    { label: t("projects.timeline"), value: timeline },
  ].filter((fact) => fact.value);

  return (
    <article>
      <PageIntro
        back={{ href: "/projects", label: t("projects.back") }}
        eyebrow={<p className="eyebrow">{t("sections.projects.eyebrow")}</p>}
        title={project.name}
      >
        <p className="mt-5 max-w-[60ch] text-body text-pretty text-fg-muted">{project.summary}</p>

        {facts.length > 0 ? (
          <dl className="mt-10 grid max-w-3xl gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="eyebrow">{fact.label}</dt>
                <dd className="mt-2 text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {project.liveUrl || project.repoUrl ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl} external newTabHint={t("common.opensInNewTab")}>
                {t("projects.liveSite")}
                <ArrowIcon />
              </ButtonLink>
            ) : null}
            {project.repoUrl ? (
              <ButtonLink
                href={project.repoUrl}
                variant="outline"
                external
                newTabHint={t("common.opensInNewTab")}
              >
                <SocialIcon platform="github" className="size-4" />
                {t("projects.sourceCode")}
              </ButtonLink>
            ) : null}
          </div>
        ) : null}
      </PageIntro>

      {project.cover ? (
        <Container className="pt-12 md:pt-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-surface-2">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              preload
              sizes="(min-width: 1200px) 1136px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      ) : null}

      <DetailBody
        body={project.body}
        bodyLabel={t("projects.caseStudy")}
        tech={project.tech}
        stackLabel={t("projects.stack")}
      />

      {project.gallery.length > 0 ? (
        <Container className="pb-20 md:pb-28">
          <h2 className="eyebrow">{t("projects.gallery")}</h2>
          <div className="mt-4">
            <Gallery
              images={project.gallery}
              variant="wide"
              labels={{
                region: t("projects.gallery"),
                previous: t("apps.previous"),
                next: t("apps.next"),
              }}
            />
          </div>
        </Container>
      ) : null}
    </article>
  );
}

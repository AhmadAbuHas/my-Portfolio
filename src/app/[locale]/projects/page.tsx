import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/work/PageIntro";
import { ProjectCard } from "@/components/work/ProjectCard";
import { getLocaleParam } from "@/i18n/locale";
import { getProfile, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { collectionGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  const [t, profile] = await Promise.all([
    getTranslations({ locale, namespace: "projects" }),
    getProfile(locale),
  ]);
  return pageMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("description", { name: profile.name, headline: profile.headline }),
  });
}

export default async function ProjectsPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);

  const [t, projects] = await Promise.all([getTranslations(), getProjects(locale)]);
  if (projects.length === 0) notFound();

  const structuredData = await collectionGraph(
    locale,
    { name: t("projects.title"), path: "/projects", homeLabel: t("common.home") },
    projects.map((project) => ({ name: project.name, path: `/projects/${project.slug}` })),
  );

  return (
    <>
      <JsonLd data={structuredData} />
      <PageIntro
        back={{ href: "/", label: t("common.home") }}
        eyebrow={<p className="eyebrow">{t("sections.projects.eyebrow")}</p>}
        title={t("projects.title")}
      />
      <Container className="py-16 md:py-24">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={(index % 3) * 0.08}>
              <ProjectCard
                project={project}
                eager={index < 3}
                headingLevel="h2"
                stackLabel={t("projects.stack")}
              />
            </Reveal>
          ))}
        </ul>
      </Container>
    </>
  );
}

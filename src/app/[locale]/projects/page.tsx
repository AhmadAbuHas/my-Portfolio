import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/work/PageIntro";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { Locale } from "@/i18n/routing";
import { getProfile, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, profile] = await Promise.all([
    getTranslations({ locale, namespace: "projects" }),
    getProfile(locale),
  ]);
  return pageMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("description", { name: profile.name }),
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, projects] = await Promise.all([getTranslations(), getProjects(locale)]);
  if (projects.length === 0) notFound();

  return (
    <>
      <PageIntro
        back={{ href: "/", label: t("common.home") }}
        eyebrow={<p className="eyebrow">{t("sections.projects.eyebrow")}</p>}
        title={t("projects.title")}
      />
      <Container className="py-16 md:py-24">
        <ul className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => {
            // Same bento rule as the home page: an odd count makes the first card full width.
            const large = index === 0 && projects.length % 2 === 1;
            return (
              <Reveal
                as="li"
                key={project.slug}
                delay={large ? 0 : (index % 2) * 0.08}
                className={large ? "md:col-span-2" : undefined}
              >
                <ProjectCard
                  project={project}
                  large={large}
                  eager={index === 0}
                  stackLabel={t("projects.stack")}
                />
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </>
  );
}

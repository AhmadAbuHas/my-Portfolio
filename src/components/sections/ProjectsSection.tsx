import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { ProjectSummary } from "@/lib/content";

/** Featured projects as compact cards: 1 column on phones, 2 on tablets, 3 on desktop. */
export async function ProjectsSection({
  number,
  projects,
  total,
}: {
  number: string;
  projects: ProjectSummary[];
  total: number;
}) {
  const t = await getTranslations();

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-10 md:py-16">
      <Container>
        <SectionHeader
          number={number}
          eyebrow={t("sections.projects.eyebrow")}
          title={t("sections.projects.title")}
          titleId="projects-title"
          action={
            total > projects.length ? (
              <ButtonLink href="/projects" variant="ghost">
                {t("sections.projects.viewAll")}
                <ArrowIcon />
              </ButtonLink>
            ) : null
          }
        />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={(index % 3) * 0.08}>
              <ProjectCard project={project} stackLabel={t("projects.stack")} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

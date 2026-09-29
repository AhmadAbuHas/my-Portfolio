import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { ProjectSummary } from "@/lib/content";

/** Bento grid: with an odd number of cards the first one spans both columns. */
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
  const firstIsLarge = projects.length % 2 === 1;

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
        <ul className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => {
            const large = firstIsLarge && index === 0;
            return (
              <Reveal
                as="li"
                key={project.slug}
                delay={large ? 0 : (index % 2) * 0.08}
                className={large ? "md:col-span-2" : undefined}
              >
                <ProjectCard project={project} large={large} stackLabel={t("projects.stack")} />
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

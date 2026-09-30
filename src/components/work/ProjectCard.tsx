import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { resolveTechIcon, TechIcon } from "@/components/icons";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { TechList } from "@/components/ui/TechChip";
import { LocaleLink } from "@/components/ui/LocaleLink";
import type { ProjectSummary } from "@/lib/content";

/** Up to three distinct logos for a stack (React and React Native count once). */
function distinctLogos(tech: string[]) {
  const seen = new Set<unknown>();
  return tech.filter((name) => {
    const icon = resolveTechIcon(name);
    if (!icon || seen.has(icon)) return false;
    seen.add(icon);
    return true;
  }).slice(0, 3);
}

/**
 * Stand-in when a project has no cover image yet: the project's stack as
 * logos (says something useful, needs no translation), or the monogram.
 */
export function CoverFallback({ tech }: { tech: string[] }) {
  const logos = distinctLogos(tech);
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center gap-6 text-fg-subtle">
        {logos.length > 0 ? (
          logos.map((name) => <TechIcon key={name} name={name} className="size-9" />)
        ) : (
          <span dir="ltr" className="font-display text-4xl font-bold text-fg/80">
            AH<span className="text-accent">.</span>
          </span>
        )}
      </div>
    </div>
  );
}

/** Stretched-link pattern: the whole card is clickable, but only the title is the link name. */
export const stretchedLink =
  "outline-none after:absolute after:inset-0 after:z-10 after:rounded-xl focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent";

/** Compact project card: a 2:1 cover, title, one-line summary and up to 4 tech chips. */
export function ProjectCard({
  project,
  eager = false,
  headingLevel = "h3",
  stackLabel,
}: {
  project: ProjectSummary;
  /** Load the cover immediately (for a card that is visible on first paint). */
  eager?: boolean;
  /** h3 under a section title (home), h2 directly under a page title (lists). */
  headingLevel?: "h2" | "h3";
  stackLabel: string;
}) {
  const Heading = headingLevel;
  return (
    <SpotlightCard className="group flex h-full flex-col rounded-xl border border-border bg-surface transition-colors duration-250">
      <div className="relative aspect-[2/1] overflow-hidden rounded-t-xl border-b border-border bg-surface-2">
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            preload={eager}
            sizes="(min-width: 1024px) 370px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback tech={project.tech} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <Heading className="font-display text-lg leading-snug font-semibold text-balance text-fg">
            <LocaleLink href={`/projects/${project.slug}`} className={stretchedLink}>
              {project.name}
            </LocaleLink>
          </Heading>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-fg-subtle transition-[color,translate] duration-150 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          />
        </div>
        <p className="text-small text-pretty text-fg-muted">{project.summary}</p>
        <TechList items={project.tech} max={4} label={stackLabel} className="mt-auto pt-1" />
      </div>
    </SpotlightCard>
  );
}

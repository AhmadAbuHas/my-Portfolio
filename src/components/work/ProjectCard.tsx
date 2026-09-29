import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { hasTechIcon, TechIcon } from "@/components/icons";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { TechList } from "@/components/ui/TechChip";
import { LocaleLink } from "@/components/ui/LocaleLink";
import type { ProjectSummary } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Stand-in when a project has no cover image yet: the project's stack as large
 * logos (says something useful, needs no translation), or the monogram.
 */
export function CoverFallback({ tech }: { tech: string[] }) {
  const logos = tech.filter(hasTechIcon).slice(0, 3);
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="hero-grid absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center gap-8 text-fg-subtle">
        {logos.length > 0 ? (
          logos.map((name) => <TechIcon key={name} name={name} className="size-12 md:size-14" />)
        ) : (
          <span dir="ltr" className="font-display text-6xl font-bold text-fg/80">
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

export function ProjectCard({
  project,
  large = false,
  eager = false,
  stackLabel,
}: {
  project: ProjectSummary;
  large?: boolean;
  /** Load the cover immediately (for a card that is visible on first paint). */
  eager?: boolean;
  stackLabel: string;
}) {
  return (
    <SpotlightCard className="group flex h-full flex-col rounded-xl border border-border bg-surface transition-colors duration-250">
      <div
        className={cn(
          "relative overflow-hidden rounded-t-xl border-b border-border bg-surface-2",
          large ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]",
        )}
      >
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            preload={eager}
            sizes={large ? "(min-width: 1200px) 1136px, 100vw" : "(min-width: 768px) 560px, 100vw"}
            className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
          />
        ) : (
          <CoverFallback tech={project.tech} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-h3 font-semibold text-balance text-fg">
            <LocaleLink href={`/projects/${project.slug}`} className={stretchedLink}>
              {project.name}
            </LocaleLink>
          </h3>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-fg-subtle transition-[color,translate] duration-150 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          />
        </div>
        <p className="text-pretty text-fg-muted">{project.summary}</p>
        <TechList items={project.tech} max={4} label={stackLabel} className="mt-auto pt-2" />
      </div>
    </SpotlightCard>
  );
}

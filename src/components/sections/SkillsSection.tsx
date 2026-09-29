import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechList } from "@/components/ui/TechChip";
import type { SkillGroup } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * One row per group (name on the start side, chips after it), so groups of
 * very different sizes still line up. No levels or percentages, by design.
 */
export async function SkillsSection({ number, groups }: { number: string; groups: SkillGroup[] }) {
  const t = await getTranslations("sections.skills");

  return (
    <section id="skills" aria-labelledby="skills-title" className="py-10 md:py-16">
      <Container>
        <SectionHeader number={number} eyebrow={t("eyebrow")} title={t("title")} titleId="skills-title" />
        <dl className="border-b border-border">
          {groups.map((group) => {
            const secondary = group.emphasis === "secondary";
            return (
              <Reveal
                key={group.name}
                className="grid gap-4 border-t border-border py-7 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10 md:py-8"
              >
                <dt
                  className={cn(
                    "flex items-baseline gap-3 font-display text-xl font-semibold",
                    secondary ? "text-fg-muted" : "text-fg",
                  )}
                >
                  {group.name}
                  <span aria-hidden="true" className="numeric text-small font-normal text-fg-subtle">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </dt>
                <dd>
                  <TechList items={group.items} muted={secondary} />
                </dd>
              </Reveal>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}

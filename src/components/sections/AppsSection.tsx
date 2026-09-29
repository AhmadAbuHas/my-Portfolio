import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AppCard } from "@/components/work/AppCard";
import type { AppSummary } from "@/lib/content";

export async function AppsSection({
  number,
  apps,
  total,
}: {
  number: string;
  apps: AppSummary[];
  total: number;
}) {
  const t = await getTranslations("sections.apps");

  return (
    <section id="apps" aria-labelledby="apps-title" className="py-10 md:py-16">
      <Container>
        <SectionHeader
          number={number}
          eyebrow={t("eyebrow")}
          title={t("title")}
          titleId="apps-title"
          action={
            total > apps.length ? (
              <ButtonLink href="/apps" variant="ghost">
                {t("viewAll")}
                <ArrowIcon />
              </ButtonLink>
            ) : null
          }
        />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {apps.map((app, index) => (
            <Reveal as="li" key={app.slug} delay={(index % 3) * 0.08}>
              <AppCard app={app} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

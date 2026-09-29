import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Timeline } from "@/components/motion/Timeline";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechList } from "@/components/ui/TechChip";
import type { Locale } from "@/i18n/routing";
import type { ExperienceItem } from "@/lib/content";
import { cn } from "@/lib/cn";
import { formatMonthYear, monthsInclusive, splitMonths, toYearMonth } from "@/lib/dates";

const VISIBLE_ROLES = 4;

type Translator = Awaited<ReturnType<typeof getTranslations>>;

function formatDuration(totalMonths: number, t: Translator) {
  const { years, months } = splitMonths(totalMonths);
  const y = years > 0 ? t("duration.years", { count: years, n: String(years) }) : "";
  const m = months > 0 ? t("duration.months", { count: months, n: String(months) }) : "";
  return y && m ? t("duration.join", { years: y, months: m }) : y || m;
}

function Entry({ item, locale, t }: { item: ExperienceItem; locale: Locale; t: Translator }) {
  const duration = item.endDate ? formatDuration(monthsInclusive(item.startDate, item.endDate), t) : null;

  return (
    <li className="relative ps-10 pb-14 last:pb-0 md:ps-14">
      <span
        aria-hidden="true"
        className={cn(
          "absolute start-0 top-[0.55rem] size-[15px] rounded-full ring-4 ring-bg",
          item.isCurrent ? "pulse-dot bg-accent" : "border-2 border-border-input bg-bg",
        )}
      />
      <Reveal className="grid gap-x-10 gap-y-3 md:grid-cols-[12.5rem_minmax(0,1fr)]">
        <div className="numeric text-small text-fg-subtle md:pt-2">
          <p>
            <time dateTime={toYearMonth(item.startDate)} className="whitespace-nowrap">
              {formatMonthYear(item.startDate, locale)}
            </time>
            {" – "}
            {item.endDate ? (
              <time dateTime={toYearMonth(item.endDate)} className="whitespace-nowrap">
                {formatMonthYear(item.endDate, locale)}
              </time>
            ) : (
              <span className="whitespace-nowrap text-accent">{t("common.present")}</span>
            )}
          </p>
          {duration ? <p className="mt-1">{duration}</p> : null}
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-h3 font-semibold text-balance text-fg">{item.role}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-fg-muted">
            {item.logo ? (
              // Decorative: the company name is right next to it.
              <Image
                src={item.logo}
                alt=""
                width={48}
                height={48}
                className="size-6 rounded-md border border-border bg-surface-2 object-contain"
              />
            ) : null}
            {item.companyUrl ? (
              <a
                href={item.companyUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 font-semibold text-fg underline-offset-4 transition-colors duration-150 hover:text-accent hover:underline"
              >
                <bdi>{item.company}</bdi>
                <ArrowUpRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                <span className="sr-only">{t("common.opensInNewTab")}</span>
              </a>
            ) : (
              <bdi className="font-semibold text-fg">{item.company}</bdi>
            )}
            {item.location ? (
              <>
                <span aria-hidden="true" className="text-fg-subtle">
                  ·
                </span>
                <span>{item.location}</span>
              </>
            ) : null}
            {item.isCurrent ? (
              <Badge tone="accent" dot>
                {t("common.current")}
              </Badge>
            ) : null}
            {item.employmentType !== "full-time" ? (
              <Badge>{t(`experience.employment.${item.employmentType}`)}</Badge>
            ) : null}
          </p>

          {item.highlights.length > 0 ? (
            <ul className="mt-5 space-y-2.5 text-fg-muted">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-pretty">{highlight}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <TechList items={item.tech} label={t("projects.stack")} className="mt-5" />
        </div>
      </Reveal>
    </li>
  );
}

export async function ExperienceSection({
  number,
  locale,
  items,
}: {
  number: string;
  locale: Locale;
  items: ExperienceItem[];
}) {
  const t = await getTranslations();
  const visible = items.slice(0, VISIBLE_ROLES);
  const earlier = items.slice(VISIBLE_ROLES);

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-10 md:py-16">
      <Container>
        <SectionHeader
          number={number}
          eyebrow={t("sections.experience.eyebrow")}
          title={t("sections.experience.title")}
          titleId="experience-title"
        />
        <Timeline
          showEarlierLabel={t("sections.experience.showEarlier", {
            count: earlier.length,
            n: String(earlier.length),
          })}
          hideEarlierLabel={t("sections.experience.hideEarlier")}
          earlier={
            earlier.length > 0 ? (
              <ol start={VISIBLE_ROLES + 1}>
                {earlier.map((item) => (
                  <Entry key={item.slug} item={item} locale={locale} t={t} />
                ))}
              </ol>
            ) : undefined
          }
        >
          <ol>
            {visible.map((item) => (
              <Entry key={item.slug} item={item} locale={locale} t={t} />
            ))}
          </ol>
        </Timeline>
      </Container>
    </section>
  );
}

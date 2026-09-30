import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Profile } from "@/lib/content";
import { cssVars } from "@/lib/style";

type Cta = { href: string; label: string };

/** Splits the headline around the highlighted words (if they appear in it). */
function splitAccent(headline: string, accent: string) {
  const index = accent ? headline.indexOf(accent) : -1;
  if (index === -1) return null;
  return [headline.slice(0, index), accent, headline.slice(index + accent.length)] as const;
}

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div className="flex flex-col-reverse gap-2">
      <dt className="text-small text-fg-subtle">{label}</dt>
      <dd className="numeric text-[clamp(2.25rem,4vw,3rem)] leading-none font-semibold text-fg">
        <span aria-hidden="true">
          <span className="count-up" style={cssVars({ "--target": value })} />
          {suffix ? <span className="text-accent">{suffix}</span> : null}
        </span>
        <span className="sr-only">
          {value}
          {suffix}
        </span>
      </dd>
    </div>
  );
}

export async function Hero({
  profile,
  companies,
  primaryCta,
  secondaryCta,
}: {
  profile: Profile;
  companies: number;
  primaryCta: Cta;
  secondaryCta: Cta & { download?: boolean };
}) {
  const t = await getTranslations("hero");
  const headline = splitAccent(profile.headline, profile.headlineAccent);

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="aurora" />
        <div className="hero-grid absolute inset-0" />
      </div>

      <Container className="flex min-h-[calc(100svh-var(--header-height))] flex-col justify-center py-16 md:py-24">
        {profile.openToWork ? (
          <p
            className="fade-rise eyebrow inline-flex w-fit items-center gap-3 rounded-full border border-border bg-surface/70 px-4 py-2 text-fg"
            style={cssVars({ "--i": 0 })}
          >
            <span aria-hidden="true" className="pulse-dot size-2 rounded-full bg-accent" />
            {t("available")}
          </p>
        ) : null}

        <h1
          id="hero-title"
          className="focus-in mt-8 font-display text-display font-bold text-balance text-fg"
          style={cssVars({ "--i": 1 })}
        >
          {profile.name}
        </h1>

        <p className="mt-5 font-display text-[clamp(1.5rem,3.6vw,2.75rem)] leading-[var(--leading-h2)] font-semibold text-balance text-fg">
          <span className="line-mask">
            <span className="line" style={cssVars({ "--i": 2 })}>
              {headline ? (
                <>
                  {headline[0]}
                  <span className="text-accent">{headline[1]}</span>
                  {headline[2]}
                </>
              ) : (
                profile.headline
              )}
            </span>
          </span>
        </p>

        <p
          className="fade-rise mt-6 max-w-[60ch] text-body text-balance text-fg-muted"
          style={cssVars({ "--i": 4 })}
        >
          {profile.valueProp}
        </p>

        <div className="fade-rise mt-10 flex flex-wrap gap-3" style={cssVars({ "--i": 5 })}>
          <ButtonLink href={primaryCta.href}>
            {primaryCta.label}
            <ArrowIcon />
          </ButtonLink>
          <ButtonLink
            href={secondaryCta.href}
            variant="outline"
            download={secondaryCta.download ? "" : undefined}
          >
            {secondaryCta.download ? <Download aria-hidden="true" className="size-4" /> : null}
            {secondaryCta.label}
          </ButtonLink>
        </div>

        <dl
          aria-label={t("statsLabel")}
          className="fade-rise mt-16 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.8fr)]"
          style={cssVars({ "--i": 6 })}
        >
          {profile.yearsOfExperience > 0 ? (
            <Stat
              value={profile.yearsOfExperience}
              suffix="+"
              label={t("yearsLabel", { count: profile.yearsOfExperience })}
            />
          ) : null}
          {companies > 0 ? (
            <Stat value={companies} label={t("companiesLabel", { count: companies })} />
          ) : null}
          <div className="col-span-2 flex flex-col-reverse gap-2 sm:col-span-1">
            <dt className="text-small text-fg-subtle">{t("focusLabel")}</dt>
            <dd className="font-display text-xl leading-tight font-semibold text-fg sm:pt-2">
              {t("focus")}
            </dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}

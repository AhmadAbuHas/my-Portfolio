import Image from "next/image";
import { Check, GraduationCap, Languages, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Profile } from "@/lib/content";

function Portrait({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-auto w-full max-w-sm md:mx-0">
      {/* Offset lime frame: the bold detail. Mirrors in RTL. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border-2 border-accent rtl:-translate-x-3"
      />
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-surface">
        {profile.portrait ? (
          <Image
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            fill
            sizes="(min-width: 768px) 24rem, 100vw"
            className="object-cover"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
            <div className="hero-grid absolute inset-0" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_60%)]" />
            <span dir="ltr" className="relative font-display text-[7rem] leading-none font-bold text-fg">
              AH<span className="text-accent">.</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export async function AboutSection({ number, profile }: { number: string; profile: Profile }) {
  const t = await getTranslations("sections.about");

  return (
    <section id="about" aria-labelledby="about-title" className="py-10 md:py-16">
      <Container>
        <SectionHeader number={number} eyebrow={t("eyebrow")} title={t("title")} titleId="about-title" />
        <div className="grid items-start gap-14 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <Reveal>
            <Portrait profile={profile} />
          </Reveal>

          <Reveal delay={0.1}>
            {profile.bio ? <RichText content={profile.bio} className="text-body text-pretty" /> : null}

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {profile.education.map((item) => (
                <div key={item.school} className="rounded-xl border border-border bg-surface p-6">
                  <GraduationCap aria-hidden="true" className="size-5 text-accent" />
                  <h3 className="eyebrow mt-4">{t("education")}</h3>
                  <p className="mt-2 font-semibold text-fg">{item.school}</p>
                  <p className="text-fg-muted">{item.degree}</p>
                  {item.startYear || item.endYear ? (
                    <p className="numeric mt-2 text-small text-fg-subtle">
                      {[item.startYear, item.endYear].filter(Boolean).join(" – ")}
                    </p>
                  ) : null}
                </div>
              ))}

              {profile.softSkills.length > 0 ? (
                <div className="rounded-xl border border-border bg-surface p-6">
                  <h3 className="eyebrow">{t("strengths")}</h3>
                  <ul className="mt-4 space-y-3">
                    {profile.softSkills.map((skill) => (
                      <li key={skill} className="flex items-start gap-3 text-fg">
                        <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col gap-3 text-fg-muted">
              {profile.location ? (
                <p className="inline-flex items-center gap-2">
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-accent" />
                  {t("basedIn")} <span className="text-fg">{profile.location}</span>
                </p>
              ) : null}
              {profile.languages.length > 0 ? (
                <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Languages aria-hidden="true" className="size-4 shrink-0 text-accent" />
                  <span className="sr-only">{t("languages")}: </span>
                  {profile.languages.map((language, index) => (
                    <span key={language.name}>
                      {index > 0 ? (
                        <span aria-hidden="true" className="me-2 text-fg-subtle">
                          ·
                        </span>
                      ) : null}
                      <span className="text-fg">{language.name}</span> ({language.level})
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

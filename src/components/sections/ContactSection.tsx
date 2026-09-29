import { Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SocialIcon, socialLabels } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Profile } from "@/lib/content";
import { CopyEmailButton } from "./CopyEmailButton";

export async function ContactSection({
  number,
  profile,
  heading,
  text,
}: {
  number: string;
  profile: Profile;
  heading: string;
  text: string;
}) {
  const t = await getTranslations();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative isolate overflow-hidden mt-10 border-t border-border py-20 md:mt-16 md:py-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-80">
        <div className="aurora" />
      </div>

      <Container>
        <Reveal>
          <p className="eyebrow">
            <span aria-hidden="true" className="text-accent">
              {number}
            </span>
            <span aria-hidden="true" className="mx-2 text-fg-subtle">
              —
            </span>
            {t("sections.contact.eyebrow")}
          </p>
          <h2
            id="contact-title"
            className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,8vw,6rem)] leading-[var(--leading-display)] font-bold text-balance text-fg"
          >
            {heading}
          </h2>
          <p className="mt-6 max-w-[55ch] text-body text-pretty text-fg-muted">{text}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <CopyEmailButton
              email={profile.email}
              labels={{
                copy: t("sections.contact.copyEmail"),
                copied: t("sections.contact.copied"),
              }}
            />
            <ButtonLink href={`mailto:${profile.email}`} variant="outline">
              <Mail aria-hidden="true" className="size-4" />
              {t("sections.contact.sendEmail")}
            </ButtonLink>
          </div>

          {profile.phone ? (
            <p className="mt-6 inline-flex items-center gap-2 text-fg-muted">
              <Phone aria-hidden="true" className="size-4 text-accent" />
              <span className="sr-only">{t("sections.contact.phone")}: </span>
              <a
                href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                dir="ltr"
                className="numeric text-fg underline-offset-4 hover:text-accent hover:underline"
              >
                {profile.phone}
              </a>
            </p>
          ) : null}

          {profile.socials.length > 0 ? (
            <div className="mt-16">
              <h3 className="eyebrow">{t("sections.contact.elsewhere")}</h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {profile.socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer me"
                      className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-border px-4 text-small font-medium text-fg-muted transition-colors duration-150 hover:border-fg-muted hover:text-fg"
                    >
                      <SocialIcon platform={social.platform} className="size-4" />
                      {socialLabels[social.platform]}
                      <span className="sr-only">{t("common.opensInNewTab")}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}

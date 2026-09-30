import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/components/sections/AboutSection";
import { AppsSection } from "@/components/sections/AppsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { Hero } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { getLocaleParam } from "@/i18n/locale";
import {
  getApps,
  getExperience,
  getProfile,
  getProjects,
  getSiteSettings,
  getSkills,
  getVisibleSections,
  pickFeatured,
  type SectionId,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl, localizedPath } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocaleParam(params);
  return pageMetadata({ locale });
}

export default async function HomePage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);

  const [t, profile, settings, sections, experience, skills, projects, apps] = await Promise.all([
    getTranslations("hero"),
    getProfile(locale),
    getSiteSettings(locale),
    getVisibleSections(locale),
    getExperience(locale),
    getSkills(locale),
    getProjects(locale),
    getApps(locale),
  ]);

  const number = (id: SectionId) => String(sections.indexOf(id) + 1).padStart(2, "0");
  const has = (id: SectionId) => sections.includes(id);
  const companies = new Set(experience.map((item) => item.company)).size;

  const workSection = (["projects", "apps", "experience"] as const).find(has);
  const primaryCta = workSection
    ? {
        href: `#${workSection}`,
        label: workSection === "experience" ? t("viewExperience") : t("viewWork"),
      }
    : { href: "#contact", label: t("getInTouch") };
  const secondaryCta = profile.resumeUrl
    ? { href: profile.resumeUrl, label: t("downloadCv"), download: true }
    : { href: "#contact", label: t("getInTouch") };

  const current = experience.find((item) => item.isCurrent);
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.headline,
    description: profile.valueProp,
    url: `${getSiteUrl()}${localizedPath(locale)}`,
    email: `mailto:${profile.email}`,
    ...(profile.location
      ? { address: { "@type": "PostalAddress", addressLocality: profile.location } }
      : {}),
    ...(current ? { worksFor: { "@type": "Organization", name: current.company } } : {}),
    alumniOf: profile.education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.school })),
    knowsAbout: skills.flatMap((group) => group.items),
    // Profile pages only; a WhatsApp chat link isn't a profile.
    sameAs: profile.socials.filter((social) => social.platform !== "whatsapp").map((social) => social.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero
        profile={profile}
        companies={companies}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
      />
      {has("projects") ? (
        <ProjectsSection
          number={number("projects")}
          projects={pickFeatured(projects)}
          total={projects.length}
        />
      ) : null}
      {has("apps") ? (
        <AppsSection number={number("apps")} apps={pickFeatured(apps)} total={apps.length} />
      ) : null}
      {has("experience") ? (
        <ExperienceSection number={number("experience")} locale={locale} items={experience} />
      ) : null}
      {has("skills") ? <SkillsSection number={number("skills")} groups={skills} /> : null}
      {has("about") ? <AboutSection number={number("about")} profile={profile} /> : null}
      {has("contact") ? (
        <ContactSection
          number={number("contact")}
          profile={profile}
          heading={settings.contactHeading}
          text={settings.contactText}
        />
      ) : null}
    </>
  );
}

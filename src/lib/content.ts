import "server-only";
import { cache } from "react";
import type { Node } from "@markdoc/markdoc";
import type { Locale } from "@/i18n/routing";
import { monthsSince } from "./dates";
import { reader } from "./reader";

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

type Localized = { en: string; ar: string };

/** The locale's value, falling back to English when the translation is empty. */
function text(value: Localized, locale: Locale) {
  return value[locale]?.trim() || value.en.trim();
}

export type ImageAsset = { src: string; alt: string };

type OptionalImageValue =
  | { discriminant: false; value: null }
  | { discriminant: true; value: { src: string; alt: Localized } };

function optionalImage(image: OptionalImageValue, locale: Locale): ImageAsset | null {
  return image.discriminant
    ? { src: image.value.src, alt: text(image.value.alt, locale) }
    : null;
}

function imageList(images: readonly { src: string; alt: Localized }[], locale: Locale) {
  return images.map((image) => ({ src: image.src, alt: text(image.alt, locale) }));
}

/** Rich text plus the language it is actually written in (English is the fallback). */
export type RichContent = { node: Node; lang: Locale };

function hasContent(node: Node): boolean {
  if (node.type === "text") return String(node.attributes.content ?? "").trim() !== "";
  if (node.type === "image") return true;
  return node.children.some(hasContent);
}

function richText(
  byLocale: Record<Locale, { node: Node }>,
  locale: Locale,
): RichContent | null {
  if (hasContent(byLocale[locale].node)) return { node: byLocale[locale].node, lang: locale };
  if (locale !== "en" && hasContent(byLocale.en.node)) return { node: byLocale.en.node, lang: "en" };
  return null;
}

const byOrderThenName = <T extends { order: number; name: string }>(a: T, b: T) =>
  a.order - b.order || a.name.localeCompare(b.name);

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

export type SocialPlatform = "linkedin" | "github" | "x" | "dribbble" | "whatsapp" | "other";

export type Profile = {
  name: string;
  headline: string;
  headlineAccent: string;
  valueProp: string;
  location: string;
  openToWork: boolean;
  yearsOfExperience: number;
  portrait: ImageAsset | null;
  bio: RichContent | null;
  email: string;
  phone: string | null;
  socials: { platform: SocialPlatform; url: string }[];
  resumeUrl: string | null;
  education: {
    school: string;
    degree: string;
    startYear: number | null;
    endYear: number | null;
  }[];
  softSkills: string[];
};

export const getProfile = cache(async (locale: Locale): Promise<Profile> => {
  const p = await reader.singletons.profile.readOrThrow({ resolveLinkedFiles: true });

  return {
    name: text(p.name, locale),
    headline: text(p.headline, locale),
    headlineAccent: text(p.headlineAccent, locale),
    valueProp: text(p.valueProp, locale),
    location: text(p.location, locale),
    openToWork: p.openToWork,
    yearsOfExperience: Math.max(0, Math.floor(monthsSince(p.careerStart) / 12)),
    portrait: optionalImage(p.portrait as OptionalImageValue, locale),
    bio: richText({ en: p.bioEn, ar: p.bioAr }, locale),
    email: p.email,
    phone: p.showPhone && p.phone.trim() ? p.phone.trim() : null,
    socials: p.socials.map((s) => ({ platform: s.platform, url: s.url })),
    resumeUrl: (locale === "ar" ? p.resumeAr : null) ?? p.resumeEn ?? null,
    education: p.education.map((e) => ({
      school: text(e.school, locale),
      degree: text(e.degree, locale),
      startYear: e.startYear,
      endYear: e.endYear,
    })),
    softSkills: p.softSkills.map((s) => text(s, locale)),
  };
});

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

export type SectionId = "projects" | "apps" | "experience" | "skills" | "about" | "contact";

export const getSiteSettings = cache(async (locale: Locale) => {
  const s = await reader.singletons.siteSettings.readOrThrow();
  return {
    seoTitle: text(s.seoTitle, locale),
    seoDescription: text(s.seoDescription, locale),
    ogImage: (locale === "ar" ? s.ogImageAr : null) ?? s.ogImageEn ?? null,
    contactHeading: text(s.contactHeading, locale),
    contactText: text(s.contactText, locale),
    sections: s.sections as Record<SectionId, boolean>,
  };
});

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

export type SkillGroup = {
  name: string;
  emphasis: "primary" | "secondary";
  items: string[];
};

export const getSkills = cache(async (locale: Locale): Promise<SkillGroup[]> => {
  const s = await reader.singletons.skills.readOrThrow();
  const groups = s.groups
    .map((g) => ({ name: text(g.name, locale), emphasis: g.emphasis, items: [...g.items] }))
    .filter((g) => g.items.length > 0);
  // Current stack first, earlier experience last (stable within each group).
  return [
    ...groups.filter((g) => g.emphasis === "primary"),
    ...groups.filter((g) => g.emphasis === "secondary"),
  ];
});

/* -------------------------------------------------------------------------- */
/* Experience                                                                 */
/* -------------------------------------------------------------------------- */

export type EmploymentType = "full-time" | "part-time" | "contract" | "freelance" | "internship";

export type ExperienceItem = {
  slug: string;
  company: string;
  role: string;
  employmentType: EmploymentType;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  companyUrl: string | null;
  logo: string | null;
  highlights: string[];
  tech: string[];
};

export const getExperience = cache(async (locale: Locale): Promise<ExperienceItem[]> => {
  const entries = await reader.collections.experience.all();
  return entries
    .map(({ slug, entry }) => ({
      slug,
      company: entry.company,
      role: text(entry.role, locale),
      employmentType: entry.employmentType,
      location: text(entry.location, locale),
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.endDate === null,
      companyUrl: entry.companyUrl,
      logo: entry.logo,
      highlights: entry.highlights.map((h) => text(h, locale)).filter(Boolean),
      tech: [...entry.tech],
    }))
    .sort(
      (a, b) =>
        Number(b.isCurrent) - Number(a.isCurrent) || b.startDate.localeCompare(a.startDate),
    );
});

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export type ProjectSummary = {
  slug: string;
  name: string;
  summary: string;
  cover: ImageAsset | null;
  tech: string[];
  featured: boolean;
  order: number;
};

export type ProjectDetail = ProjectSummary & {
  role: string;
  client: string;
  startDate: string | null;
  endDate: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  gallery: ImageAsset[];
  body: RichContent | null;
};

export const getProjects = cache(async (locale: Locale): Promise<ProjectSummary[]> => {
  const entries = await reader.collections.projects.all();
  return entries
    .map(({ slug, entry }) => ({
      slug,
      name: locale === "ar" ? entry.titleAr.trim() || entry.title : entry.title,
      summary: text(entry.summary, locale),
      cover: optionalImage(entry.cover as OptionalImageValue, locale),
      tech: [...entry.tech],
      featured: entry.featured,
      order: entry.order ?? 10,
    }))
    .sort(byOrderThenName);
});

export const getProject = cache(
  async (slug: string, locale: Locale): Promise<ProjectDetail | null> => {
    const entry = await reader.collections.projects.read(slug, { resolveLinkedFiles: true });
    if (!entry) return null;
    return {
      slug,
      name: locale === "ar" ? entry.titleAr.trim() || entry.title : entry.title,
      summary: text(entry.summary, locale),
      cover: optionalImage(entry.cover as OptionalImageValue, locale),
      tech: [...entry.tech],
      featured: entry.featured,
      order: entry.order ?? 10,
      role: text(entry.role, locale),
      client: entry.client.trim(),
      startDate: entry.startDate,
      endDate: entry.endDate,
      liveUrl: entry.liveUrl,
      repoUrl: entry.repoUrl,
      gallery: imageList(entry.gallery, locale),
      body: richText({ en: entry.bodyEn, ar: entry.bodyAr }, locale),
    };
  },
);

export const getProjectSlugs = cache(() => reader.collections.projects.list());

/* -------------------------------------------------------------------------- */
/* Apps                                                                       */
/* -------------------------------------------------------------------------- */

export type AppPlatform = "ios" | "android" | "web" | "desktop";
export type AppStatus = "live" | "beta" | "in-development" | "archived";

export type AppSummary = {
  slug: string;
  name: string;
  summary: string;
  icon: string | null;
  platforms: AppPlatform[];
  status: AppStatus;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  webUrl: string | null;
  tech: string[];
  featured: boolean;
  order: number;
};

export type AppDetail = AppSummary & {
  screenshots: ImageAsset[];
  body: RichContent | null;
};

export const getApps = cache(async (locale: Locale): Promise<AppSummary[]> => {
  const entries = await reader.collections.apps.all();
  return entries
    .map(({ slug, entry }) => ({
      slug,
      name: locale === "ar" ? entry.nameAr.trim() || entry.name : entry.name,
      summary: text(entry.summary, locale),
      icon: entry.icon,
      platforms: [...entry.platforms],
      status: entry.status,
      appStoreUrl: entry.appStoreUrl,
      playStoreUrl: entry.playStoreUrl,
      webUrl: entry.webUrl,
      tech: [...entry.tech],
      featured: entry.featured,
      order: entry.order ?? 10,
    }))
    .sort(byOrderThenName);
});

export const getApp = cache(async (slug: string, locale: Locale): Promise<AppDetail | null> => {
  const entry = await reader.collections.apps.read(slug, { resolveLinkedFiles: true });
  if (!entry) return null;
  return {
    slug,
    name: locale === "ar" ? entry.nameAr.trim() || entry.name : entry.name,
    summary: text(entry.summary, locale),
    icon: entry.icon,
    platforms: [...entry.platforms],
    status: entry.status,
    appStoreUrl: entry.appStoreUrl,
    playStoreUrl: entry.playStoreUrl,
    webUrl: entry.webUrl,
    tech: [...entry.tech],
    featured: entry.featured,
    order: entry.order ?? 10,
    screenshots: imageList(entry.screenshots, locale),
    body: richText({ en: entry.bodyEn, ar: entry.bodyAr }, locale),
  };
});

export const getAppSlugs = cache(() => reader.collections.apps.list());

/* -------------------------------------------------------------------------- */
/* Home page composition                                                      */
/* -------------------------------------------------------------------------- */

/** Featured items, or the first few when nothing is marked as featured. */
export function pickFeatured<T extends { featured: boolean }>(items: T[], fallbackCount = 3) {
  const featured = items.filter((item) => item.featured);
  return featured.length > 0 ? featured : items.slice(0, fallbackCount);
}

/**
 * Home sections in display order. A section shows when it is switched on in
 * Site settings and (for Projects/Apps) has at least one entry.
 */
export const getVisibleSections = cache(async (locale: Locale): Promise<SectionId[]> => {
  const [settings, projects, apps, experience, skills] = await Promise.all([
    getSiteSettings(locale),
    getProjects(locale),
    getApps(locale),
    getExperience(locale),
    getSkills(locale),
  ]);
  const hasContent: Record<SectionId, boolean> = {
    projects: projects.length > 0,
    apps: apps.length > 0,
    experience: experience.length > 0,
    skills: skills.length > 0,
    about: true,
    contact: true,
  };
  const order: SectionId[] = ["projects", "apps", "experience", "skills", "about", "contact"];
  return order.filter((id) => settings.sections[id] && hasContent[id]);
});

import "server-only";
import type { Locale } from "@/i18n/routing";
import {
  getExperience,
  getProfile,
  getSiteSettings,
  getSkills,
  type AppDetail,
  type ProjectDetail,
} from "./content";
import { getSiteUrl, localizedPath } from "./site";

// Schema.org JSON-LD built from Keystatic content, so Google can connect the
// site, the person (Ahmad) and his work as one entity.

const absolute = (path: string) => `${getSiteUrl()}${path}`;
const personId = () => `${getSiteUrl()}/#person`;
const websiteId = () => `${getSiteUrl()}/#website`;

/** The site owner, from the Profile, Experience and Skills content. */
async function personNode(locale: Locale) {
  const other: Locale = locale === "en" ? "ar" : "en";
  const [profile, otherProfile, experience, skills] = await Promise.all([
    getProfile(locale),
    getProfile(other),
    getExperience(locale),
    getSkills(locale),
  ]);
  const current = experience.find((item) => item.isCurrent);

  return {
    "@type": "Person",
    "@id": personId(),
    name: profile.name,
    alternateName: otherProfile.name !== profile.name ? otherProfile.name : undefined,
    url: absolute(localizedPath(locale)),
    image: profile.portrait ? absolute(profile.portrait.src) : undefined,
    jobTitle: profile.headline,
    description: profile.valueProp,
    email: `mailto:${profile.email}`,
    address: profile.location
      ? { "@type": "PostalAddress", addressLocality: profile.location }
      : undefined,
    worksFor: current
      ? { "@type": "Organization", name: current.company, url: current.companyUrl ?? undefined }
      : undefined,
    alumniOf: profile.education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.school })),
    knowsAbout: skills.filter((group) => group.emphasis === "primary").flatMap((group) => group.items),
    knowsLanguage: profile.languages.map((language) => language.name),
    // Profile pages only; a WhatsApp chat link isn't a profile.
    sameAs: profile.socials.filter((social) => social.platform !== "whatsapp").map((social) => social.url),
  };
}

/** A minimal reference to the person, for pages other than the profile page. */
async function personRef(locale: Locale) {
  const profile = await getProfile(locale);
  return { "@type": "Person", "@id": personId(), name: profile.name, url: absolute(localizedPath(locale)) };
}

async function websiteNode(locale: Locale) {
  const [profile, settings] = await Promise.all([getProfile(locale), getSiteSettings(locale)]);
  return {
    "@type": "WebSite",
    "@id": websiteId(),
    url: getSiteUrl(),
    name: profile.name,
    description: settings.seoDescription,
    inLanguage: ["en", "ar"],
    publisher: { "@id": personId() },
  };
}

function breadcrumb(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(localizedPath(locale, item.path)),
    })),
  };
}

/** Home page: Google's ProfilePage, with the person as its main entity. */
export async function homeGraph(locale: Locale) {
  const [person, website, settings] = await Promise.all([
    personNode(locale),
    websiteNode(locale),
    getSiteSettings(locale),
  ]);
  const url = absolute(localizedPath(locale));
  return {
    "@context": "https://schema.org",
    "@graph": [
      website,
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: settings.seoTitle,
        inLanguage: locale,
        isPartOf: { "@id": websiteId() },
        dateModified: new Date().toISOString(),
        mainEntity: person,
      },
    ],
  };
}

/** A listing page (all projects or all apps). */
export async function collectionGraph(
  locale: Locale,
  page: { name: string; path: string; homeLabel: string },
  items: { name: string; path: string }[],
) {
  const url = absolute(localizedPath(locale, page.path));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: page.name,
        inLanguage: locale,
        isPartOf: { "@id": websiteId() },
        author: await personRef(locale),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            url: absolute(localizedPath(locale, item.path)),
          })),
        },
      },
      breadcrumb(locale, [
        { name: page.homeLabel, path: "" },
        { name: page.name, path: page.path },
      ]),
    ],
  };
}

/** A project case study page. */
export async function projectGraph(
  locale: Locale,
  project: ProjectDetail,
  labels: { home: string; projects: string },
) {
  const path = `/projects/${project.slug}`;
  const url = absolute(localizedPath(locale, path));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: project.name,
        description: project.summary,
        inLanguage: locale,
        image: project.cover ? absolute(project.cover.src) : undefined,
        keywords: project.tech.join(", "),
        dateCreated: project.startDate ?? undefined,
        sameAs: project.liveUrl ?? undefined,
        creator: await personRef(locale),
        isPartOf: { "@id": websiteId() },
      },
      breadcrumb(locale, [
        { name: labels.home, path: "" },
        { name: labels.projects, path: "/projects" },
        { name: project.name, path },
      ]),
    ],
  };
}

const operatingSystems = { ios: "iOS", android: "Android", web: "Web", desktop: "Desktop" } as const;

/** An app page. */
export async function appGraph(locale: Locale, app: AppDetail, labels: { home: string; apps: string }) {
  const path = `/apps/${app.slug}`;
  const url = absolute(localizedPath(locale, path));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        url,
        name: app.name,
        description: app.summary,
        inLanguage: locale,
        image: app.icon ? absolute(app.icon) : undefined,
        operatingSystem: app.platforms.map((platform) => operatingSystems[platform]).join(", ") || undefined,
        installUrl: app.appStoreUrl ?? app.playStoreUrl ?? app.webUrl ?? undefined,
        keywords: app.tech.join(", "),
        author: await personRef(locale),
        isPartOf: { "@id": websiteId() },
      },
      breadcrumb(locale, [
        { name: labels.home, path: "" },
        { name: labels.apps, path: "/apps" },
        { name: app.name, path },
      ]),
    ],
  };
}

/** "React, Next.js and NestJS" / "React وNext.js وNestJS" for meta descriptions. */
export function techList(locale: Locale, tech: string[]) {
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(tech);
}

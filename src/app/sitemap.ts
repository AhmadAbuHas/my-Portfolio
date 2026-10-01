import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAppSlugs, getProjectSlugs } from "@/lib/content";
import { getSiteUrl, localizedPath } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [projectSlugs, appSlugs] = await Promise.all([getProjectSlugs(), getAppSlugs()]);

  const paths = [
    "",
    ...(projectSlugs.length > 0 ? ["/projects", ...projectSlugs.map((slug) => `/projects/${slug}`)] : []),
    ...(appSlugs.length > 0 ? ["/apps", ...appSlugs.map((slug) => `/apps/${slug}`)] : []),
  ];

  // Every content change triggers a rebuild, so the build time is the last update.
  const lastModified = new Date();

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${base}${localizedPath(locale, path)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${base}${localizedPath(l, path)}`]),
        ),
      },
    })),
  );
}

import type { Node } from "@markdoc/markdoc";
import { getExperience, getProfile, getProjects, getSiteSettings, getSkills } from "@/lib/content";
import { formatMonthYear } from "@/lib/dates";
import { getSiteUrl, localizedPath } from "@/lib/site";

// /llms.txt (llmstxt.org): a plain Markdown summary for AI assistants such as
// ChatGPT, Claude, Perplexity and Gemini. Built from Keystatic content at build
// time, so it updates with every content change.
export const dynamic = "force-static";

function plainText(node: Node): string {
  if (node.type === "text") return String(node.attributes.content ?? "");
  if (node.type === "softbreak" || node.type === "hardbreak") return " ";
  const inner = node.children.map(plainText).join("");
  if (node.type === "paragraph" || node.type === "heading") return `${inner.trim()}\n\n`;
  if (node.type === "item") return `- ${inner.trim()}\n`;
  return inner;
}

export async function GET() {
  const [profile, arabicProfile, settings, experience, projects, skills] = await Promise.all([
    getProfile("en"),
    getProfile("ar"),
    getSiteSettings("en"),
    getExperience("en"),
    getProjects("en"),
    getSkills("en"),
  ]);
  const site = getSiteUrl();
  const url = (path = "") => `${site}${localizedPath("en", path)}`;
  const current = experience.find((item) => item.isCurrent);

  const lines: string[] = [
    `# ${profile.name}`,
    "",
    `> ${settings.seoDescription}`,
    "",
    `${profile.name} (Arabic: ${arabicProfile.name}) is a ${profile.headline}` +
      (current ? `, currently at ${current.company}` : "") +
      (profile.location ? `, based in ${profile.location}` : "") +
      ". " +
      `He has ${profile.yearsOfExperience}+ years of professional experience.`,
    "",
  ];

  if (profile.bio && profile.bio.lang === "en") {
    lines.push(plainText(profile.bio.node).trim(), "");
  }

  lines.push(
    "## Pages",
    "",
    `- [Portfolio (English)](${url()}): profile, experience, skills and contact`,
    `- [Portfolio (Arabic)](${site}${localizedPath("ar")}): the same content in Arabic`,
    `- [Projects](${url("/projects")}): all projects with their tech stacks`,
    "",
    "## Experience",
    "",
  );

  for (const item of experience) {
    const dates = `${formatMonthYear(item.startDate, "en")} – ${item.endDate ? formatMonthYear(item.endDate, "en") : "Present"}`;
    const parts = [`- **${item.role}** at ${item.company} (${dates}${item.location ? `, ${item.location}` : ""}).`];
    if (item.companyIntro) parts.push(item.companyIntro);
    if (item.highlights.length) parts.push(item.highlights.join(" "));
    if (item.tech.length) parts.push(`Tech: ${item.tech.join(", ")}.`);
    lines.push(parts.join(" "));
  }

  lines.push("", "## Projects", "");
  for (const project of projects) {
    const tech = project.tech.length ? ` Tech: ${project.tech.join(", ")}.` : "";
    lines.push(`- [${project.name}](${url(`/projects/${project.slug}`)}): ${project.summary}${tech}`);
  }

  lines.push("", "## Skills", "");
  for (const group of skills) lines.push(`- ${group.name}: ${group.items.join(", ")}`);

  lines.push("", "## Education and languages", "");
  for (const item of profile.education) {
    const years = [item.startYear, item.endYear].filter(Boolean).join("–");
    lines.push(`- ${item.degree}, ${item.school}${years ? ` (${years})` : ""}`);
  }
  if (profile.languages.length) {
    lines.push(`- Languages: ${profile.languages.map((l) => `${l.name} (${l.level})`).join(", ")}`);
  }

  lines.push("", "## Contact", "", `- Website: ${site}`);
  for (const email of [profile.email, ...profile.otherEmails]) lines.push(`- Email: ${email}`);
  for (const social of profile.socials.filter((s) => s.platform === "linkedin" || s.platform === "github")) {
    lines.push(`- ${social.platform === "linkedin" ? "LinkedIn" : "GitHub"}: ${social.url}`);
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

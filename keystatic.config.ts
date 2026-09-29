import { collection, config, fields, singleton } from "@keystatic/core";
import { keystaticGithubRepo } from "./src/lib/keystatic-env";

/* -------------------------------------------------------------------------- */
/* Field helpers                                                              */
/* -------------------------------------------------------------------------- */

type LocalizedTextOptions = {
  multiline?: boolean;
  description?: string;
  required?: boolean;
};

/** A text field with an English and an Arabic value, edited side by side. */
function localizedText(label: string, options: LocalizedTextOptions = {}) {
  const isRequired = options.required ?? true;
  return fields.object(
    {
      en: fields.text({
        label: `${label} · English`,
        multiline: options.multiline,
        validation: { isRequired },
      }),
      ar: fields.text({
        label: `${label} · العربية`,
        multiline: options.multiline,
        validation: { isRequired },
      }),
    },
    { label, description: options.description, layout: [6, 6] },
  );
}

/** An image that is optional, but requires alt text in both languages once added. */
function optionalImage(label: string, folder: string, description?: string) {
  return fields.conditional(
    fields.checkbox({ label, description, defaultValue: false }),
    {
      true: fields.object({
        src: fields.image({
          label: "Image",
          directory: `public/images/${folder}`,
          publicPath: `/images/${folder}/`,
          validation: { isRequired: true },
        }),
        alt: localizedText("Alt text", {
          description: "Describe the image for people using screen readers.",
        }),
      }),
      false: fields.empty(),
    },
  );
}

/** A list of images, each with required bilingual alt text. */
function imageList(label: string, folder: string, description?: string) {
  return fields.array(
    fields.object({
      src: fields.image({
        label: "Image",
        directory: `public/images/${folder}`,
        publicPath: `/images/${folder}/`,
        validation: { isRequired: true },
      }),
      alt: localizedText("Alt text", {
        description: "Describe the image for people using screen readers.",
      }),
    }),
    {
      label,
      description,
      itemLabel: (props) => props.fields.alt.fields.en.value || "Image",
    },
  );
}

function techList(description?: string) {
  return fields.array(
    fields.text({ label: "Technology", validation: { isRequired: true } }),
    {
      label: "Tech stack",
      description:
        description ??
        "One technology per item, e.g. React, NestJS. Known names get a logo automatically.",
      itemLabel: (props) => props.value || "Technology",
    },
  );
}

const bioEditor = {
  heading: false,
  image: false,
  table: false,
  codeBlock: false,
  code: false,
  blockquote: false,
  divider: false,
  strikethrough: false,
} as const;

function caseStudyEditor(folder: string) {
  return {
    heading: [2, 3] as const,
    table: false,
    image: {
      directory: `public/images/${folder}`,
      publicPath: `/images/${folder}/`,
    },
  };
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------------------------------------------------------- */
/* Config                                                                     */
/* -------------------------------------------------------------------------- */

export default config({
  // Local mode by default (edits write straight to /content). GitHub mode once
  // NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO is set: every save becomes a commit,
  // which triggers a redeploy. See src/lib/keystatic-env.ts.
  storage: keystaticGithubRepo ? { kind: "github", repo: keystaticGithubRepo } : { kind: "local" },

  ui: {
    brand: { name: "Portfolio CMS" },
    navigation: {
      "About you": ["profile", "skills"],
      Work: ["experience", "projects", "apps"],
      Site: ["siteSettings"],
    },
  },

  singletons: {
    profile: singleton({
      label: "Profile",
      path: "content/profile/",
      format: { data: "yaml" },
      schema: {
        name: localizedText("Full name"),
        headline: localizedText("Headline", {
          description: "Your title, e.g. “Senior Full-Stack Engineer”.",
        }),
        headlineAccent: localizedText("Highlighted words", {
          required: false,
          description:
            "Part of the headline to show in lime, e.g. “Full-Stack”. Must match the headline exactly.",
        }),
        valueProp: localizedText("Value proposition", {
          multiline: true,
          description: "One sentence under your headline (about 160 characters max).",
        }),
        location: localizedText("Location"),
        openToWork: fields.checkbox({
          label: "Show the “Available for opportunities” badge",
          defaultValue: true,
        }),
        careerStart: fields.date({
          label: "Professional career start",
          description: "Used to calculate “N+ years of experience”.",
          validation: { isRequired: true },
        }),
        portrait: optionalImage(
          "Portrait photo",
          "profile",
          "A 4:5 portrait works best (at least 800×1000).",
        ),
        bioEn: fields.markdoc({ label: "About · English", options: bioEditor }),
        bioAr: fields.markdoc({ label: "About · العربية", options: bioEditor }),
        email: fields.text({
          label: "Email",
          validation: {
            isRequired: true,
            pattern: { regex: emailPattern, message: "Enter a valid email address." },
          },
        }),
        phone: fields.text({
          label: "Phone",
          description:
            "Saved in the repository. Only shown on the site if the toggle below is on.",
        }),
        showPhone: fields.checkbox({
          label: "Show phone number publicly",
          defaultValue: false,
        }),
        socials: fields.array(
          fields.object({
            platform: fields.select({
              label: "Platform",
              options: [
                { label: "LinkedIn", value: "linkedin" },
                { label: "GitHub", value: "github" },
                { label: "X (Twitter)", value: "x" },
                { label: "Dribbble", value: "dribbble" },
                { label: "WhatsApp", value: "whatsapp" },
                { label: "Other", value: "other" },
              ],
              defaultValue: "linkedin",
            }),
            url: fields.url({ label: "URL", validation: { isRequired: true } }),
          }),
          {
            label: "Social links",
            itemLabel: (props) => props.fields.platform.value,
          },
        ),
        resumeEn: fields.file({
          label: "CV · English (PDF)",
          directory: "public/files",
          publicPath: "/files/",
        }),
        resumeAr: fields.file({
          label: "CV · العربية (PDF)",
          description: "Optional. The English CV is used when this is empty.",
          directory: "public/files",
          publicPath: "/files/",
        }),
        education: fields.array(
          fields.object({
            school: localizedText("School"),
            degree: localizedText("Degree"),
            startYear: fields.integer({ label: "Start year" }),
            endYear: fields.integer({ label: "End year" }),
          }),
          {
            label: "Education",
            itemLabel: (props) => props.fields.school.fields.en.value || "School",
          },
        ),
        softSkills: fields.array(localizedText("Soft skill"), {
          label: "Soft skills",
          itemLabel: (props) => props.fields.en.value || "Soft skill",
        }),
      },
    }),

    skills: singleton({
      label: "Skills",
      path: "content/skills/",
      format: { data: "yaml" },
      schema: {
        groups: fields.array(
          fields.object({
            name: localizedText("Group name"),
            emphasis: fields.select({
              label: "Emphasis",
              description: "Secondary groups are shown quieter, at the end.",
              options: [
                { label: "Primary · current stack", value: "primary" },
                { label: "Secondary · earlier experience", value: "secondary" },
              ],
              defaultValue: "primary",
            }),
            items: fields.array(
              fields.text({ label: "Skill", validation: { isRequired: true } }),
              {
                label: "Skills",
                description: "Known technology names get a logo automatically.",
                itemLabel: (props) => props.value || "Skill",
              },
            ),
          }),
          {
            label: "Skill groups",
            itemLabel: (props) => props.fields.name.fields.en.value || "Group",
          },
        ),
      },
    }),

    siteSettings: singleton({
      label: "Site settings",
      path: "content/site-settings/",
      format: { data: "yaml" },
      schema: {
        seoTitle: localizedText("SEO title", {
          description: "Browser tab and search result title (60 characters max).",
        }),
        seoDescription: localizedText("SEO description", {
          multiline: true,
          description: "Search result description (160 characters max).",
        }),
        ogImageEn: fields.image({
          label: "Social share image · English",
          description: "1200×630 PNG or JPG. A generated image is used when empty.",
          directory: "public/images/og",
          publicPath: "/images/og/",
        }),
        ogImageAr: fields.image({
          label: "Social share image · العربية",
          description: "1200×630 PNG or JPG. Falls back to the English image.",
          directory: "public/images/og",
          publicPath: "/images/og/",
        }),
        contactHeading: localizedText("Contact heading"),
        contactText: localizedText("Contact text", { multiline: true }),
        sections: fields.object(
          {
            projects: fields.checkbox({ label: "Projects", defaultValue: true }),
            apps: fields.checkbox({ label: "Apps", defaultValue: true }),
            experience: fields.checkbox({ label: "Experience", defaultValue: true }),
            skills: fields.checkbox({ label: "Skills", defaultValue: true }),
            about: fields.checkbox({ label: "About", defaultValue: true }),
            contact: fields.checkbox({ label: "Contact", defaultValue: true }),
          },
          {
            label: "Home page sections",
            description:
              "Turn sections on or off. Projects and Apps also hide automatically while they are empty.",
            layout: [4, 4, 4, 4, 4, 4],
          },
        ),
      },
    }),
  },

  collections: {
    experience: collection({
      label: "Experience",
      slugField: "company",
      path: "content/experience/*",
      format: { data: "yaml" },
      columns: ["company", "startDate"],
      schema: {
        company: fields.slug({
          name: { label: "Company", validation: { isRequired: true } },
        }),
        role: localizedText("Role"),
        employmentType: fields.select({
          label: "Employment type",
          description: "Full-time is not labelled on the site; the others show a badge.",
          options: [
            { label: "Full-time", value: "full-time" },
            { label: "Part-time", value: "part-time" },
            { label: "Contract", value: "contract" },
            { label: "Freelance", value: "freelance" },
            { label: "Internship", value: "internship" },
          ],
          defaultValue: "full-time",
        }),
        location: localizedText("Location", { required: false }),
        startDate: fields.date({
          label: "Start date",
          validation: { isRequired: true },
        }),
        endDate: fields.date({
          label: "End date",
          description: "Leave empty if this is your current role.",
        }),
        companyUrl: fields.url({ label: "Company website" }),
        logo: fields.image({
          label: "Company logo",
          description: "Square PNG or SVG works best.",
          directory: "public/images/experience",
          publicPath: "/images/experience/",
        }),
        highlights: fields.array(localizedText("Highlight", { multiline: true }), {
          label: "Highlights",
          description:
            "2–3 impact bullets: verb + what + measurable result. E.g. “Built a Mapbox dashboard used by 40 clients.”",
          itemLabel: (props) => props.fields.en.value || "Highlight",
        }),
        tech: techList(),
      },
    }),

    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*/",
      format: { data: "yaml" },
      columns: ["title", "order"],
      schema: {
        title: fields.slug({
          name: { label: "Title · English", validation: { isRequired: true } },
          slug: { label: "URL slug" },
        }),
        titleAr: fields.text({
          label: "Title · العربية",
          validation: { isRequired: true },
        }),
        summary: localizedText("One-line summary", { multiline: true }),
        cover: optionalImage("Cover image", "projects", "16:10 works best (at least 1600×1000)."),
        role: localizedText("Your role", { required: false }),
        client: fields.text({ label: "Client or company" }),
        startDate: fields.date({ label: "Start date" }),
        endDate: fields.date({ label: "End date" }),
        tech: techList(),
        liveUrl: fields.url({ label: "Live URL" }),
        repoUrl: fields.url({ label: "Source code URL" }),
        featured: fields.checkbox({
          label: "Feature on the home page",
          defaultValue: true,
        }),
        order: fields.integer({
          label: "Sort order",
          description: "Lower numbers come first.",
          defaultValue: 10,
        }),
        gallery: imageList("Gallery", "projects"),
        bodyEn: fields.markdoc({
          label: "Case study · English",
          description: "Problem → approach → result.",
          options: caseStudyEditor("projects"),
        }),
        bodyAr: fields.markdoc({
          label: "Case study · العربية",
          options: caseStudyEditor("projects"),
        }),
      },
    }),

    apps: collection({
      label: "Apps",
      slugField: "name",
      path: "content/apps/*/",
      format: { data: "yaml" },
      columns: ["name", "status"],
      schema: {
        name: fields.slug({
          name: { label: "App name · English", validation: { isRequired: true } },
          slug: { label: "URL slug" },
        }),
        nameAr: fields.text({
          label: "App name · العربية",
          validation: { isRequired: true },
        }),
        summary: localizedText("One-line summary", { multiline: true }),
        icon: fields.image({
          label: "App icon",
          description: "Square, at least 512×512.",
          directory: "public/images/apps",
          publicPath: "/images/apps/",
        }),
        platforms: fields.multiselect({
          label: "Platforms",
          options: [
            { label: "iOS", value: "ios" },
            { label: "Android", value: "android" },
            { label: "Web", value: "web" },
            { label: "Desktop", value: "desktop" },
          ],
          defaultValue: [],
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Live", value: "live" },
            { label: "Beta", value: "beta" },
            { label: "In development", value: "in-development" },
            { label: "Archived", value: "archived" },
          ],
          defaultValue: "live",
        }),
        appStoreUrl: fields.url({ label: "App Store URL" }),
        playStoreUrl: fields.url({ label: "Google Play URL" }),
        webUrl: fields.url({ label: "Web app URL" }),
        tech: techList(),
        featured: fields.checkbox({
          label: "Feature on the home page",
          defaultValue: true,
        }),
        order: fields.integer({
          label: "Sort order",
          description: "Lower numbers come first.",
          defaultValue: 10,
        }),
        screenshots: imageList(
          "Screenshots",
          "apps",
          "Phone screenshots (portrait) look best.",
        ),
        bodyEn: fields.markdoc({
          label: "Details · English",
          options: caseStudyEditor("apps"),
        }),
        bodyAr: fields.markdoc({
          label: "Details · العربية",
          options: caseStudyEditor("apps"),
        }),
      },
    }),
  },
});

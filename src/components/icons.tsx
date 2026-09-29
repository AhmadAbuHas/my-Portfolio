import type { LucideIcon } from "lucide-react";
import { Bot, BrainCircuit, Cloud, Database, Globe, Smartphone, Webhook } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import {
  siAntdesign,
  siApollographql,
  siApple,
  siAxios,
  siBootstrap,
  siCss,
  siDigitalocean,
  siDocker,
  siDotnet,
  siDribbble,
  siExpo,
  siFigma,
  siFirebase,
  siGit,
  siGithub,
  siGoogleplay,
  siGraphql,
  siHtml5,
  siJavascript,
  siJquery,
  siJss,
  siMapbox,
  siMongodb,
  siMui,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siRedis,
  siRedux,
  siSass,
  siSqlite,
  siStorybook,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  siWhatsapp,
  siX,
} from "simple-icons";
import type { SocialPlatform } from "@/lib/content";
import { cn } from "@/lib/cn";

type IconProps = { className?: string };

/** A Simple Icons brand mark, drawn in the current text color. */
export function BrandIcon({ icon, className }: IconProps & { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

/** LinkedIn's mark is no longer shipped by Simple Icons or Lucide. */
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Technology logos                                                           */
/* -------------------------------------------------------------------------- */

const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9#+]/g, "");

const brandIcons: Record<string, SimpleIcon> = {
  react: siReact,
  reactjs: siReact,
  reactnative: siReact,
  typescript: siTypescript,
  ts: siTypescript,
  javascript: siJavascript,
  js: siJavascript,
  html: siHtml5,
  html5: siHtml5,
  css: siCss,
  css3: siCss,
  mui: siMui,
  materialui: siMui,
  reactmaterialui: siMui,
  antdesign: siAntdesign,
  antd: siAntdesign,
  jss: siJss,
  mapbox: siMapbox,
  node: siNodedotjs,
  nodejs: siNodedotjs,
  nestjs: siNestjs,
  graphql: siGraphql,
  apollo: siApollographql,
  apollographql: siApollographql,
  prisma: siPrisma,
  postgres: siPostgresql,
  postgresql: siPostgresql,
  mysql: siMysql,
  sqlite: siSqlite,
  mongodb: siMongodb,
  redis: siRedis,
  digitalocean: siDigitalocean,
  aspnet: siDotnet,
  aspnetmvc: siDotnet,
  aspnetcore: siDotnet,
  dotnet: siDotnet,
  net: siDotnet,
  jquery: siJquery,
  bootstrap: siBootstrap,
  bootstrap4: siBootstrap,
  bootstrap5: siBootstrap,
  axios: siAxios,
  nextjs: siNextdotjs,
  next: siNextdotjs,
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  redux: siRedux,
  expo: siExpo,
  docker: siDocker,
  git: siGit,
  github: siGithub,
  figma: siFigma,
  firebase: siFirebase,
  supabase: siSupabase,
  vercel: siVercel,
  sass: siSass,
  scss: siSass,
  storybook: siStorybook,
  vite: siVite,
};

const conceptIcons: Record<string, LucideIcon> = {
  ai: BrainCircuit,
  aiagents: Bot,
  agents: Bot,
  agentbuilding: Bot,
  aiengineering: BrainCircuit,
  llms: BrainCircuit,
  sql: Database,
  restapi: Webhook,
  restapis: Webhook,
  restfulapi: Webhook,
  restfulapis: Webhook,
  responsiveweb: Smartphone,
  aws: Cloud,
};

export function hasTechIcon(name: string) {
  const key = normalize(name);
  return key in brandIcons || key in conceptIcons;
}

/** Logo for a technology name, or a neutral marker when none is known. */
export function TechIcon({ name, className }: IconProps & { name: string }) {
  const key = normalize(name);
  const brand = brandIcons[key];
  if (brand) return <BrandIcon icon={brand} className={className} />;
  const Concept = conceptIcons[key];
  if (Concept) return <Concept aria-hidden="true" strokeWidth={2} className={className} />;
  return (
    <span aria-hidden="true" className={cn("inline-flex items-center justify-center", className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Social + store icons                                                       */
/* -------------------------------------------------------------------------- */

export const socialLabels: Record<SocialPlatform, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
  dribbble: "Dribbble",
  whatsapp: "WhatsApp",
  other: "Website",
};

export function SocialIcon({ platform, className }: IconProps & { platform: SocialPlatform }) {
  switch (platform) {
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "github":
      return <BrandIcon icon={siGithub} className={className} />;
    case "x":
      return <BrandIcon icon={siX} className={className} />;
    case "dribbble":
      return <BrandIcon icon={siDribbble} className={className} />;
    case "whatsapp":
      return <BrandIcon icon={siWhatsapp} className={className} />;
    default:
      return <Globe aria-hidden="true" className={className} />;
  }
}

export const storeIcons = { appStore: siApple, googlePlay: siGoogleplay };

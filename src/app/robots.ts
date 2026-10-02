import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

// AI crawlers that answer questions in ChatGPT, Claude, Perplexity, Gemini and
// Apple Intelligence. "*" already allows them; naming them makes the intent
// explicit. A crawler with its own group ignores "*", so each repeats the rules.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

const disallow = ["/keystatic", "/api/keystatic"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}

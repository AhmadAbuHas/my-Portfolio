import { Inter, JetBrains_Mono, Readex_Pro, Space_Grotesk } from "next/font/google";
import type { Locale } from "@/i18n/routing";

// English: display + body are preloaded (default locale). Mono is small and loads on use.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

// Arabic: one variable font (every weight in a single file) for headings and
// body. Never preloaded, so English pages don't pay for it.
const readexPro = Readex_Pro({
  subsets: ["arabic"],
  variable: "--font-readex-pro",
  display: "swap",
  preload: false,
});

const latin = [spaceGrotesk.variable, inter.variable, jetbrainsMono.variable];

/**
 * Font CSS variables for a locale. Arabic pages keep the Latin families too:
 * Latin characters (tech names, numbers, the "English" label) use them.
 */
export function fontVariables(locale: Locale) {
  return locale === "ar" ? [...latin, readexPro.variable].join(" ") : latin.join(" ");
}

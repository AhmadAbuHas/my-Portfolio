"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { localeNativeName, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Links to the same page in the other language. The label is the target
 * language in its own script ("العربية" / "English") with a matching `lang`.
 * A full page load on purpose: `lang`, `dir` and fonts all change, and the
 * middleware updates the remembered locale on document requests.
 */
export function LanguageSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const target: Locale = locale === "en" ? "ar" : "en";
  const rest = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");

  return (
    <a
      href={`/${target}${rest}`}
      hrefLang={target}
      lang={target}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-small font-medium text-fg-muted transition-colors duration-150 hover:text-fg",
        target === "ar" ? "font-arabic" : "font-latin",
        className,
      )}
    >
      <Languages aria-hidden="true" className="size-4" />
      {localeNativeName[target]}
    </a>
  );
}

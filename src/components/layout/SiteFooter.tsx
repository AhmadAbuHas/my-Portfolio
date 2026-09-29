import { ArrowUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/routing";
import { LanguageSwitch } from "./LanguageSwitch";

export async function SiteFooter({ locale, name }: { locale: Locale; name: string }) {
  const t = await getTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-fg-subtle">
          © <span className="numeric">{year}</span> {name}. {t("builtWith")}
        </p>
        <div className="flex flex-wrap items-center gap-2 -ms-3">
          <LanguageSwitch locale={locale} />
          <a
            href="#top"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-small font-medium text-fg-muted transition-colors duration-150 hover:text-fg"
          >
            {t("backToTop")}
            <ArrowUp
              aria-hidden="true"
              className="size-4 transition-transform duration-150 ease-brand group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </Container>
    </footer>
  );
}

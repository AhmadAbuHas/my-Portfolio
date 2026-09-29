import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/i18n/routing";
import type { SectionId } from "@/lib/content";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileNav } from "./MobileNav";
import { NavLinks, type NavItem } from "./NavLinks";
import { ContactLink } from "./ContactLink";

export async function SiteHeader({
  locale,
  sections,
  name,
}: {
  locale: Locale;
  sections: SectionId[];
  name: string;
}) {
  const t = await getTranslations();
  const items: NavItem[] = sections
    .filter((id) => id !== "contact")
    .map((id) => ({ id, label: t(`nav.${id}`) }));
  const contact: NavItem | null = sections.includes("contact")
    ? { id: "contact", label: t("nav.contact") }
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-6">
        <NextLink
          href={`/${locale}`}
          // On the home page this would prefetch the page you're already on.
          prefetch={false}
          className="inline-flex min-h-11 items-center font-display text-xl font-bold text-fg"
        >
          <span aria-hidden="true" dir="ltr">
            AH<span className="text-accent">.</span>
          </span>
          <span className="sr-only">
            {name} — {t("common.home")}
          </span>
        </NextLink>

        <NavLinks
          items={items}
          watch={["hero", ...sections]}
          label={t("common.primaryNav")}
          className="hidden lg:block"
        />

        <div className="flex items-center gap-2">
          <LanguageSwitch locale={locale} />
          {contact ? <ContactLink item={contact} className="max-lg:hidden" /> : null}
          <MobileNav
            items={items}
            contact={contact}
            labels={{
              open: t("common.openMenu"),
              close: t("common.closeMenu"),
              menu: t("common.menu"),
              nav: t("common.primaryNav"),
            }}
          />
        </div>
      </Container>
    </header>
  );
}

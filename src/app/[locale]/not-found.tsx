import { getTranslations } from "next-intl/server";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="aurora" />
        <div className="hero-grid absolute inset-0" />
      </div>
      <Container className="flex min-h-[calc(100svh-var(--header-height))] flex-col justify-center py-24">
        <p aria-hidden="true" className="numeric text-[clamp(6rem,20vw,14rem)] leading-none font-bold text-accent">
          404
        </p>
        <h1 className="mt-6 font-display text-h2 font-bold text-fg">{t("title")}</h1>
        <p className="mt-4 max-w-[50ch] text-body text-fg-muted">{t("text")}</p>
        <div className="mt-10">
          <ButtonLink href="/">
            {t("back")}
            <ArrowIcon />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

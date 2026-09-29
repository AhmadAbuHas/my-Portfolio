import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { LocaleLink } from "@/components/ui/LocaleLink";

/** Header band for inner pages: back link, eyebrow, big title, supporting content. */
export function PageIntro({
  back,
  eyebrow,
  title,
  children,
}: {
  back: { href: string; label: string };
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="aurora opacity-60" />
        <div className="hero-grid absolute inset-0" />
      </div>
      <Container className="py-14 md:py-20">
        <LocaleLink
          href={back.href}
          className="group -ms-3 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-small font-medium text-fg-muted transition-colors duration-150 hover:text-fg"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform duration-150 ease-brand group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1"
          />
          {back.label}
        </LocaleLink>
        {eyebrow ? <div className="mt-8">{eyebrow}</div> : null}
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[var(--leading-display)] font-bold text-balance text-fg">
          {title}
        </h1>
        {children}
      </Container>
    </header>
  );
}

import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { LocaleLink } from "./LocaleLink";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap " +
  "transition-[background-color,border-color,color,translate] duration-150 ease-brand";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover hover:-translate-y-px active:translate-y-0",
  outline:
    "border border-border-input text-fg hover:border-fg-muted hover:bg-surface-2 hover:-translate-y-px active:translate-y-0",
  ghost: "text-fg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 text-[0.9375rem]",
  sm: "min-h-11 px-4 text-small",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], variant === "ghost" && "min-h-11", className);
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Opens in a new tab and adds the "opens in a new tab" hint. */
  external?: boolean;
  newTabHint?: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

/**
 * Link styled as a button (server component). Locale paths ("/projects") get
 * the current locale prefixed; hashes, mailto:, files and absolute URLs render
 * a plain anchor.
 */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  external,
  newTabHint,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, className });
  const isInternalRoute = href.startsWith("/") && !href.startsWith("//") && !/\.[a-z0-9]+$/i.test(href);

  if (isInternalRoute && !external) {
    return (
      <LocaleLink href={href} className={classes} {...rest}>
        {children}
      </LocaleLink>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
    >
      {children}
      {external && newTabHint ? <span className="sr-only">{newTabHint}</span> : null}
    </a>
  );
}

/** Arrow that points in the reading direction and nudges forward on hover. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 transition-transform duration-150 ease-brand rtl:-scale-x-100",
        "group-hover:translate-x-1 rtl:group-hover:-translate-x-1",
        className,
      )}
    />
  );
}

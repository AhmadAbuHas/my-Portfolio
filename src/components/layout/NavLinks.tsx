"use client";

import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type NavItem = { id: string; label: string };

/** Hash link that stays on the page at home, and navigates home from other pages. */
export function useSectionHref() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  return { isHome, href: (id: string) => (isHome ? `#${id}` : `/${locale}#${id}`) };
}

/**
 * Desktop navigation with scrollspy: the section in view gets a lime underline.
 * `watch` lists every home section (including ones without a nav link, like
 * Contact) so the highlight clears when you scroll past the last linked one.
 */
export function NavLinks({
  items,
  watch,
  label,
  className,
}: {
  items: NavItem[];
  watch: string[];
  label: string;
  className?: string;
}) {
  const { isHome, href } = useSectionHref();
  const [active, setActive] = useState<string | null>(null);
  const ids = watch.join(",");

  useEffect(() => {
    if (!isHome) return;
    const sections = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome, ids]);

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isActive = isHome && active === item.id;
          return (
            <li key={item.id}>
              <NextLink
                href={href(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative inline-flex min-h-11 items-center rounded-full px-3 text-small font-medium transition-colors duration-150",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-accent transition-opacity duration-250",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
              </NextLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

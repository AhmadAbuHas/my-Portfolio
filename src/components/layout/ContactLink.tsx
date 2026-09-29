"use client";

import NextLink from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useSectionHref, type NavItem } from "./NavLinks";

/** Header contact button. Outline, so it never competes with a section's lime CTA. */
export function ContactLink({ item, className }: { item: NavItem; className?: string }) {
  const { href } = useSectionHref();
  return (
    <NextLink
      href={href(item.id)}
      className={cn(buttonClasses({ variant: "outline", size: "sm" }), "hover:border-accent hover:text-accent", className)}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {item.label}
    </NextLink>
  );
}

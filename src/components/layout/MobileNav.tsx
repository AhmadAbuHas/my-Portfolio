"use client";

import { Menu, X } from "lucide-react";
import NextLink from "next/link";
import { useRef } from "react";
import { ArrowIcon, buttonClasses } from "@/components/ui/Button";
import { useSectionHref, type NavItem } from "./NavLinks";

/**
 * Full-screen menu for small screens, built on the native modal <dialog>:
 * focus is trapped, Esc closes it, and the page behind is inert.
 */
export function MobileNav({
  items,
  contact,
  labels,
}: {
  items: NavItem[];
  contact: NavItem | null;
  labels: { open: string; close: string; menu: string; nav: string };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { href } = useSectionHref();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex size-11 items-center justify-center rounded-full border border-border text-fg transition-colors duration-150 hover:border-fg-muted lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">{labels.open}</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={labels.menu}
        className="mobile-nav m-0 h-dvh max-h-none w-full max-w-none border-0 bg-bg p-0 text-fg"
      >
        <div className="mx-auto flex h-[var(--header-height)] w-full max-w-[1200px] items-center justify-between border-b border-border px-4 sm:px-8">
          <span aria-hidden="true" dir="ltr" className="font-display text-xl font-bold">
            AH<span className="text-accent">.</span>
          </span>
          <button
            type="button"
            onClick={close}
            autoFocus
            className="inline-flex size-11 items-center justify-center rounded-full border border-border text-fg transition-colors duration-150 hover:border-fg-muted"
          >
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">{labels.close}</span>
          </button>
        </div>

        <nav aria-label={labels.nav} className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-8">
          <ul>
            {items.map((item, index) => (
              <li key={item.id} className="border-b border-border">
                <NextLink
                  href={href(item.id)}
                  onClick={close}
                  className="flex min-h-16 items-center justify-between gap-4 py-3 font-display text-3xl font-bold text-fg transition-colors duration-150 hover:text-accent"
                >
                  {item.label}
                  <span aria-hidden="true" className="numeric text-small font-medium text-fg-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </NextLink>
              </li>
            ))}
          </ul>
          {contact ? (
            <NextLink
              href={href(contact.id)}
              onClick={close}
              className={buttonClasses({ className: "mt-10 w-full" })}
            >
              {contact.label}
              <ArrowIcon />
            </NextLink>
          ) : null}
        </nav>
      </dialog>
    </>
  );
}

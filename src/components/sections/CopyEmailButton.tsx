"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Copies an email address and confirms with a toast (announced to screen
 * readers). Falls back to mailto: if the clipboard is blocked. The main email
 * uses the lime primary style; additional ones use the outline style.
 */
export function CopyEmailButton({
  email,
  labels,
  variant = "primary",
}: {
  email: string;
  labels: { copy: string; copied: string };
  variant?: "primary" | "outline";
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <>
      <button type="button" onClick={handleCopy} className={buttonClasses({ variant, className: "min-w-0" })}>
        <span className="sr-only">{labels.copy}: </span>
        <span dir="ltr" className="truncate font-mono">
          {email}
        </span>
        {copied ? (
          <Check aria-hidden="true" className="size-4 shrink-0" />
        ) : (
          <Copy aria-hidden="true" className="size-4 shrink-0" />
        )}
      </button>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      >
        {copied ? (
          <p className="toast inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2.5 text-small font-medium text-fg shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)]">
            <Check aria-hidden="true" className="size-4 text-accent" />
            {labels.copied}
          </p>
        ) : null}
      </div>
    </>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "subtle";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-surface-2 text-fg-muted",
  accent: "border-accent/35 bg-accent/10 text-accent",
  subtle: "border-border text-fg-subtle",
};

/** Small status pill. Always carries a text label, never color alone. */
export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-label font-medium",
        tones[tone],
        className,
      )}
    >
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

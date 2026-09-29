import type { ReactNode } from "react";

/** "01 — Experience" eyebrow + bold section title, with an optional action (e.g. View all). */
export function SectionHeader({
  number,
  eyebrow,
  title,
  titleId,
  action,
}: {
  number: string;
  eyebrow: string;
  title: string;
  titleId: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 md:mb-16">
      <div className="max-w-3xl">
        <p className="eyebrow">
          <span aria-hidden="true" className="text-accent">
            {number}
          </span>
          <span aria-hidden="true" className="mx-2 text-fg-subtle">
            —
          </span>
          {eyebrow}
        </p>
        <h2 id={titleId} className="mt-4 font-display text-h2 font-bold text-balance text-fg">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

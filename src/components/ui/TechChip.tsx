import { TechIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Technology pill with an automatic logo. Tech names stay in Latin script in both locales. */
export function TechChip({ name, muted = false }: { name: string; muted?: boolean }) {
  return (
    <li
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-small",
        muted
          ? "border-dashed border-border text-fg-subtle"
          : "border-border bg-surface-2 text-fg-muted",
      )}
    >
      <TechIcon name={name} className="size-3.5 shrink-0" />
      <bdi>{name}</bdi>
    </li>
  );
}

/** A list of tech chips, optionally truncated with a "+N" chip. */
export function TechList({
  items,
  max,
  label,
  muted,
  className,
}: {
  items: string[];
  max?: number;
  label?: string;
  muted?: boolean;
  className?: string;
}) {
  if (items.length === 0) return null;
  const shown = max ? items.slice(0, max) : items;
  const hidden = items.length - shown.length;
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {shown.map((name) => (
        <TechChip key={name} name={name} muted={muted} />
      ))}
      {hidden > 0 ? (
        <li className="inline-flex items-center rounded-full border border-border px-3 py-1 text-small text-fg-subtle">
          <span aria-hidden="true">+{hidden}</span>
          <span className="sr-only">{items.slice(max).join(", ")}</span>
        </li>
      ) : null}
    </ul>
  );
}

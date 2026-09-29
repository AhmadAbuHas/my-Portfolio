"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Vertical timeline track on the inline-start side. The lime progress line
 * fills as you scroll (hidden under reduced motion), and earlier entries are
 * revealed on demand (progressive disclosure).
 */
export function Timeline({
  children,
  earlier,
  showEarlierLabel,
  hideEarlierLabel,
}: {
  children: ReactNode;
  earlier?: ReactNode;
  showEarlierLabel: string;
  hideEarlierLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const earlierId = useId();

  useEffect(() => {
    const container = containerRef.current;
    const line = progressRef.current;
    if (!container || !line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    // 0 when the timeline's top reaches 75% of the viewport,
    // 1 when its bottom reaches 60% of the viewport.
    const update = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = (viewport * 0.75 - rect.top) / (rect.height + viewport * 0.15);
      line.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [expanded]);

  return (
    <div ref={containerRef} className="relative">
      <div aria-hidden="true" className="absolute top-2 bottom-2 start-[7px] w-px bg-border" />
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{ transform: "scaleY(0)" }}
        className="absolute top-2 bottom-2 start-[7px] w-px origin-top bg-accent motion-reduce:hidden"
      />

      {children}

      {earlier ? (
        <>
          <div id={earlierId} hidden={!expanded} className="pt-14">
            {earlier}
          </div>
          <div className="relative ps-10 pt-10 md:ps-14">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={earlierId}
              onClick={() => setExpanded((value) => !value)}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border-input px-5 text-small font-semibold text-fg transition-colors duration-150 hover:border-fg-muted hover:bg-surface-2"
            >
              {expanded ? hideEarlierLabel : showEarlierLabel}
              <ChevronDown
                aria-hidden="true"
                className={cn("size-4 transition-transform duration-250 ease-brand", expanded && "rotate-180")}
              />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

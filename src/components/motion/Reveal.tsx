"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

// One observer shared by every Reveal on the page.
let observer: IntersectionObserver | null = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealed = "";
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}

/**
 * Fades content up by 16px the first time it enters the viewport (see
 * [data-reveal] in globals.css). Reduced motion: a 150ms fade, no movement.
 * Without JavaScript the content is shown immediately (noscript style in the layout).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const shared = getObserver();
    shared.observe(element);
    return () => shared.unobserve(element);
  }, []);

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };
  const style = delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined;

  return (
    <Tag ref={setRef} data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}

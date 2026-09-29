"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Card whose border brightens and gets a soft lime glow that follows the
 * cursor. The glow is CSS-only (see .spotlight) and shows for fine pointers.
 */
export function SpotlightCard({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <div ref={ref} onPointerMove={handlePointerMove} className={cn("spotlight", className)}>
      {children}
    </div>
  );
}

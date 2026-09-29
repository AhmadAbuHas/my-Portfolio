"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { ImageAsset } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Horizontal, scroll-snapping gallery with visible previous/next buttons for
 * keyboard and mouse users. "Next" follows the reading direction in RTL.
 */
export function Gallery({
  images,
  variant,
  labels,
}: {
  images: ImageAsset[];
  variant: "phone" | "wide";
  labels: { region: string; previous: string; next: string };
}) {
  const listRef = useRef<HTMLUListElement>(null);

  function scroll(step: 1 | -1) {
    const list = listRef.current;
    if (!list) return;
    const rtl = getComputedStyle(list).direction === "rtl";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: list.clientWidth * 0.8 * step * (rtl ? -1 : 1),
      behavior: reduce ? "auto" : "smooth",
    });
  }

  const control =
    "inline-flex size-11 items-center justify-center rounded-full border border-border-input text-fg transition-colors duration-150 hover:border-fg-muted hover:bg-surface-2";

  return (
    <div>
      {images.length > 1 ? (
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => scroll(-1)} className={control}>
            <ChevronLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" />
            <span className="sr-only">{labels.previous}</span>
          </button>
          <button type="button" onClick={() => scroll(1)} className={control}>
            <ChevronRight aria-hidden="true" className="size-5 rtl:-scale-x-100" />
            <span className="sr-only">{labels.next}</span>
          </button>
        </div>
      ) : null}

      <ul
        ref={listRef}
        tabIndex={0}
        aria-label={labels.region}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
      >
        {images.map((image) => (
          <li
            key={image.src}
            className={cn("shrink-0 snap-start", variant === "phone" ? "w-56 sm:w-64" : "w-[85%] sm:w-[70%]")}
          >
            <figure
              className={cn(
                "relative overflow-hidden bg-surface-2",
                variant === "phone"
                  ? "aspect-[9/19.5] rounded-[2rem] border-4 border-surface-2 ring-1 ring-border"
                  : "aspect-[16/10] rounded-xl border border-border",
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={variant === "phone" ? "256px" : "(min-width: 1200px) 800px, 85vw"}
                className="object-cover"
              />
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

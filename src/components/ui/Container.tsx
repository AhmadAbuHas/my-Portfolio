import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 1200px content column with a 16px mobile gutter and 32px from `sm` up. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-8", className)}>{children}</div>;
}

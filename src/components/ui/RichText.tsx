import Markdoc from "@markdoc/markdoc";
import React from "react";
import type { RichContent } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Renders Keystatic rich text. `lang`/`dir` follow the language the text is
 * actually written in, so an English fallback on an Arabic page still reads LTR.
 */
export function RichText({ content, className }: { content: RichContent; className?: string }) {
  const tree = Markdoc.transform(content.node);
  return (
    <div
      lang={content.lang}
      dir={content.lang === "ar" ? "rtl" : "ltr"}
      className={cn("rich-text", className)}
    >
      {Markdoc.renderers.react(tree, React)}
    </div>
  );
}

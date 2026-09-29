import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Portfolio CMS",
  robots: { index: false, follow: false },
};

// Each field and rich-text paragraph takes its direction from its own text, so
// Arabic values are edited right-to-left while English stays left-to-right.
const bidiStyles = `
  input, textarea, [contenteditable] :is(p, li, h1, h2, h3, h4, blockquote) {
    unicode-bidi: plaintext;
    text-align: start;
  }
`;

// Root layout for the CMS (the public site has its own under [locale]).
// Access in production is gated by src/proxy.ts.
export default function KeystaticLayout() {
  return (
    <html lang="en">
      <body>
        <style>{bidiStyles}</style>
        <KeystaticApp />
      </body>
    </html>
  );
}

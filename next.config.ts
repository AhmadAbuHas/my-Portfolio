import type { NextConfig } from "next";

// next-intl reads its per-request config through the `next-intl/config` alias.
// We set that alias directly instead of using `next-intl/plugin`: the plugin
// eagerly loads @swc/core (only needed for its optional message extraction),
// whose native binary refuses to load on machines where another Windows
// account can write to the user's AppData folder.
const nextConfig: NextConfig = {
  // Keystatic's GitHub mode sends the browser to 127.0.0.1 in development
  // (for the OAuth callback); let the dev server serve its assets there.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // The whole site ships one small stylesheet (~11 KB gzipped). Inlining it
    // removes the render-blocking request, which matters most on slow mobile.
    inlineCss: true,
  },
  // The Keystatic reader loads /content from disk. Static pages read it at
  // build time, but routes rendered on demand (e.g. the 404 page) read it at
  // request time, so the files must ship with every server function.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.ts",
    },
  },
};

export default nextConfig;

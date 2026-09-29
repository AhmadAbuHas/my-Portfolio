// Shared by keystatic.config.ts and the proxy, so it must stay dependency-free.

const repo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO?.trim();

export const keystaticGithubRepo =
  repo && /^[\w.-]+\/[\w.-]+$/.test(repo) ? (repo as `${string}/${string}`) : undefined;

/**
 * GitHub mode whenever a repo is configured (production, and the one-time
 * GitHub App setup, which Keystatic only allows in development). Otherwise
 * local mode: edits write straight to /content.
 */
export const keystaticStorageKind: "local" | "github" = keystaticGithubRepo ? "github" : "local";

/**
 * Local mode has no authentication, so the admin UI and API must never be
 * reachable on a deployed server. The proxy returns 404 when this is false.
 */
export const isKeystaticAdminEnabled =
  process.env.NODE_ENV !== "production" || keystaticStorageKind === "github";

import { execSync } from "node:child_process";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Read rather than imported.
 *
 * `import pkg from "./package.json" with { type: "json" }` builds fine
 * anywhere the native @next/swc binary loads — and dies on the production
 * host, whose glibc is too old for it. The WASM fallback transpiles this file
 * without preserving the import attribute, so Node then refuses the JSON with
 * ERR_IMPORT_ATTRIBUTE_MISSING and the config never loads.
 *
 * CI cannot catch it: a GitHub runner has a modern glibc and never reaches
 * the fallback. Reading the file has no attribute to lose.
 *
 * process.cwd() rather than import.meta.url on purpose. The failure was a
 * transpiler dropping an ESM-only construct, so this deliberately uses none:
 * Next only ever evaluates this file from the project root.
 */
const pkg = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
) as { version: string };

/**
 * What tells an installed app that what it has cached is out of date.
 *
 * Routes and static files are precached by URL, and the revision is part of
 * the cache key — `/jornada?__WB_REVISION__=...`. An unchanged revision means
 * Serwist treats what it already holds as current and never asks again.
 *
 * Keyed on the package version, as it was, publishing without bumping that
 * version left every installed app on the previous HTML: a shell pointing at
 * chunk names the new deploy no longer precaches, which is a broken app with
 * no symptom on the machine that published it.
 *
 * The commit is what actually changed, so the commit is what the revision
 * names — and a client's cache keys then say which commit it is running,
 * which is worth having when someone reports what you cannot reproduce.
 * Uncommitted work, or no git at all, falls back to the clock: invalidating
 * too often costs a handful of small files, invalidating too rarely costs
 * the app.
 */
function precacheRevision(): string {
  const git = (command: string) =>
    execSync(command, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();

  try {
    const commit = git("git rev-parse --short HEAD");
    const dirty = git("git status --porcelain").length > 0;
    return dirty
      ? `${pkg.version}-${commit}-${Date.now().toString(36)}`
      : `${pkg.version}-${commit}`;
  } catch {
    return `${pkg.version}-${Date.now().toString(36)}`;
  }
}

const revision = precacheRevision();

const nextConfig: NextConfig = {
  // The production VPS runs a glibc older than 2.29, so @next/swc's native
  // binary will not load and Next falls back to WASM. Turbopack, the Next 16
  // default, requires that native binary, so the build must stay on webpack.
  // The npm scripts pass --webpack for the same reason; do not remove either.
  // Serwist injects a webpack config of its own, which Next refuses to run
  // under Turbopack at all, so the flag is doubly load-bearing.

  // Exposes the version to the client without importing package.json from a
  // component, which would ship the whole manifest the day that component
  // stops being server-only.
  env: { NEXT_PUBLIC_APP_VERSION: pkg.version },

  // Only the Docker image builds standalone; the VPS runs `next start`.
  output: process.env.BUILD_STANDALONE ? "standalone" : undefined,
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // A stale precache in development is an afternoon lost to debugging chunks
  // that no longer exist.
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: false,
  // Zero API calls and no server data, so every route is a static shell:
  // precaching all of them is what makes the app work offline in full. They
  // all share one revision, so a deploy invalidates the set or none of it.
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/calculadora", revision },
    { url: "/jornada", revision },
    { url: "/tempo-total", revision },
    { url: "/sobre", revision },
    { url: "/offline", revision },
    // Served unoptimised so these exact URLs are what the browser asks for.
    ...["next", "react", "typescript", "tailwind", "mui", "node"].map(
      (name) => ({ url: `/img/badges/${name}.svg`, revision })
    ),
    ...["icon-192.png", "icon-512.png", "icon.svg", "apple-touch-icon.png"].map(
      (file) => ({ url: `/icons/${file}`, revision })
    ),
  ],
});

export default withSerwist(nextConfig);

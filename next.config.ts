import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";
import pkg from "./package.json" with { type: "json" };

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
  // precaching all of them is what makes the app work offline in full.
  additionalPrecacheEntries: [
    { url: "/", revision: pkg.version },
    { url: "/calculadora", revision: pkg.version },
    { url: "/jornada", revision: pkg.version },
    { url: "/tempo-total", revision: pkg.version },
    { url: "/sobre", revision: pkg.version },
    { url: "/offline", revision: pkg.version },
    // Served unoptimised so these exact URLs are what the browser asks for.
    ...["home", "calculadora", "jornada", "tempototal", "sobre"].map(
      (name) => ({ url: `/img/${name}.webp`, revision: pkg.version })
    ),
    ...["next", "react", "typescript", "tailwind", "mui", "node"].map(
      (name) => ({ url: `/img/badges/${name}.svg`, revision: pkg.version })
    ),
    ...["icon-192.png", "icon-512.png", "icon.svg", "apple-touch-icon.png"].map(
      (file) => ({ url: `/icons/${file}`, revision: pkg.version })
    ),
  ],
});

export default withSerwist(nextConfig);

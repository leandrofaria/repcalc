import type { NextConfig } from "next";
import pkg from "./package.json" with { type: "json" };

const nextConfig: NextConfig = {
  // The production VPS runs a glibc older than 2.29, so @next/swc's native
  // binary will not load and Next falls back to WASM. Turbopack, the Next 16
  // default, requires that native binary, so the build must stay on webpack.
  // The npm scripts pass --webpack for the same reason; do not remove either.

  // Exposes the version to the client without importing package.json from a
  // component, which would ship the whole manifest the day that component
  // stops being server-only.
  env: { NEXT_PUBLIC_APP_VERSION: pkg.version },

  // Only the Docker image builds standalone; the VPS runs `next start`.
  output: process.env.BUILD_STANDALONE ? "standalone" : undefined,
};

export default nextConfig;

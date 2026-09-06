import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // resolve.tsconfigPaths makes the "@/*" alias from tsconfig.json work in
  // tests. Vite resolves it natively, so no plugin is needed.
  resolve: { tsconfigPaths: true },
  plugins: [react()],
  test: {
    globals: true,
    projects: [
      {
        // Pure domain logic: no DOM, so it runs in plain node and stays fast.
        extends: true,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/lib/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: ["src/components/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      // Scoped to src/lib on purpose. 90% of a pure function library means
      // something; a global threshold that counts JSX is theatre.
      include: ["src/lib/**"],
      thresholds: { lines: 90, functions: 90, branches: 85 },
    },
  },
});

import { defineConfig } from "vitest/config";

/**
 * Unit tests for the content layer's derivation logic. Coverage is measured on
 * the pure functions (`schema`, `wiki-links`, `derive`); the Velite-data wiring
 * in `index.ts` is excluded because it can only run after a Velite build and is
 * exercised by `next build`, not by unit tests.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/content/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/content/**/*.ts"],
      exclude: ["src/content/**/*.test.ts", "src/content/index.ts", "src/content/fixtures.ts"],
      reporter: ["text", "json-summary"],
    },
  },
});

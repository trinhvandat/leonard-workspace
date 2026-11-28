import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Unit tests for the content layer's derivation logic, plus component render
 * tests for `system-design`. Content tests run in the `node` environment
 * (pure functions, no DOM); component tests run in `jsdom` via
 * `environmentMatchGlobs` and get RTL's `@testing-library/jest-dom` matchers
 * through `setupFiles`.
 *
 * Coverage is measured on the content layer's pure functions (`schema`,
 * `wiki-links`, `derive`); the Velite-data wiring in `index.ts` is excluded
 * because it can only run after a Velite build and is exercised by
 * `next build`, not by unit tests.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    environmentMatchGlobs: [["src/system-design/**/*.test.tsx", "jsdom"]],
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/content/**/*.test.ts", "src/system-design/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include: [
        "src/content/**/*.ts",
        // Every built component layer is tested (REGISTRY built = tested,
        // enforced by structural-guard); measure them all so they stay covered,
        // not merely accompanied by a test file. (test files + barrel index.ts
        // are excluded below.)
        "src/system-design/atoms/**/*.tsx",
        "src/system-design/molecules/**/*.ts",
        "src/system-design/molecules/**/*.tsx",
        "src/system-design/organisms/**/*.ts",
        "src/system-design/organisms/**/*.tsx",
        "src/system-design/layouts/**/*.tsx",
      ],
      exclude: [
        "src/content/**/*.test.ts",
        "src/content/index.ts",
        "src/content/fixtures.ts",
        "src/system-design/**/*.test.tsx",
        "src/system-design/**/index.ts",
      ],
      reporter: ["text", "json-summary"],
      // Tháp ngược — tầng Static: the ≥80% rule from CLAUDE.md / testing.md is a
      // deterministic gate, not prose. `test:coverage` (and CI) exits non-zero
      // when content-layer coverage regresses below this, so it fails the build.
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 80,
      },
    },
  },
});

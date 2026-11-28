import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Velite-generated content output.
    ".velite/**",
  ]),
  {
    rules: {
      // Allow the destructure-to-omit idiom (`const { title, ...rest } = x`)
      // used to build "missing field" test inputs, and underscore-prefixed
      // intentional throwaways.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },

  // Tháp ngược — tầng Static: the system-design layer rule ("a component may
  // only import from its own layer or below: tokens → atoms → molecules →
  // organisms → layouts → pages") is a deterministic ESLint gate, not prose in
  // REGISTRY.md. `no-restricted-imports` needs no extra plugin. `Container`
  // (layouts) is a low-level wrapper used by organisms, so organisms may reach
  // it; the hard invariant everywhere is that nothing in system-design imports
  // a page (`@/app`).
  //
  // Patterns use the layer-anywhere form `**/<layer>/**` (not just the `@/…`
  // alias) so the gate catches BOTH the alias import and an escaping relative
  // one (`../../organisms/Hero`) — otherwise a hand-written relative import
  // slips an up-layer dependency straight past the gate.
  ...[
    {
      layer: "atoms",
      denyGroups: ["molecules", "organisms", "layouts"],
      message: "Atoms may import only tokens or other atoms (one-way chain: tokens → atoms → molecules → organisms → layouts → pages).",
    },
    {
      layer: "molecules",
      denyGroups: ["organisms", "layouts"],
      message: "Molecules may import only atoms/tokens or other molecules (one-way chain).",
    },
    {
      layer: "organisms",
      denyGroups: [],
      message: "Organisms must not import a page (@/app).",
    },
    {
      layer: "layouts",
      denyGroups: [],
      message: "Layouts must not import a page (@/app).",
    },
  ].map(({ layer, denyGroups, message }) => ({
    files: [`src/system-design/${layer}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // `**/<layer>/**` matches the import source whether it is written
              // as the `@/system-design/<layer>/…` alias or an escaping
              // relative path (`../../<layer>/…`). `**/app/**` likewise blocks
              // any route back into a page.
              group: [...denyGroups.map((g) => `**/${g}/**`), "**/app/**"],
              message,
            },
          ],
        },
      ],
    },
  })),
]);

export default eslintConfig;

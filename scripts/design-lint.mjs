#!/usr/bin/env node
// Tháp ngược — tầng Static (deterministic design-system consumption contract).
//
// The `design-system` skill forbids raw colors and literal font names outside
// the token files: components must consume semantic tokens (`var(--...)`). This
// script turns that prose rule into a gate that runs everywhere — the
// PostToolUse hook for fast per-edit feedback AND `npm run design-lint` in CI,
// so a hand-written commit can't slip a raw value past it.
//
// Scanned: every `src/**/*.css` except token files (anything under `tokens/`),
// where raw values legitimately live. Exits 1 and lists offending lines on any
// violation; exits 0 when clean.

import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const TOKEN_DIR = "/tokens/";

// Raw color notations that belong only in token files: hex + color functions.
// (Bare CSS named colors like `red` are not matched — detecting them reliably
// needs a color-context parser; the message below states this scope honestly.)
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(/;

// A `font-family` declaration OR a `font:` shorthand that hardcodes a face
// instead of consuming a `var(--type-family-*)` token. `font-size`/`font-weight`
// etc. don't match (the `-family` group is followed by `:`, not `-size`).
const FONT_DECL = /(?:^|[\s;{])font(?:-family)?\s*:/;

function listCssFiles() {
  // Tracked + untracked CSS under src/, minus token files. Uses git so the
  // check matches exactly what would be committed. We list the whole `src`
  // tree and filter `.css` in JS rather than a `src/**/*.css` pathspec, which
  // (git-glob semantics) would skip a file placed directly under `src/`.
  const out = execSync("git ls-files --cached --others --exclude-standard -- src", {
    encoding: "utf8",
  });
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter((f) => f.endsWith(".css"))
    .filter((f) => !f.includes(TOKEN_DIR));
}

const violations = [];

for (const file of listCssFiles()) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  // Blank out block comments across the WHOLE file (preserving newlines so line
  // numbers stay correct), so a hex/font inside a multi-line comment doesn't
  // produce a false positive and a value after an unclosed `/*` isn't missed.
  const lines = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).split("\n");

  lines.forEach((line, i) => {
    // Drop url(...) refs first: `url(#clip)` / `fill:url(#grad)` ids can look
    // like a hex color but are not one.
    const code = line.replace(/url\([^)]*\)/g, "");
    if (RAW_COLOR.test(code)) {
      violations.push({ file, n: i + 1, line: line.trim(), why: "raw color" });
    } else if (FONT_DECL.test(code) && !/var\(/.test(code)) {
      violations.push({ file, n: i + 1, line: line.trim(), why: "literal font" });
    }
  });
}

if (violations.length > 0) {
  console.error("design-lint: consume a semantic token (var(--...)) — raw hex/color-functions and literal fonts belong in tokens/.");
  for (const v of violations) {
    console.error(`  ${v.file}:${v.n}  [${v.why}]  ${v.line}`);
  }
  console.error(`\n${violations.length} violation(s).`);
  process.exit(1);
}

console.log("design-lint: clean — no raw colors or literal fonts outside tokens/.");

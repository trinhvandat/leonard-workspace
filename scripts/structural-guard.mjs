#!/usr/bin/env node
// Tháp ngược — tầng Static (structural invariants for system-design).
//
// REGISTRY.md is the reuse-first lookup; it is only useful while it stays true.
// This gate makes two of its rules deterministic:
//
//   HARD FAIL — every component directory under atoms/molecules/organisms/
//   layouts has a row in REGISTRY.md. A new component without a row means the
//   map lies and reviewers/agents miss it, so adding one without a row fails CI.
//
//   NOTE (non-blocking) — REGISTRY says `built` = "exists + tested". Components
//   marked built without a `*.test.tsx` are reported so the gap is visible,
//   but do not fail the build yet (tests are being backfilled incrementally).
//
// Exits 1 only on a missing REGISTRY row.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SD = "src/system-design";
const LAYERS = ["atoms", "molecules", "organisms", "layouts"];
const registry = readFileSync(join(SD, "REGISTRY.md"), "utf8");

/** A component has a row when its name appears as a leading table cell `| `Name` |`. */
const hasRow = (name) => new RegExp(`^\\|\\s*\`${name}\`\\s*\\|`, "m").test(registry);
/** Status read from the Status column (last non-empty cell) of that row. */
function statusOf(name) {
  const line = registry.split("\n").find((l) => new RegExp(`^\\|\\s*\`${name}\`\\s*\\|`).test(l));
  if (!line) return null;
  const cells = line
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean);
  const status = cells[cells.length - 1];
  return ["built", "planned", "deprecated"].includes(status) ? status : null;
}

const missingRow = [];
const builtNoTest = [];

for (const layer of LAYERS) {
  const dir = join(SD, layer);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)) {
    if (!hasRow(name)) {
      missingRow.push(`${layer}/${name}`);
      continue;
    }
    if (statusOf(name) === "built") {
      const hasTest =
        existsSync(join(dir, name, `${name}.test.tsx`)) ||
        existsSync(join(dir, name, `${name}.test.ts`));
      if (!hasTest) builtNoTest.push(`${layer}/${name}`);
    }
  }
}

if (builtNoTest.length > 0) {
  console.log(`structural-guard NOTE: ${builtNoTest.length} 'built' component(s) without a test:`);
  for (const c of builtNoTest) console.log(`  - ${c}`);
  console.log("  (REGISTRY defines built = exists + tested — backfill tests to close this.)\n");
}

if (missingRow.length > 0) {
  console.error("structural-guard FAIL: component directory missing a REGISTRY.md row:");
  for (const c of missingRow) console.error(`  - ${c}`);
  console.error("\nAdd a row for each (keep REGISTRY.md the source of truth for reuse).");
  process.exit(1);
}

console.log("structural-guard: every component directory has a REGISTRY row.");

#!/usr/bin/env node
// Tháp ngược — tầng Static (structural invariants for system-design).
//
// REGISTRY.md is the reuse-first lookup; it is only useful while it stays true.
// This gate makes two of its rules deterministic, both HARD FAILs:
//
//   1. Every component directory under atoms/molecules/organisms/layouts has a
//      row in REGISTRY.md. A new component without a row means the map lies and
//      reviewers/agents miss it.
//
//   2. REGISTRY says `built` = "exists + tested". A component marked built
//      without a colocated `*.test.tsx|ts` fails the build. (The backfill of
//      the original 18 built-without-test components is complete, so this is
//      now enforced rather than merely noted.)
//
// Exits 1 on either violation.

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

let failed = false;

if (missingRow.length > 0) {
  console.error("structural-guard FAIL: component directory missing a REGISTRY.md row:");
  for (const c of missingRow) console.error(`  - ${c}`);
  console.error("Add a row for each (keep REGISTRY.md the source of truth for reuse).\n");
  failed = true;
}

if (builtNoTest.length > 0) {
  console.error(`structural-guard FAIL: ${builtNoTest.length} 'built' component(s) without a test:`);
  for (const c of builtNoTest) console.error(`  - ${c}`);
  console.error("Add a colocated <Name>.test.tsx, or set the REGISTRY status to 'planned'.\n");
  failed = true;
}

if (failed) process.exit(1);

console.log("structural-guard: every component has a REGISTRY row and a test.");

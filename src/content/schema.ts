import { s } from "velite";

/**
 * Frontmatter schema for a note — the single source of truth for what a
 * valid note looks like. Velite validates every `.mdx` file against this at
 * build time; a missing required field or an out-of-range enum fails the build
 * and names the file + field.
 *
 * This module exports ONLY synchronous, context-free validators (no
 * `s.raw()` / `s.path()` / `s.mdx()` — those need Velite's file context), so
 * it can be imported into unit tests and exercised with `.safeParse` directly.
 */

export const MATURITIES = ["seedling", "budding", "evergreen"] as const;
export type Maturity = (typeof MATURITIES)[number];

export const CONFIDENCES = ["low", "medium", "high"] as const;
export type Confidence = (typeof CONFIDENCES)[number];

/** Validated frontmatter fields (before Velite adds body/path derivations). */
export const noteFrontmatterSchema = s.object({
  title: s.string().min(1),
  // Optional in frontmatter; defaults to the filename stem in velite.config.ts.
  slug: s.string().optional(),
  maturity: s.enum(MATURITIES),
  topics: s.array(s.string()),
  // Dates must be quoted in YAML (`"2026-08-01"`) so they arrive as strings;
  // `s.isodate()` validates and normalizes them to ISO datetime strings.
  planted: s.isodate(),
  tended: s.isodate(),
  confidence: s.enum(CONFIDENCES),
  citations: s.array(s.string().url()).default([]),
  draft: s.boolean().default(false),
});

/** Inferred shape of validated frontmatter. */
export type NoteFrontmatter = Readonly<{
  title: string;
  slug?: string;
  maturity: Maturity;
  topics: string[];
  planted: string;
  tended: string;
  confidence: Confidence;
  citations: string[];
  draft: boolean;
}>;

/**
 * A fully-resolved note: validated frontmatter + Velite-derived fields.
 * The derivation functions operate on this shape, so they can be unit-tested
 * against plain fixture arrays without running Velite.
 */
export interface Note {
  title: string;
  slug: string;
  maturity: Maturity;
  topics: string[];
  planted: string;
  tended: string;
  confidence: Confidence;
  citations: string[];
  draft: boolean;
  /** Relative path without extension, e.g. `notes/monolith-to-microservices`. */
  path: string;
  /** Raw MDX body text — the source of the `[[wiki-link]]` backlink graph. */
  raw: string;
  /** Compiled MDX (function body string) for later rendering. */
  body: string;
}

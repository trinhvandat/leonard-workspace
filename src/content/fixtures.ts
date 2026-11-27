import type { Note } from "./schema";

/**
 * Test fixtures. Pure derivation functions take a notes array, so tests build
 * their own notes here rather than depending on the generated Velite output.
 */
export function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    title: "A note",
    slug: "a-note",
    maturity: "budding",
    topics: ["architecture"],
    planted: "2026-01-01T00:00:00.000Z",
    tended: "2026-01-01T00:00:00.000Z",
    confidence: "medium",
    citations: [],
    draft: false,
    path: "notes/a-note",
    raw: "",
    body: "",
    ...overrides,
  };
}

/**
 * A small graph for backlink/topic/stats tests:
 * - alpha (evergreen) → beta, gamma
 * - beta (budding)    → alpha
 * - gamma (seedling)  → [[ghost]] (unresolved)
 * - delta (draft)     → alpha  (excluded from public surfaces)
 */
export function sampleNotes(): Note[] {
  return [
    makeNote({
      slug: "alpha",
      maturity: "evergreen",
      topics: ["architecture", "postgres"],
      tended: "2026-11-10T00:00:00.000Z",
      citations: ["https://example.com/a"],
      raw: "Links to [[beta]] and [[gamma]].",
    }),
    makeNote({
      slug: "beta",
      maturity: "budding",
      topics: ["architecture"],
      tended: "2026-11-20T00:00:00.000Z",
      citations: ["https://example.com/b"],
      raw: "Back to [[alpha]].",
    }),
    makeNote({
      slug: "gamma",
      maturity: "seedling",
      topics: ["postgres"],
      tended: "2026-11-05T00:00:00.000Z",
      citations: [],
      raw: "Points at [[ghost]] which does not exist.",
    }),
    makeNote({
      slug: "delta",
      maturity: "evergreen",
      topics: ["architecture"],
      tended: "2026-11-25T00:00:00.000Z",
      citations: ["https://example.com/d"],
      raw: "Draft linking [[alpha]].",
      draft: true,
    }),
  ];
}

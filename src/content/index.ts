import { notes as rawNotes } from "#site/content";
import type { Note } from "./schema";
import {
  buildBacklinkGraph,
  computeStats,
  computeTopicCounts,
  findBySlug,
  selectFeatured,
  selectPublic,
  type Backlinks,
  type BacklinkGraph,
  type Stats,
  type TopicCount,
} from "./derive";

/**
 * The content layer's public API. This module is the ONLY place that touches
 * the generated Velite data — everything else (and every test) works against
 * the pure derivation functions in `./derive`. Adding one `.mdx` note flows
 * through here into typed lists, topics, and backlinks with no extra wiring.
 *
 * Pure build-time read: no runtime DB/auth (Phase-2 seam).
 */

// Velite's generated type is structurally compatible with Note; the cast is the
// single boundary between generated data and our hand-written shape.
const allNotes = rawNotes as readonly Note[];

/** Every note, drafts included. */
export function getAllNotes(): Note[] {
  return [...allNotes];
}

/** Public notes only — drafts excluded from every public surface. */
export function getPublicNotes(): Note[] {
  return selectPublic(allNotes);
}

/** Look up a public note by slug (drafts are not publicly addressable). */
export function getNoteBySlug(slug: string): Note | undefined {
  return findBySlug(getPublicNotes(), slug);
}

/** Topic → count across public notes, sorted by count desc. */
export function topicCounts(): TopicCount[] {
  return computeTopicCounts(getPublicNotes());
}

/** The public backlink graph (drafts excluded). */
export function backlinks(): BacklinkGraph {
  return buildBacklinkGraph(getPublicNotes());
}

/** Curated set: newest-tended evergreen/budding public notes. */
export function featured(limit?: number): Note[] {
  return selectFeatured(allNotes, limit);
}

/** Garden-wide stats over public notes. */
export function stats(): Stats {
  return computeStats(allNotes);
}

export type { Note, Backlinks, BacklinkGraph, Stats, TopicCount };
export type { Maturity, Confidence } from "./schema";

import type { Note } from "./schema";
import { parseWikiLinks } from "./wiki-links";

/**
 * Build-time derivations over the notes array. Every function is pure — it
 * takes the notes it operates on as an argument — so the logic is unit-testable
 * without running Velite. The module index wires these to the real Velite data.
 *
 * Draft rule (PRD / content-model skill): `draft: true` is excluded from ALL
 * public surfaces — lists, topic pages, the backlink graph, stats.
 */

/** Public notes exclude drafts. */
export function selectPublic(notes: readonly Note[]): Note[] {
  return notes.filter((note) => !note.draft);
}

/** Find a note by slug (searches the given set as-is). */
export function findBySlug(notes: readonly Note[], slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}

export interface TopicCount {
  topic: string;
  count: number;
}

/**
 * Aggregate `topics[]` across the given notes into `[topic, count]`, sorted by
 * count desc then topic asc (deterministic). Callers pass public notes.
 */
export function computeTopicCounts(notes: readonly Note[]): TopicCount[] {
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const topic of note.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

export interface Backlinks {
  /** Slugs this note links to (resolved, within the given set). */
  linksTo: string[];
  /** Slugs that link to this note. */
  linkedFrom: string[];
}

export interface BacklinkGraph {
  /** slug → bidirectional links, for every note in the given set. */
  graph: Map<string, Backlinks>;
  /** Count of `[[wiki-link]]`s that did not resolve to a note in the set. */
  deadLinks: number;
}

/**
 * Build the bidirectional backlink graph from `[[slug]]` occurrences in note
 * bodies. Targets resolve by slug against the given set; an unresolved link is
 * a REPORTED WARNING (never a silent drop) and increments `deadLinks`.
 *
 * Callers pass public notes to get the public graph (drafts excluded).
 */
export function buildBacklinkGraph(notes: readonly Note[]): BacklinkGraph {
  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  const graph = new Map<string, Backlinks>();
  for (const note of notes) {
    graph.set(note.slug, { linksTo: [], linkedFrom: [] });
  }

  let deadLinks = 0;

  for (const note of notes) {
    const entry = graph.get(note.slug)!;
    for (const target of parseWikiLinks(note.raw)) {
      if (!bySlug.has(target)) {
        deadLinks += 1;
        console.warn(`[content] unresolved [[wiki-link]]: "${note.slug}" -> "${target}"`);
        continue;
      }
      if (!entry.linksTo.includes(target)) {
        entry.linksTo.push(target);
        graph.get(target)!.linkedFrom.push(note.slug);
      }
    }
  }

  return { graph, deadLinks };
}

/**
 * A small, deterministic curated set: the newest-tended evergreen/budding
 * notes. Sorted by `tended` desc, then slug asc as a stable tiebreak.
 */
export function selectFeatured(notes: readonly Note[], limit = 3): Note[] {
  return selectPublic(notes)
    .filter((note) => note.maturity === "evergreen" || note.maturity === "budding")
    .sort((a, b) => b.tended.localeCompare(a.tended) || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}

export interface Stats {
  notes: number;
  topics: number;
  /** % of public notes with ≥1 citation (integer, 0–100). */
  pctCited: number;
  /** Unresolved `[[wiki-link]]`s across public notes. */
  deadLinks: number;
}

/** Garden-wide stats, computed over public notes. */
export function computeStats(notes: readonly Note[]): Stats {
  const publicNotes = selectPublic(notes);
  const total = publicNotes.length;
  const cited = publicNotes.filter((note) => note.citations.length >= 1).length;
  const topics = new Set(publicNotes.flatMap((note) => note.topics)).size;
  const { deadLinks } = buildBacklinkGraph(publicNotes);

  return {
    notes: total,
    topics,
    pctCited: total === 0 ? 0 : Math.round((cited / total) * 100),
    deadLinks,
  };
}

/**
 * Parse `[[wiki-link]]` targets out of a raw MDX body.
 *
 * A wiki-link is `[[slug]]` — the inner text is a note slug. We return the
 * raw targets in document order (duplicates removed, order preserved) and let
 * the backlink graph resolve them against the known slug set.
 */
const WIKI_LINK_PATTERN = /\[\[([^\]]+)\]\]/g;

export function parseWikiLinks(raw: string): string[] {
  const seen = new Set<string>();
  const targets: string[] = [];

  for (const match of raw.matchAll(WIKI_LINK_PATTERN)) {
    const target = match[1].trim();
    if (target.length === 0 || seen.has(target)) continue;
    seen.add(target);
    targets.push(target);
  }

  return targets;
}

import type { Note } from "./schema";

/**
 * Resolve a `[[slug]]` wiki-link target to either an internal link or plain
 * text, at the render boundary. This is the RENDER-time resolution counterpart
 * to the build-time backlink graph (`buildBacklinkGraph`): the graph counts
 * dead links, this decides what the reader actually sees.
 *
 * Rule (PRD D2): a resolved PUBLIC note → an internal link to `/notes/<slug>`
 * carrying the target's title; an unresolved slug — or a draft, which the
 * public content API (`getNoteBySlug`) excludes and so returns `undefined` —
 * falls back to plain text. A wiki-link is never rendered as a dead `<a>`.
 *
 * The `lookup` is injected (defaulting to `getNoteBySlug`) so this stays
 * unit-testable without the generated Velite data.
 *
 * Note: a note that references its own slug (`[[own-slug]]`) resolves to a link
 * back to itself — self-links are not special-cased (no current note does this;
 * revisit with a `currentSlug` guard if that changes).
 */
export type ResolvedWikiLink =
  { kind: "link"; slug: string; href: string; title: string } | { kind: "text"; text: string };

export function resolveWikiLink(
  slug: string,
  lookup: (slug: string) => Note | undefined,
): ResolvedWikiLink {
  const note = lookup(slug);
  if (note === undefined) {
    return { kind: "text", text: slug };
  }
  return { kind: "link", slug, href: `/notes/${slug}`, title: note.title };
}

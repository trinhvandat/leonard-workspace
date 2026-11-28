import GithubSlugger from "github-slugger";

/**
 * Extract the "On this page" table of contents from a raw MDX body.
 *
 * This is the pure, unit-testable counterpart to `rehype-slug`: it reads the
 * same `##`/`###` headings and generates the same ids (both use
 * `github-slugger`), so the server-rendered TOC anchors (`#id`) line up exactly
 * with the `id`s `rehype-slug` stamps onto the rendered headings. Deriving over
 * `raw` keeps the TOC testable without a Velite build (like the other
 * derivations), rather than coupling it to the compiled MDX output.
 *
 * Only depth 2 and 3 headings are TOC-worthy (h1 is the page title; h4+ is too
 * deep for a reading rail). Headings inside fenced code blocks are ignored.
 */
export interface TocHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

const HEADING_PATTERN = /^(#{2,3})\s+(.+?)\s*$/;
const FENCE_PATTERN = /^\s*(```|~~~)/;

export function extractToc(raw: string): TocHeading[] {
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];
  let inFence = false;

  for (const line of raw.split("\n")) {
    if (FENCE_PATTERN.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = HEADING_PATTERN.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    // Strip closed-ATX trailing hashes (`## Foo ##`) before slugging, matching
    // how rehype parses the heading's text content.
    const text = match[2].replace(/\s+#+\s*$/, "").trim();
    if (text.length === 0) continue;

    headings.push({ id: slugger.slug(text), text, depth });
  }

  return headings;
}

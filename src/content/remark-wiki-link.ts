import { visit, SKIP } from "unist-util-visit";
import type { Root, Text } from "mdast";
import type { MdxJsxTextElement } from "mdast-util-mdx-jsx";
import type { Plugin } from "unified";

/**
 * remark plugin: rewrite each `[[slug]]` occurrence in MDX text into a
 * `WikiLink` MDX JSX text element carrying the trimmed slug.
 *
 * ── Phase B contract ───────────────────────────────────────────────────────
 *   Element name: `WikiLink`
 *   Prop:         `slug: string`  (the trimmed inner text of `[[...]]`)
 * The `mdxComponents` map resolves `<WikiLink slug="..." />` at render time via
 * `resolveWikiLink` (public note → internal link; unresolved/draft → text).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This is the RENDER counterpart to `parseWikiLinks` (which stays untouched and
 * continues to feed the backlink graph over `raw`). It runs in Velite's MDX
 * compile, so the compiled `body` contains real `WikiLink(...)` component calls.
 *
 * It visits only `text` nodes, so `[[...]]` inside inline code (`inlineCode`)
 * or fenced code (`code`) — which are distinct mdast node types — is never
 * rewritten.
 */
const WIKI_LINK_PATTERN = /\[\[([^\]]+)\]\]/g;

function wikiLinkElement(slug: string): MdxJsxTextElement {
  return {
    type: "mdxJsxTextElement",
    name: "WikiLink",
    attributes: [{ type: "mdxJsxAttribute", name: "slug", value: slug }],
    children: [],
  };
}

const remarkWikiLink: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (parent === undefined || index === undefined) return;

      const value = node.value;
      WIKI_LINK_PATTERN.lastIndex = 0;
      const replacement: (Text | MdxJsxTextElement)[] = [];
      let lastEnd = 0;
      let matched = false;

      for (const match of value.matchAll(WIKI_LINK_PATTERN)) {
        const slug = match[1].trim();
        if (slug.length === 0) continue;

        matched = true;
        const start = match.index;
        if (start > lastEnd) {
          replacement.push({ type: "text", value: value.slice(lastEnd, start) });
        }
        replacement.push(wikiLinkElement(slug));
        lastEnd = start + match[0].length;
      }

      if (!matched) return;

      if (lastEnd < value.length) {
        replacement.push({ type: "text", value: value.slice(lastEnd) });
      }

      parent.children.splice(index, 1, ...replacement);
      // Skip the nodes we just inserted (none are `text` with unseen links).
      return [SKIP, index + replacement.length];
    });
  };
};

export default remarkWikiLink;

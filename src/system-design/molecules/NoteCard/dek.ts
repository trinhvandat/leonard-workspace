/**
 * Derive a short "dek" (sub-headline) from a note's raw MDX body. This is a
 * presentation-layer convenience, not a content-layer derivation: the schema
 * has no excerpt/dek field (see docs/plans/home-screen.md D1 for the parallel
 * call on `AsideExcerpt`). If an editorial dek field is ever added to
 * frontmatter, prefer it over this heuristic and delete this file.
 */
export function extractDek(raw: string | undefined, maxLength = 160): string {
  if (!raw) return "";

  const firstParagraph = raw
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith("#") && !block.startsWith("```"));

  if (!firstParagraph) return "";

  const plain = firstParagraph
    .replace(/```[\s\S]*?```/g, "")
    .replace(
      /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
      (_match, slug: string, label?: string) => label ?? slug.replace(/-/g, " "),
    )
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;

  const truncated = plain.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

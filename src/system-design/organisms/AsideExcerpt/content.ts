/**
 * Decision D1 (docs/plans/home-screen.md): the aside excerpt is hand-picked
 * editorial content, hardcoded in the prototype, with no `pullquote` field
 * in the note schema (adding one is out of scope / Phase-2 churn). Held here
 * as a small typed constant co-located with the organism that renders it.
 * Can migrate to a note's frontmatter later if the content model grows one.
 */
export interface AsideExcerptContent {
  tapeLabel: string;
  quote: string;
  codeSnippet: string;
  codeLanguage: string;
}

export const asideExcerptContent: AsideExcerptContent = {
  tapeLabel: "from the garden",
  quote: "Every seam you cut buys independence and costs a network hop plus a consistency problem.",
  codeSnippet: `// orders.v2 grows; the monolith shrinks
fun place(cmd: PlaceOrder) =
  if (flags.on("orders.v2", cmd.tenant)) orders.place(cmd)
  else legacy.place(cmd)`,
  codeLanguage: "kotlin",
};

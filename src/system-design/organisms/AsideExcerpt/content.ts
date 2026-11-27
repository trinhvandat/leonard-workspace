/**
 * Decision D1 (docs/plans/home-screen.md): the aside excerpt is hand-picked
 * editorial content, hardcoded in the prototype, with no `pullquote` field
 * in the note schema (adding one is out of scope / Phase-2 churn). Held here
 * as a small typed constant co-located with the organism that renders it.
 * Can migrate to a note's frontmatter later if the content model grows one.
 */

/** A single highlighted token in the code snippet, for syntax-span coloring. */
export interface CodeToken {
  text: string;
  kind?: "keyword" | "comment" | "string";
}

export interface AsideExcerptContent {
  tapeLabel: string;
  /** Quote text before the inline-emphasized word. */
  quoteBefore: string;
  /** The single word rendered as `<em>`. */
  quoteEmphasis: string;
  /** Quote text after the inline-emphasized word. */
  quoteAfter: string;
  /** Code snippet, as lines of syntax-highlighted tokens. */
  codeLines: CodeToken[][];
  codeLanguage: string;
}

export const asideExcerptContent: AsideExcerptContent = {
  tapeLabel: "from the strangler note",
  quoteBefore: "My favourite trick: don't rewrite — ",
  quoteEmphasis: "route",
  quoteAfter:
    ". One feature flag per capability, legacy on one side, v2 on the other, and the fig quietly takes over.",
  codeLines: [
    [{ text: "// orders.v2 grows; the monolith shrinks", kind: "comment" }],
    [{ text: "fun", kind: "keyword" }, { text: " place(cmd: PlaceOrder) =" }],
    [
      { text: "  " },
      { text: "if", kind: "keyword" },
      { text: " (flags.on(" },
      { text: '"orders.v2"', kind: "string" },
      { text: ", cmd.tenant))" },
    ],
    [{ text: "      orders.place(cmd)" }],
    [{ text: "  " }, { text: "else", kind: "keyword" }, { text: " legacy.place(cmd)" }],
  ],
  codeLanguage: "kotlin",
};

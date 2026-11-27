import { Text } from "@/system-design/atoms/Text";
import { asideExcerptContent, type CodeToken } from "./content";
import styles from "./AsideExcerpt.module.css";

const classByTokenKind: Record<NonNullable<CodeToken["kind"]>, string> = {
  keyword: styles.keyword,
  comment: styles.comment,
  string: styles.string,
};

/**
 * Pulled-quote aside — the prototype's `.aside`: a "tape" label, a
 * pull-quote (with one inline-emphasized word, no wrapping quote marks),
 * and a syntax-highlighted code snippet. Content source: see Decision D1 in
 * `docs/plans/home-screen.md` and `./content.ts`.
 */
export function AsideExcerpt() {
  const { tapeLabel, quoteBefore, quoteEmphasis, quoteAfter, codeLines } = asideExcerptContent;

  return (
    <aside className={styles.root}>
      <Text as="span" variant="mono" size="meta" className={styles.tape}>
        {tapeLabel}
      </Text>

      <Text as="blockquote" variant="body" size="quote" className={styles.quote}>
        {quoteBefore}
        <em>{quoteEmphasis}</em>
        {quoteAfter}
      </Text>

      <pre className={styles.code}>
        <code>
          {codeLines.map((line, lineIndex) => (
            <span key={lineIndex} className={styles.line}>
              {line.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  className={token.kind ? classByTokenKind[token.kind] : undefined}
                >
                  {token.text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </aside>
  );
}

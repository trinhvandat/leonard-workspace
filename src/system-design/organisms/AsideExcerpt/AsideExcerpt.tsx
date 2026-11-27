import { Text } from "@/system-design/atoms/Text";
import { asideExcerptContent } from "./content";
import styles from "./AsideExcerpt.module.css";

/**
 * Pulled-quote aside — the prototype's `.aside`: a "tape" label, a
 * pull-quote, and a code snippet. Content source: see Decision D1 in
 * `docs/plans/home-screen.md` and `./content.ts`.
 */
export function AsideExcerpt() {
  const { tapeLabel, quote, codeSnippet } = asideExcerptContent;

  return (
    <aside className={styles.root}>
      <Text as="span" variant="mono" size="meta" className={styles.tape}>
        {tapeLabel}
      </Text>

      <Text as="blockquote" variant="body" size="h3" className={styles.quote}>
        &ldquo;{quote}&rdquo;
      </Text>

      <pre className={styles.code}>
        <code>{codeSnippet}</code>
      </pre>
    </aside>
  );
}

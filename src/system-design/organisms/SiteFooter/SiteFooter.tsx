import { Text } from "@/system-design/atoms/Text";
import { Container } from "@/system-design/layouts/Container";
import styles from "./SiteFooter.module.css";

/** Centered, mono, muted footer line shown on every route. */
export function SiteFooter() {
  return (
    <footer className={styles.root}>
      <Container width="wide" className={styles.inner}>
        <Text as="p" variant="mono" size="meta" className={styles.line}>
          grown locally in plain Markdown · no RAG · no cloud · fully owned
        </Text>
      </Container>
    </footer>
  );
}

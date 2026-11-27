import { HandDrawnUnderline } from "@/system-design/atoms/HandDrawnUnderline";
import { Text } from "@/system-design/atoms/Text";
import styles from "./Hero.module.css";

/**
 * Home hero — the prototype's `.hero`. Eyebrow ("Hi, I'm Leonard" with a
 * coral dot), `h1` with a hand-drawn underline on "engineering notes", a
 * lede, and an intro card (gradient avatar + name/role/stack). Fully static.
 */
export function Hero() {
  return (
    <section className={styles.root}>
      <Text as="p" variant="mono" size="meta" className={styles.eyebrow}>
        <span className={styles.dot} aria-hidden="true" />
        Hi, I&apos;m Leonard
      </Text>

      <Text as="h1" variant="display" size="h1" className={styles.title}>
        A garden of <HandDrawnUnderline>engineering notes</HandDrawnUnderline> that grow up
      </Text>

      <Text as="p" variant="body" size="body" className={styles.lede}>
        <em>Migration patterns, trade-offs, and code that survived production</em> — written down
        while they&apos;re still useful, then tended as they age.
      </Text>

      <div className={styles.introCard}>
        <span className={styles.avatar} aria-hidden="true">
          L
        </span>
        <div>
          <Text as="p" variant="display" size="h3" className={styles.name}>
            Leonard
          </Text>
          <Text as="p" variant="mono" size="meta" className={styles.role}>
            Fullstack Engineer (backend-heavy) &amp; Engineering Manager
          </Text>
          <Text as="p" variant="mono" size="meta" className={styles.stack}>
            Java · Kotlin · Spring Boot · TypeScript · PostgreSQL
          </Text>
        </div>
      </div>
    </section>
  );
}

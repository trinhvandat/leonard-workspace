import { Avatar } from "@/system-design/atoms/Avatar";
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
        A digital garden where my <HandDrawnUnderline>engineering notes</HandDrawnUnderline> grow
        up.
      </Text>

      <Text as="p" variant="body" size="body" className={styles.lede}>
        I plant rough ideas, then tend them into lessons I can actually reuse — migration patterns,
        trade-offs that bit me, and <em>code that survived production.</em> Everything here is cited
        and versioned.
      </Text>

      <div className={styles.introCard}>
        <Avatar initial="L" />
        <div>
          <Text as="p" variant="body" size="name" className={styles.name}>
            Leonard
          </Text>
          <Text as="p" variant="mono" size="meta" className={styles.role}>
            Fullstack engineer (backend-heavy) &amp; eng manager
          </Text>
          <Text as="p" variant="mono" size="meta" className={styles.stack}>
            Java · Spring · Kotlin · TypeScript · PostgreSQL
          </Text>
        </div>
      </div>
    </section>
  );
}

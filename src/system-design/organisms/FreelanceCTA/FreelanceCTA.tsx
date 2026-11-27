import { Button } from "@/system-design/atoms/Button";
import { Text } from "@/system-design/atoms/Text";
import styles from "./FreelanceCTA.module.css";

/**
 * Freelance/hire CTA — the prototype's `.cta`. Heading + copy + a `Button`
 * linking to `/about`. Reused on `/about` later.
 */
export function FreelanceCTA() {
  return (
    <section className={styles.root}>
      <Text as="h2" variant="display" size="h2" className={styles.title}>
        Like how I think?
      </Text>
      <Text as="p" variant="body" size="body" className={styles.copy}>
        I&apos;m open to freelance &amp; contract backend work. Pull up any note and see for
        yourself.
      </Text>
      <Button href="/about" variant="accent">
        Say hello →
      </Button>
    </section>
  );
}

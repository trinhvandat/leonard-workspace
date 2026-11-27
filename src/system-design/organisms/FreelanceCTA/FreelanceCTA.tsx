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
        Need a hand with your next migration?
      </Text>
      <Text as="p" variant="body" size="body" className={styles.copy}>
        I take on contract and freelance work — backend architecture, Spring Boot services, and the
        kind of migrations that are safer with someone who&apos;s done a few.
      </Text>
      <Button href="/about" variant="accent">
        Get in touch →
      </Button>
    </section>
  );
}

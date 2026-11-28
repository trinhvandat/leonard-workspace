import { Button } from "@/system-design/atoms/Button";
import { Text } from "@/system-design/atoms/Text";
import { CtaCard } from "@/system-design/molecules/CtaCard";
import styles from "./FreelanceCTA.module.css";

/**
 * Freelance/hire CTA — the prototype's `.cta`. Heading + copy + a `Button`
 * linking to `/about`. Consumes the shared `CtaCard` shell (also used by
 * `/about`'s `ContactPanel`) so the card look is single-sourced.
 */
export function FreelanceCTA() {
  return (
    <CtaCard align="center" className={styles.root}>
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
    </CtaCard>
  );
}

import { Text } from "@/system-design/atoms/Text";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  /** e.g. "9 notes" — rendered mono/muted beside the title rule. */
  count?: string;
  className?: string;
}

/**
 * Section heading: `h2` + a hairline rule + an optional mono count label
 * (the prototype's `.sh`). Reused by `/notes` and `/topics` later.
 */
export function SectionHeader({ title, count, className }: SectionHeaderProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <Text as="h2" variant="display" size="h2" className={styles.title}>
        {title}
      </Text>
      <span className={styles.rule} aria-hidden="true" />
      {count && (
        <Text as="span" variant="mono" size="meta" className={styles.count}>
          {count}
        </Text>
      )}
    </div>
  );
}

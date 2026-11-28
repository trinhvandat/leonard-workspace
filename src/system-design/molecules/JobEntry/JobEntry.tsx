import { Text } from "@/system-design/atoms/Text";
import styles from "./JobEntry.module.css";

interface JobEntryProps {
  role: string;
  company?: string;
  period?: string;
  detail: string;
  className?: string;
}

/**
 * One CV entry — the prototype's `.job`. Serves both the Experience column
 * (role + company + period + detail) and the "How I work" column (role +
 * detail only). The bottom border resets on the last entry in a `Panel`.
 */
export function JobEntry({ role, company, period, detail, className }: JobEntryProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {period && (
        <Text as="span" variant="mono" size="meta" className={styles.period}>
          {period}
        </Text>
      )}
      <Text as="p" variant="display" className={styles.role}>
        {role}
      </Text>
      {company && (
        <Text as="p" variant="body" className={styles.company}>
          {company}
        </Text>
      )}
      <Text as="p" variant="body" className={styles.detail}>
        {detail}
      </Text>
    </div>
  );
}

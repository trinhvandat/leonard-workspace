import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import styles from "./TopicChipList.module.css";

interface TopicChipListProps {
  topics: string[];
  className?: string;
}

/**
 * Green-soft topic pills — the prototype's `.metacard .tgs a` (`#topic`).
 * Distinct from the `Tag` atom's card-background chip: this is the
 * rail/meta-row presentation, flat green-soft fill, no border. Each pill
 * links to `/topics/[tag]`.
 */
export function TopicChipList({ topics, className }: TopicChipListProps) {
  if (topics.length === 0) return null;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {topics.map((topic) => (
        <Link key={topic} href={`/topics/${topic}`} className={styles.chip}>
          <Text as="span" variant="mono" size="meta" className={styles.chipText}>
            #{topic}
          </Text>
        </Link>
      ))}
    </div>
  );
}

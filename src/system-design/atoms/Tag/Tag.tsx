import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import styles from "./Tag.module.css";

interface TagProps {
  href: string;
  label: string;
  count?: number;
  className?: string;
}

/**
 * Mono chip — the prototype's `.tg` (+ optional `<b>count</b>`). Card
 * background, hover coral border. Used for topic lists and the
 * "browse all" affordance.
 */
export function Tag({ href, label, count, className }: TagProps) {
  return (
    <Link href={href} className={[styles.root, className].filter(Boolean).join(" ")}>
      <Text as="span" variant="mono" size="meta">
        {label}
      </Text>
      {count !== undefined && (
        <Text as="span" variant="mono" size="meta" className={styles.count}>
          {count}
        </Text>
      )}
    </Link>
  );
}

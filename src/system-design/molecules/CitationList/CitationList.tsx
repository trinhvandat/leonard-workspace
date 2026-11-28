import { Icon } from "@/system-design/atoms/Icon";
import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import styles from "./CitationList.module.css";

interface CitationListProps {
  citations: string[];
  className?: string;
}

/** The host of a citation URL, falling back to the full URL if it won't parse. */
function citationLabel(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/**
 * Sources — the prototype's `.section-mini` "Citations" header + `.cites`
 * numbered list. Each citation is an external link; we only have the raw
 * URL, so the host is shown as the label. Renders nothing when there are no
 * citations.
 */
export function CitationList({ citations, className }: CitationListProps) {
  if (citations.length === 0) return null;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <Text as="h2" variant="display" size="h3" className={styles.heading}>
        <Icon name="document" size={17} className={styles.icon} />
        Citations
      </Text>
      <ol className={styles.list}>
        {citations.map((url, index) => (
          <li key={url} className={styles.item}>
            <Text as="span" variant="mono" size="meta" className={styles.num}>
              [{index + 1}]
            </Text>
            <Link href={url} external className={styles.link}>
              {citationLabel(url)}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

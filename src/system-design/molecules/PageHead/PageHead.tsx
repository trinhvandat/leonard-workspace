import type { ReactNode } from "react";
import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import styles from "./PageHead.module.css";

interface PageHeadProps {
  /** Breadcrumb trail; the last item (or any item without `href`) renders as plain text. */
  crumb: { label: string; href?: string }[];
  title: string;
  sub?: string;
  /** Optional media (e.g. an `Avatar`) rendered beside the title in a flex row. */
  media?: ReactNode;
  className?: string;
}

/**
 * Generic page head — the prototype's `.pagehead`: crumb + `h1` + optional
 * sub-line, with an optional `media` slot (e.g. the `/about` avatar) beside
 * the title. Reused by `/about` now and `/notes`, `/topics`, `/topics/[tag]`
 * later. `NotePageHead` stays note-bound and does not consume this.
 */
export function PageHead({ crumb, title, sub, media, className }: PageHeadProps) {
  const titleBlock = (
    <div>
      <Text as="h1" variant="display" size="h1" className={styles.title}>
        {title}
      </Text>
      {sub && (
        <Text as="p" variant="body" className={styles.sub}>
          {sub}
        </Text>
      )}
    </div>
  );

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <p className={styles.crumb}>
        {crumb.map((item, index) => (
          <span key={`${item.label}-${index}`} className={styles.crumbItem}>
            {index > 0 && (
              <span className={styles.sep} aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className={styles.crumbLink}>
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
      </p>

      {media ? (
        <div className={styles.hero}>
          {media}
          {titleBlock}
        </div>
      ) : (
        titleBlock
      )}
    </div>
  );
}

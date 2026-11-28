import type { TocHeading } from "@/content/toc";
import styles from "./TableOfContents.module.css";

interface TableOfContentsProps {
  headings: TocHeading[];
  className?: string;
}

/**
 * "On this page" — the prototype's rail `.toc`. Server-rendered anchor
 * links only; scroll-spy's `.on` active state is deferred to a later
 * client-island pass (PRP D4). Renders nothing for fewer than two headings,
 * matching the prototype's default-hidden sideblock.
 */
export function TableOfContents({ headings, className }: TableOfContentsProps) {
  if (headings.length < 2) return null;

  return (
    <div className={[styles.sideblock, className].filter(Boolean).join(" ")}>
      <h4 className={styles.heading}>On this page</h4>
      <nav>
        <ul className={styles.toc}>
          {headings.map((heading) => (
            <li key={heading.id}>
              <a href={`#${heading.id}`} className={styles.link}>
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

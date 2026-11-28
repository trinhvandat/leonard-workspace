import type { Note } from "@/content";
import { MaturityBadge } from "@/system-design/atoms/MaturityBadge";
import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import styles from "./NotePageHead.module.css";

interface NotePageHeadProps {
  note: Note;
  className?: string;
}

/**
 * The note page's head — the prototype's `.pagehead`: a `garden / notes /
 * [slug]` crumb, the maturity badge, and the `h1` title. Sits above the
 * `.notegrid`, outside the 2-column layout.
 */
export function NotePageHead({ note, className }: NotePageHeadProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <p className={styles.crumb}>
        <Link href="/" className={styles.crumbLink}>
          garden
        </Link>
        <span className={styles.sep} aria-hidden="true">
          /
        </span>
        <Link href="/notes" className={styles.crumbLink}>
          notes
        </Link>
        <span className={styles.sep} aria-hidden="true">
          /
        </span>
        <span>{note.slug}</span>
      </p>

      <MaturityBadge maturity={note.maturity} />

      <Text as="h1" variant="display" size="h1" className={styles.title}>
        {note.title}
      </Text>
    </div>
  );
}

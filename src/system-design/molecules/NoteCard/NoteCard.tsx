import NextLink from "next/link";
import type { Note } from "@/content";
import { MaturityBadge } from "@/system-design/atoms/MaturityBadge";
import { Text } from "@/system-design/atoms/Text";
import { extractDek } from "./dek";
import { formatTended } from "./formatTended";
import styles from "./NoteCard.module.css";

interface NoteCardProps {
  note: Note;
  className?: string;
}

/**
 * Note preview card — the prototype's `.note` / `noteCard()`. Top row is the
 * maturity badge + tended date, then title/dek/stage line. The whole card is
 * a single link to `/notes/[slug]`. Public surface only — never renders
 * draft styling (home, and every public list, excludes drafts upstream).
 */
export function NoteCard({ note, className }: NoteCardProps) {
  const dek = extractDek(note.raw);
  const stageLine = [...note.topics, `confidence: ${note.confidence}`].join(" · ");
  const tendedLabel = `${note.maturity === "evergreen" ? "tended " : ""}${formatTended(note.tended)}`;

  return (
    <NextLink
      href={`/notes/${note.slug}`}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      <div className={styles.top}>
        <MaturityBadge maturity={note.maturity} />
        <Text as="span" variant="mono" size="meta" className={styles.tended}>
          {tendedLabel}
        </Text>
      </div>

      <Text as="h3" variant="display" size="h3" className={styles.title}>
        {note.title}
      </Text>

      {dek && (
        <Text as="p" variant="body" size="body" className={styles.dek}>
          {dek}
        </Text>
      )}

      <Text as="p" variant="mono" size="meta" className={styles.stage}>
        {stageLine}
      </Text>
    </NextLink>
  );
}

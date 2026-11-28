import type { Note } from "@/content";
import { Tag } from "@/system-design/atoms/Tag";
import { Button } from "@/system-design/atoms/Button";
import { BacklinkList, type ConnectedNote } from "@/system-design/molecules/BacklinkList";
import { CitationList } from "@/system-design/molecules/CitationList";
import { MetaRow } from "@/system-design/molecules/MetaRow";
import { MDXContent, proseStyles } from "@/system-design/mdx";
import styles from "./NoteReadingColumn.module.css";

interface NoteReadingColumnProps {
  note: Note;
  connected: ConnectedNote[];
  className?: string;
}

/**
 * The reading column — the prototype's `.notemain`. Narrow-only inline meta
 * bar, then the compiled MDX body, citations, in-column connected notes, and
 * the foot nav back to `/notes` / `/about`.
 */
export function NoteReadingColumn({ note, connected, className }: NoteReadingColumnProps) {
  return (
    <div className={className}>
      <MetaRow note={note} layout="bar" />

      <div className={proseStyles.prose}>
        <MDXContent code={note.body} />
      </div>

      <CitationList citations={note.citations} />
      <BacklinkList connected={connected} variant="column" />

      <div className={styles.foot}>
        <Tag href="/notes" label="← all notes" />
        <Button href="/about">Work with me →</Button>
      </div>
    </div>
  );
}

import type { Note } from "@/content";
import type { TocHeading } from "@/content/toc";
import { BacklinkList, type ConnectedNote } from "@/system-design/molecules/BacklinkList";
import { MetaRow } from "@/system-design/molecules/MetaRow";
import { TableOfContents } from "@/system-design/molecules/TableOfContents";
import styles from "./NoteMetaRail.module.css";

interface NoteMetaRailProps {
  note: Note;
  headings: TocHeading[];
  connected: ConnectedNote[];
  className?: string;
}

/**
 * The sticky meta rail — the prototype's `.noteside`. Field notes
 * (`MetaRow` card) → "On this page" TOC → rail connected-notes list. The
 * "Connected" sideblock only appears when there's something to show,
 * matching the prototype's `<!-- only if connected -->` comment.
 */
export function NoteMetaRail({ note, headings, connected, className }: NoteMetaRailProps) {
  return (
    <div className={className}>
      <div className={styles.sideblock}>
        <h4 className={styles.heading}>Field notes</h4>
        <MetaRow note={note} layout="card" />
      </div>

      <TableOfContents headings={headings} />

      {connected.length > 0 && (
        <div className={styles.sideblock}>
          <h4 className={styles.heading}>Connected</h4>
          <BacklinkList connected={connected} variant="rail" />
        </div>
      )}
    </div>
  );
}

import type { Note } from "@/content";
import { Tag } from "@/system-design/atoms/Tag";
import { NoteCard } from "@/system-design/molecules/NoteCard";
import { SectionHeader } from "@/system-design/molecules/SectionHeader";
import styles from "./WhatsGrowing.module.css";

interface WhatsGrowingProps {
  /** The featured notes to show (home passes `featured(3)`). */
  notes: Note[];
  /** Total public note count, for the section header's count label. */
  total: number;
}

/**
 * "What's growing" — the home section grid of featured `NoteCard`s, plus a
 * "browse all notes" affordance to `/notes`.
 */
export function WhatsGrowing({ notes, total }: WhatsGrowingProps) {
  return (
    <section className={styles.root}>
      <SectionHeader title="What's growing" count={`${total} notes`} />

      <div className={styles.grid}>
        {notes.map((note) => (
          <NoteCard key={note.slug} note={note} />
        ))}
      </div>

      <Tag href="/notes" label="Browse all notes →" className={styles.browseAll} />
    </section>
  );
}

import type { Confidence, Note } from "@/content";
import { MaturityBadge } from "@/system-design/atoms/MaturityBadge";
import { Text } from "@/system-design/atoms/Text";
import { formatTended } from "@/system-design/molecules/NoteCard/formatTended";
import { TopicChipList } from "@/system-design/molecules/TopicChipList";
import styles from "./MetaRow.module.css";

interface MetaRowProps {
  note: Note;
  /** "card" (rail `.metacard`, default) or "bar" (narrow inline `.metabar`). */
  layout?: "card" | "bar";
  className?: string;
}

const dotToneByConfidence: Record<Confidence, string> = {
  high: styles.confHigh,
  medium: styles.confMedium,
  low: styles.confLow,
};

/** Confidence dot + label — shared by both layouts. */
function ConfidenceReading({ confidence }: { confidence: Confidence }) {
  return (
    <span className={[styles.conf, dotToneByConfidence[confidence]].join(" ")}>
      <span className={styles.dot} aria-hidden="true" />
      {confidence}
    </span>
  );
}

/**
 * Note field-notes — the prototype's `.metacard` (rail card) and `.metabar
 * only-narrow` (inline mobile bar). One component, one `layout` prop: "card"
 * renders planted/tended/maturity/confidence rows + topic pills; "bar"
 * renders the compact planted · tended · confidence inline strip.
 */
export function MetaRow({ note, layout = "card", className }: MetaRowProps) {
  if (layout === "bar") {
    return (
      <div className={[styles.bar, styles.onlyNarrow, className].filter(Boolean).join(" ")}>
        <Text as="span" variant="mono" size="meta" className={styles.mi}>
          <b className={styles.miStrong}>planted</b> {formatTended(note.planted)}
        </Text>
        <Text as="span" variant="mono" size="meta" className={styles.mi}>
          <b className={styles.miStrong}>tended</b> {formatTended(note.tended)}
        </Text>
        <Text as="span" variant="mono" size="meta">
          confidence: <ConfidenceReading confidence={note.confidence} />
        </Text>
      </div>
    );
  }

  return (
    <div className={[styles.card, className].filter(Boolean).join(" ")}>
      <div className={styles.row}>
        <span>planted</span>
        <span>{formatTended(note.planted)}</span>
      </div>
      <div className={styles.row}>
        <span>tended</span>
        <span>{formatTended(note.tended)}</span>
      </div>
      <div className={styles.row}>
        <span>maturity</span>
        <MaturityBadge maturity={note.maturity} />
      </div>
      <div className={styles.row}>
        <span>confidence</span>
        <ConfidenceReading confidence={note.confidence} />
      </div>
      <TopicChipList topics={note.topics} />
    </div>
  );
}

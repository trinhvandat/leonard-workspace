import type { Note } from "@/content";
import { Icon } from "@/system-design/atoms/Icon";
import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import styles from "./BacklinkList.module.css";

export interface ConnectedNote {
  direction: "linksTo" | "linkedFrom";
  note: Note;
}

interface BacklinkListProps {
  connected: ConnectedNote[];
  /** "column" (in-column `.backlinks` cards, default) or "rail" (compact `.sideconnect`). */
  variant?: "column" | "rail";
  className?: string;
}

const directionLabel: Record<ConnectedNote["direction"], string> = {
  linksTo: "links to →",
  linkedFrom: "← linked from",
};

const railArrow: Record<ConnectedNote["direction"], string> = {
  linksTo: "→",
  linkedFrom: "←",
};

/**
 * Bidirectional connected notes — the prototype's in-column `.backlinks`
 * cards (with a "Connected notes" `.section-mini` header, or the seedling
 * empty line) and the compact rail `.sideconnect` list. Rail + empty renders
 * nothing (the rail's "Connected" sideblock only appears when there's
 * something to show).
 */
export function BacklinkList({ connected, variant = "column", className }: BacklinkListProps) {
  if (variant === "rail") {
    if (connected.length === 0) return null;

    return (
      <div className={[styles.sideconnect, className].filter(Boolean).join(" ")}>
        {connected.map(({ direction, note }) => (
          <Link key={`${direction}-${note.slug}`} href={`/notes/${note.slug}`}>
            <span className={styles.ar} aria-hidden="true">
              {railArrow[direction]}
            </span>
            {note.title}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <Text as="h2" variant="display" size="h3" className={styles.heading}>
        <Icon name="link" size={17} className={styles.icon} />
        Connected notes
      </Text>

      {connected.length === 0 ? (
        <Text as="p" variant="mono" size="meta" className={styles.empty}>
          No connected notes yet — this one’s still a seedling.
        </Text>
      ) : (
        <div className={styles.backlinks}>
          {connected.map(({ direction, note }) => (
            <Link
              key={`${direction}-${note.slug}`}
              href={`/notes/${note.slug}`}
              className={styles.bl}
            >
              <span className={styles.dir}>{directionLabel[direction]}</span>
              <span className={styles.ti}>{note.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

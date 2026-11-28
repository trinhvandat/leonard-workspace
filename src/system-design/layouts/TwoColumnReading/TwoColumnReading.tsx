import type { ReactNode } from "react";
import styles from "./TwoColumnReading.module.css";

interface TwoColumnReadingProps {
  main: ReactNode;
  rail: ReactNode;
  className?: string;
}

/**
 * The prototype's `.notegrid` — a reading column beside a sticky meta rail,
 * collapsing to one column (rail hidden) at 900px and below. Used by
 * `/notes/[slug]`; general enough for any future 2-column reading layout.
 */
export function TwoColumnReading({ main, rail, className }: TwoColumnReadingProps) {
  return (
    <div className={[styles.grid, className].filter(Boolean).join(" ")}>
      <div className={styles.main}>{main}</div>
      <aside className={styles.rail}>{rail}</aside>
    </div>
  );
}

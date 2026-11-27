import type { Stats } from "@/content";
import { Text } from "@/system-design/atoms/Text";
import styles from "./StatsStrip.module.css";

interface StatsStripProps {
  stats: Stats;
}

/**
 * Garden stats — the prototype's `.seeds`/`.sd`: 4 tiles (notes, topics,
 * % cited, dead links). 4-col grid collapsing to 2-col at ≤520px.
 */
export function StatsStrip({ stats }: StatsStripProps) {
  const tiles = [
    { value: stats.notes, label: "notes" },
    { value: stats.topics, label: "topics" },
    { value: `${stats.pctCited}%`, label: "cited" },
    { value: stats.deadLinks, label: "dead links", tone: styles.good },
  ];

  return (
    <section className={styles.root}>
      {tiles.map((tile) => (
        <div key={tile.label} className={styles.tile}>
          <Text
            as="p"
            variant="display"
            size="h2"
            className={[styles.value, tile.tone].filter(Boolean).join(" ")}
          >
            {tile.value}
          </Text>
          <Text as="p" variant="mono" size="meta" className={styles.label}>
            {tile.label}
          </Text>
        </div>
      ))}
    </section>
  );
}

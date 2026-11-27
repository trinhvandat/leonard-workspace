import type { TopicCount } from "@/content";
import { Tag } from "@/system-design/atoms/Tag";
import { SectionHeader } from "@/system-design/molecules/SectionHeader";
import styles from "./WanderByTopic.module.css";

interface WanderByTopicProps {
  topics: TopicCount[];
}

/**
 * "Wander by topic" — topic chips (with counts) linking to `/topics/[tag]`,
 * plus a "see all topics" chip to `/topics`.
 */
export function WanderByTopic({ topics }: WanderByTopicProps) {
  if (topics.length === 0) return null;

  return (
    <section className={styles.root}>
      <SectionHeader title="Wander by topic" />
      <div className={styles.list}>
        {topics.map(({ topic, count }) => (
          <Tag key={topic} href={`/topics/${topic}`} label={topic} count={count} />
        ))}
        <Tag href="/topics" label="All topics →" />
      </div>
    </section>
  );
}

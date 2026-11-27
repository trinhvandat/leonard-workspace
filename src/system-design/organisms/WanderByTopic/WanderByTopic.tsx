import type { TopicCount } from "@/content";
import { Tag } from "@/system-design/atoms/Tag";
import { SectionHeader } from "@/system-design/molecules/SectionHeader";
import styles from "./WanderByTopic.module.css";

interface WanderByTopicProps {
  topics: TopicCount[];
}

/**
 * "Wander by topic" — topic chips (with counts) linking to `/topics/[tag]`.
 * The home section shows only the topic chips; browsing all topics lives on
 * `/topics` itself.
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
      </div>
    </section>
  );
}

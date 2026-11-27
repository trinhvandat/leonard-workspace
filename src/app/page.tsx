import { featured, getPublicNotes, stats, topicCounts } from "@/content";
import { Container } from "@/system-design/layouts/Container";
import { AsideExcerpt } from "@/system-design/organisms/AsideExcerpt";
import { FreelanceCTA } from "@/system-design/organisms/FreelanceCTA";
import { Hero } from "@/system-design/organisms/Hero";
import { StatsStrip } from "@/system-design/organisms/StatsStrip";
import { WanderByTopic } from "@/system-design/organisms/WanderByTopic";
import { WhatsGrowing } from "@/system-design/organisms/WhatsGrowing";

/**
 * Home (`/`) — server component. Data-fetch + composition only; every
 * organism owns its own styling. See docs/plans/home-screen.md for the
 * approved composition order: hero → what's growing → aside excerpt →
 * wander by topic → stats → freelance CTA.
 */
export default function HomePage() {
  const featuredNotes = featured(3);
  const totalNotes = getPublicNotes().length;
  const gardenStats = stats();
  const topics = topicCounts();

  return (
    <main>
      <Container>
        <Hero />
        <WhatsGrowing notes={featuredNotes} total={totalNotes} />
        <AsideExcerpt />
        <WanderByTopic topics={topics} />
        <StatsStrip stats={gardenStats} />
        <FreelanceCTA />
      </Container>
    </main>
  );
}

import type { Metadata } from "next";
import { aboutData } from "@/content/about";
import { Avatar } from "@/system-design/atoms/Avatar";
import { Text } from "@/system-design/atoms/Text";
import { Container } from "@/system-design/layouts/Container";
import { JobEntry } from "@/system-design/molecules/JobEntry";
import { PageHead } from "@/system-design/molecules/PageHead";
import { Panel } from "@/system-design/molecules/Panel";
import { SkillList } from "@/system-design/molecules/SkillList";
import { ContactPanel } from "@/system-design/organisms/ContactPanel";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About — Leonard",
  description: aboutData.profile.pitch,
};

/**
 * `/about` — the CV / HR landing. Server component: data + composition
 * only, every panel/organism owns its own look. See docs/plans/about.md.
 */
export default function AboutPage() {
  return (
    <main>
      <Container width="wide">
        <PageHead
          crumb={[{ label: "garden", href: "/" }, { label: "about" }]}
          title={aboutData.profile.name}
          sub={aboutData.profile.pitch}
          media={<Avatar initial={aboutData.profile.initial} size={72} />}
        />

        <section className={styles.body}>
          <Panel title="What I do well" className={styles.summaryPanel}>
            <Text as="p" variant="body" className={styles.summaryCopy}>
              {aboutData.profile.summary}
            </Text>
            <SkillList skills={aboutData.skills} />
          </Panel>

          <div className={styles.cvcols}>
            <Panel title="Experience">
              {aboutData.experience.map((entry, index) => (
                <JobEntry key={`${entry.role}-${index}`} {...entry} />
              ))}
            </Panel>
            <Panel title="How I work">
              {aboutData.principles.map((principle, index) => (
                <JobEntry
                  key={`${principle.role}-${index}`}
                  role={principle.role}
                  detail={principle.detail}
                />
              ))}
            </Panel>
          </div>

          <ContactPanel contacts={aboutData.contacts} className={styles.contact} />
        </section>
      </Container>
    </main>
  );
}

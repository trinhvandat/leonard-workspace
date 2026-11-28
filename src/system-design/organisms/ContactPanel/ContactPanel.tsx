import type { Contact } from "@/content/about";
import { Icon } from "@/system-design/atoms/Icon";
import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import { CopyButton } from "@/system-design/molecules/CopyButton";
import { CtaCard } from "@/system-design/molecules/CtaCard";
import styles from "./ContactPanel.module.css";

interface ContactPanelProps {
  contacts: Contact[];
  className?: string;
}

/**
 * `/about`'s contact block — the prototype's left-aligned `.cta` +
 * `.contactrow`. Consumes the shared `CtaCard` shell (also used by the home
 * `FreelanceCTA`); email/cv render as `CopyButton`, github as an external
 * `Link` styled to match the same pill.
 */
export function ContactPanel({ contacts, className }: ContactPanelProps) {
  return (
    <CtaCard align="start" className={className}>
      <Text as="h2" variant="display" size="h2" className={styles.title}>
        Open to freelance &amp; contract backend work
      </Text>
      <Text as="p" variant="body" className={styles.copy}>
        Platform migrations, reliability rescues, or a second pair of senior hands. Reach me
        directly — copy either and say hi.
      </Text>
      <div className={styles.contactrow}>
        {contacts.map((contact, index) => {
          if (contact.kind === "github") {
            return (
              <Link
                key={`${contact.kind}-${index}`}
                href={contact.value}
                external
                className={styles.linkPill}
              >
                <Icon name="github" size={15} />
                <span>{contact.label}</span>
              </Link>
            );
          }

          if (contact.kind === "cv") {
            return (
              <CopyButton
                key={`${contact.kind}-${index}`}
                value={contact.value}
                label={contact.label}
                icon="document"
              />
            );
          }

          return (
            <CopyButton
              key={`${contact.kind}-${index}`}
              value={contact.value}
              label={contact.label}
              icon="copy"
            />
          );
        })}
      </div>
    </CtaCard>
  );
}

import type { ReactNode } from "react";
import { Text } from "@/system-design/atoms/Text";
import styles from "./Panel.module.css";

interface PanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  /** Heading level for the label — controls document outline, not visual size. Defaults to `h2`. */
  as?: "h2" | "h3";
}

/**
 * Card shell with a mono uppercase label heading — the prototype's `.panel`
 * (the `.panel h3` override is mono/uppercase/muted, not display). Used for
 * the `/about` "What I do well" / Experience / How-I-work sections.
 */
export function Panel({ title, children, className, as = "h2" }: PanelProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <Text as={as} variant="mono" size="meta" className={styles.label}>
        {title}
      </Text>
      {children}
    </div>
  );
}

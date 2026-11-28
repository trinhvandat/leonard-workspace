import type { ReactNode } from "react";
import styles from "./CtaCard.module.css";

interface CtaCardProps {
  /** Text alignment inside the card. Defaults to "center" (home CTA). */
  align?: "center" | "start";
  children: ReactNode;
  className?: string;
}

/**
 * Shared `.cta` card shell — border, radius, `--surface-card` background,
 * elevation, padding. Extracted so `FreelanceCTA` (centered, home) and
 * `ContactPanel` (left-aligned, `/about`) consume one source instead of two
 * copies of the same look. Consumers own their own margin/spacing.
 */
export function CtaCard({ align = "center", children, className }: CtaCardProps) {
  return (
    <section className={[styles.root, styles[align], className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
}

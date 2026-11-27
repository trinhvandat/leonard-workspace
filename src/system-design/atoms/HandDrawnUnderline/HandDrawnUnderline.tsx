import type { ReactNode } from "react";
import styles from "./HandDrawnUnderline.module.css";

interface HandDrawnUnderlineProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps an emphasized phrase with a decorative, hand-drawn coral squiggle
 * underneath it (the prototype's `h1 .u svg`). Purely decorative — the SVG
 * is `aria-hidden`; the wrapped text carries the semantics.
 */
export function HandDrawnUnderline({ children, className }: HandDrawnUnderlineProps) {
  return (
    <span className={[styles.root, className].filter(Boolean).join(" ")}>
      {children}
      <svg
        className={styles.underline}
        viewBox="0 0 120 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M1 7.5c10-4 20-5 30-4.5 10 .5 20 3.5 30 3 10-.5 20-4 30-4.5 9.5-.5 19 1 28 4"
          fill="none"
          stroke="var(--color-attention)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

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
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 8c40-6 90-6 196-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

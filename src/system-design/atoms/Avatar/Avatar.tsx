import type { CSSProperties } from "react";
import styles from "./Avatar.module.css";

export interface AvatarProps {
  /** Single glyph rendered in the avatar (e.g. the first letter of a name). */
  initial: string;
  /** Square size in px — scales radius and font together. Defaults to 46 (Hero intro). */
  size?: number;
  className?: string;
}

/**
 * Gradient initial square — the prototype's `.intro .ava` / `.about-hero .ava`.
 * Decorative only (`aria-hidden`); the surrounding UI supplies the accessible name.
 * Shared by `Hero` (46px) and the `/about` page head (72px).
 */
export function Avatar({ initial, size = 46, className }: AvatarProps) {
  const style = { "--avatar-size": `${size}px` } as CSSProperties;

  return (
    <span
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={style}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

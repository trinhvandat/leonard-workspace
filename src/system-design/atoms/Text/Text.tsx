import type { ElementType, ReactNode } from "react";
import styles from "./Text.module.css";

type TextVariant = "display" | "body" | "mono";
type TextSize = "h1" | "h2" | "h3" | "body" | "name" | "quote" | "meta";

interface TextProps {
  /** Element to render (defaults based on variant). */
  as?: ElementType;
  /** Which type family to use. */
  variant?: TextVariant;
  /** Which size/leading step from the type scale. */
  size?: TextSize;
  className?: string;
  children: ReactNode;
}

const defaultElementByVariant: Record<TextVariant, ElementType> = {
  display: "h2",
  body: "p",
  mono: "span",
};

/**
 * Typographic primitive. Maps `variant` to `--type-family-*` and `size` to
 * `--type-size-*`/`--type-leading-*`. Never hardcode a font or size outside
 * this component — extend the size/variant union instead.
 */
export function Text({ as, variant = "body", size, className, children }: TextProps) {
  const Element = as ?? defaultElementByVariant[variant];
  const sizeClass = size ? styles[`size-${size}`] : undefined;

  return (
    <Element
      className={[styles.root, styles[variant], sizeClass, className].filter(Boolean).join(" ")}
    >
      {children}
    </Element>
  );
}

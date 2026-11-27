import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

type ContainerWidth = "content" | "wide";

interface ContainerProps {
  as?: ElementType;
  /** "content" (~712px, default) for reading-width text, "wide" (~860px) for nav/page shells. */
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
}

/**
 * Max-width wrapper with horizontal gutter + safe-area insets. Every page
 * section composes inside one of these instead of redefining its own
 * max-width/padding.
 */
export function Container({
  as: Element = "div",
  width = "content",
  className,
  children,
}: ContainerProps) {
  return (
    <Element className={[styles.root, styles[width], className].filter(Boolean).join(" ")}>
      {children}
    </Element>
  );
}

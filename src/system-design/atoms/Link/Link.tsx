import NextLink from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import styles from "./Link.module.css";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** External links open in a new tab with rel="noopener". */
  external?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Styled internal/external link. Internal links route through Next's
 * `<Link>` for client-side navigation; external links are plain anchors
 * with safe `target`/`rel` defaults.
 */
export function Link({ href, external = false, className, children, ...rest }: LinkProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} {...rest}>
      {children}
    </NextLink>
  );
}

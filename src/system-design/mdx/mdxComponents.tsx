// The element map passed to the compiled MDX body's `components` prop
// (see MDXContent.tsx). Keep this minimal: `h2/h3/p/ul/li/code/pre` are left
// to their plain tags on purpose — `.prose` in prose.module.css styles them
// by descendant selector, so there's nothing to override here.
import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { getNoteBySlug } from "@/content";
import { resolveWikiLink } from "@/content/resolve-wiki-link";
import { Link } from "@/system-design/atoms/Link";
import styles from "./prose.module.css";

interface WikiLinkProps {
  slug: string;
}

/**
 * Renders the `<WikiLink slug="..."/>` element the remark plugin inserts for
 * every `[[slug]]`. Resolved public note → a styled link (`.wl`) carrying the
 * target's title. Unresolved/draft → plain text, never a dead `<a>`.
 */
function WikiLink({ slug }: WikiLinkProps) {
  const resolved = resolveWikiLink(slug, getNoteBySlug);
  if (resolved.kind === "text") {
    return <>{resolved.text}</>;
  }
  return (
    <Link href={resolved.href} className={styles.wl}>
      {resolved.title}
    </Link>
  );
}

/** Routes internal `href`s through the `Link` atom; external ones open safely. */
function MdxAnchor({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href === undefined) {
    return <a {...rest}>{children}</a>;
  }
  const isInternal = href.startsWith("/") || href.startsWith("#");
  return (
    <Link href={href} external={!isInternal}>
      {children}
    </Link>
  );
}

/** Styles `> ...` as the prototype's berry `.callout` card (D5 — forward-safety). */
function MdxBlockquote({ children }: { children?: ReactNode }) {
  return <div className={styles.callout}>{children}</div>;
}

export const mdxComponents: MDXComponents = {
  WikiLink,
  a: MdxAnchor,
  blockquote: MdxBlockquote,
};

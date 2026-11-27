import NextLink from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "accent" | "ghost";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonAsLink = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Action primitive — `.btn`/`.btn.ghost` in the prototype. Renders a styled
 * `Link` when `href` is set, otherwise a real `<button>`. Coral fill
 * (`accent`) or card-ghost (`ghost`), Bricolage 600 weight, hover lift.
 */
export function Button({ variant = "accent", className, children, href, ...rest }: ButtonProps) {
  const classes = [styles.root, styles[variant], className].filter(Boolean).join(" ");

  if (href) {
    return (
      <NextLink
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </NextLink>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

import { Icon } from "@/system-design/atoms/Icon";
import { Link } from "@/system-design/atoms/Link";
import { Text } from "@/system-design/atoms/Text";
import { Container } from "@/system-design/layouts/Container";
import { ThemeToggle } from "@/system-design/molecules/ThemeToggle";
import styles from "./SiteHeader.module.css";

const navLinks = [
  { href: "/notes", label: "Notes" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" },
];

/**
 * Sticky site header: sprout logo + wordmark, nav links, theme toggle.
 * Static apart from `ThemeToggle`, which is the only client piece.
 */
export function SiteHeader() {
  return (
    <header className={styles.root}>
      <Container width="wide" className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Icon name="sprout" size={22} className={styles.logoIcon} />
          <Text as="span" variant="display" size="h3">
            Leonard&apos;s Garden
          </Text>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              <Text as="span" variant="mono" size="meta">
                {link.label}
              </Text>
            </Link>
          ))}
        </nav>

        <ThemeToggle />
      </Container>
    </header>
  );
}

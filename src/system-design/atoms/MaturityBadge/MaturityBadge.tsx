import type { Maturity } from "@/content";
import { Icon, type IconName } from "@/system-design/atoms/Icon";
import { Text } from "@/system-design/atoms/Text";
import styles from "./MaturityBadge.module.css";

interface MaturityBadgeProps {
  maturity: Maturity;
  className?: string;
}

const labelByMaturity: Record<Maturity, string> = {
  seedling: "seedling",
  budding: "budding",
  evergreen: "evergreen",
};

const iconByMaturity: Record<Maturity, IconName> = {
  seedling: "maturity-seedling",
  budding: "maturity-budding",
  evergreen: "maturity-evergreen",
};

const toneByMaturity: Record<Maturity, string> = {
  seedling: styles.seedling,
  budding: styles.budding,
  evergreen: styles.evergreen,
};

/**
 * Growth-stage label: mono text + a 3-bar glyph, colored from the
 * `--maturity-*` ladder (matches the prototype's `.mat.seed/.bud/.ever`).
 */
export function MaturityBadge({ maturity, className }: MaturityBadgeProps) {
  return (
    <span className={[styles.root, toneByMaturity[maturity], className].filter(Boolean).join(" ")}>
      <Icon name={iconByMaturity[maturity]} size={14} />
      <Text as="span" variant="mono" size="meta">
        {labelByMaturity[maturity]}
      </Text>
    </span>
  );
}

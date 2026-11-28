import { Text } from "@/system-design/atoms/Text";
import styles from "./SkillList.module.css";

interface SkillListProps {
  skills: string[];
  className?: string;
}

/**
 * Row of non-link skill chips — the prototype's `.skillset` + `.sk`. Distinct
 * from `Tag` (which requires an `href` and renders on the green-soft
 * surface); these chips are plain paper-2 labels, not navigation.
 */
export function SkillList({ skills, className }: SkillListProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {skills.map((skill) => (
        <Text key={skill} as="span" variant="mono" className={styles.skill}>
          {skill}
        </Text>
      ))}
    </div>
  );
}

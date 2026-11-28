"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/system-design/atoms/Icon";
import styles from "./CopyButton.module.css";

interface CopyButtonProps {
  /** The text written to the clipboard on click. */
  value: string;
  label: string;
  icon?: IconName;
  className?: string;
}

const COPIED_DURATION_MS = 1500;

/**
 * Copy-to-clipboard client island — the prototype's `.copybtn`. Pattern
 * mirrors `ThemeToggle`: browser APIs wrapped in try/catch, no throw and no
 * dialog when the clipboard is unavailable or denied.
 */
export function CopyButton({ value, label, icon, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleClick() {
    try {
      if (!navigator.clipboard) {
        return;
      }
      await navigator.clipboard.writeText(value);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    } catch {
      // Clipboard unavailable or permission denied — fail silently, no dialog.
    }
  }

  return (
    <button
      type="button"
      className={[styles.root, className].filter(Boolean).join(" ")}
      onClick={handleClick}
      aria-label={`Copy ${label}`}
    >
      <Icon name={icon ?? "copy"} size={15} className={styles.icon} />
      <span>{copied ? "copied ✓" : label}</span>
    </button>
  );
}

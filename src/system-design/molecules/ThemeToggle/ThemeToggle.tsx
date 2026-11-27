"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/system-design/atoms/Icon";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const STORAGE_KEY = "garden-theme";

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable (private window, quota, etc.) — theme still
    // applies for this page load via the DOM attribute.
  }
}

function prefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Overrides the OS theme by setting `data-theme` on `<html>` and persisting
 * the choice to localStorage. When nothing is stored, `data-theme` stays
 * unset so `prefers-color-scheme` (handled in themes.css) governs.
 */
export function ThemeToggle() {
  // Resolved theme used only to pick the icon/label — undefined until
  // mounted, since the real source of truth is the DOM attribute set by
  // the anti-flash inline script.
  const [resolved, setResolved] = useState<Theme | null>(null);

  useEffect(() => {
    // Syncs from browser-only APIs (localStorage, matchMedia) that aren't
    // available during server render — this is the one-time read the
    // lint rule's "effects subscribe to external systems" carve-out covers.
    const stored = readStoredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolved(stored ?? (prefersDark() ? "dark" : "light"));
  }, []);

  function toggle() {
    const next: Theme =
      (resolved ?? (prefersDark() ? "dark" : "light")) === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    writeStoredTheme(next);
    setResolved(next);
  }

  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      className={styles.root}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Icon name={isDark ? "sun" : "moon"} size={16} />
    </button>
  );
}

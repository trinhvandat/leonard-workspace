---
name: design-system
description: The visual design system for Leonard's Garden — color tokens, fonts, dark mode behavior, and identity details, all taken from the approved prototype. Read before writing any CSS, component styling, or theme logic.
---

# Design system — from the approved prototype

The prototype artifact linked at the top of `docs/PRD.md` is the source of truth. This skill records the agreed tokens; when the prototype and this file disagree, the prototype wins — update this file to match.

## Color tokens

Warm **paper** background. Accents:

| Token | Value | Use |
|---|---|---|
| `--green` | `#1f9e6b` | primary accent |
| `--coral` | `#f0603f` | secondary accent |
| `--berry` | `#7c5cf0` | tertiary accent |

Define all colors as CSS custom properties on `:root`. Provide a full dark-mode set. Give `body` an explicit background in both themes.

```css
:root {
  --paper: /* warm light */;
  --ink: /* body text */;
  --green: #1f9e6b;
  --coral: #f0603f;
  --berry: #7c5cf0;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark values for every token above */ }
}
:root[data-theme="dark"] { /* same dark values, for the manual toggle */ }
```

## Fonts

- **Display:** Bricolage Grotesque
- **Body serif:** Newsreader
- **Meta / code:** JetBrains Mono

## Dark mode

- Default to `prefers-color-scheme`.
- A toggle lets the user override; persist the choice to `localStorage` under a stable key.
- Wrap every `localStorage` read/write in try/catch; the page must render correctly when storage is empty or throws (private window, blocked storage).

## Identity details

- **Dot-grid** background texture.
- **Sprout icon** representing maturity.
- **Hand-drawn underline** for emphasized words.

## Layout notes

- Note detail: 2 columns on desktop — reading column ~680px + a rail (meta / table of contents / connected notes). Collapses to 1 column on mobile.
- Respect safe-area insets on mobile.

## Rules

Tokens over hardcoded values, always. Keep contrast accessible in both themes. Small, focused stylesheets co-located with their components.

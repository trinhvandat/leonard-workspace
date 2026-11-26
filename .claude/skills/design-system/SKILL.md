---
name: design-system
description: The visual design system AND the consumption contract for Leonard's Garden — color tokens, fonts, dark mode, identity details, plus the rules that ALL UI code must follow (consume system-design, never hardcode, reuse before creating). Read before writing or changing any CSS, component, page, or theme logic — and before acting on a new/updated prototype.
---

# Design system — from the approved prototype

The prototype artifact linked at the top of `docs/PRD.md` is the source of truth. This skill records the agreed tokens; when the prototype and this file disagree, the prototype wins — update this file to match.

## Consumption contract (read this first, every time)

This is not optional reference material — it is the contract every piece of UI work obeys.

**Source-of-truth chain.** Design flows one direction; change at the highest layer that owns the thing, never patch downstream:

```
prototype artifact  →  tokens  →  atoms  →  molecules / organisms  →  pages (app/)
   (source of truth)   (values)   (primitives)   (composed UI)        (data + assembly)
```

- A **value** (color, spacing, font, radius) changed → edit the token, never the component. Components inherit it.
- A **look** shared by ≥2 places → it belongs in `system-design/`, not inlined in a page.
- A **page** only does data fetching + composition. Pages import from `system-design/`; they never define reusable styling.

**Reuse before you create.** Before writing any new component or style:

1. Check what already exists (the component REGISTRY when present, else scan `system-design/`).
2. If something covers ~70%+ of the need → **extend it** (add a prop/variant). Do not fork or re-implement.
3. Only create new when nothing is close — and put it in the right layer (atom / molecule / organism), with a test.

**Never hardcode.** Components consume **semantic tokens** (`var(--color-accent)`, `var(--maturity-evergreen)`), never raw hex (`#1f9e6b`) or literal font names. Raw values live only in the token files.

**New or updated prototype design.** When a new artifact arrives or the prototype changes, do NOT hand-patch scattered files. Follow the reconciliation flow: fetch the artifact (read it as an artifact — never web-fetch a `claude.ai` link), diff against current tokens + components, classify each change (token value → new/changed component → layout → page composition), then apply **top-down along the chain above** and update this skill's token tables to match. Most UI updates are a single token-value change that the whole site inherits — reach for that before touching components.

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

Tokens over hardcoded values, always. Keep contrast accessible in both themes. Small, focused stylesheets co-located with their components. Split **raw tokens** (`--green`) from **semantic tokens** (`--color-accent`, `--maturity-*`); components use only the semantic layer, so re-theming and dark mode touch one place. See the Consumption contract above — it governs every UI edit, not just new screens.

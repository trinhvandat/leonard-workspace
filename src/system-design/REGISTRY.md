# system-design REGISTRY

The lookup table for **reuse-first**. Before building any UI, check here for a component to reuse or extend; `/design-sync` diffs a new prototype against this list. Governed by the `design-system` skill's consumption contract.

**How to use**

- Building UI → find a row that covers ~70%+ of the need and **reuse/extend** it. Only add a new row when nothing is close.
- Creating/changing a component → update its row in the same change (keep this file true).
- `Status`: `planned` (in the design, not built) · `built` (exists + tested) · `deprecated` (don't use).

Layers flow one way: `tokens → atoms → molecules → organisms → layouts → pages`. A component may only import from its own layer or below.

## Tokens (`tokens/`)

| Token file | Owns | Status |
|---|---|---|
| `tokens.css` | raw + semantic: color, spacing, radius, z-index | planned |
| `themes.css` | dark-mode overrides (`prefers-color-scheme` + `[data-theme]`) | planned |
| `typography.css` | font families (display/serif/mono) + type scale | planned |

## Atoms (`atoms/`)

| Component | Purpose | Key props | Status |
|---|---|---|---|
| `Text` | typographic primitive (display/serif/mono, sizes) | `as`, `variant`, `size` | planned |
| `Button` | action, accent/ghost variants | `variant`, `href?` | planned |
| `Tag` | topic chip | `topic`, `count?` | planned |
| `Link` | styled internal/external link | `href`, `external?` | planned |
| `Icon` | inline SVG set (incl. sprout) | `name`, `size` | planned |
| `MaturityBadge` | 🌱 seedling/budding/evergreen label+icon | `maturity` | planned |
| `HandDrawnUnderline` | emphasis underline for a word | `children` | planned |

## Molecules (`molecules/`)

| Component | Purpose | Key props | Status |
|---|---|---|---|
| `NoteCard` | note preview — used on `/`, `/notes`, `/topics/[tag]` | `note` | planned |
| `TopicChipList` | row/grid of `Tag` | `topics` | planned |
| `MetaRow` | confidence · planted · tended | `note` | planned |
| `CitationList` | sources for a note | `citations` | planned |
| `BacklinkList` | connected notes (both directions) | `backlinks` | planned |
| `TableOfContents` | in-note headings nav | `headings` | planned |
| `ThemeToggle` | **client** — theme override + localStorage | — | planned |
| `FilterBar` | **client** — filter by maturity + topic | `topics`, `onChange` | planned |

## Organisms (`organisms/`)

| Component | Purpose | Used by | Status |
|---|---|---|---|
| `SiteHeader` | nav + `ThemeToggle` | all pages | planned |
| `SiteFooter` | footer | all pages | planned |
| `Hero` | home hero | `/` | planned |
| `WhatsGrowing` | grid of `NoteCard` (new/featured) | `/` | planned |
| `AsideExcerpt` | pulled quote from one note | `/` | planned |
| `StatsStrip` | garden stats | `/` | planned |
| `FreelanceCTA` | hire/contact call-to-action | `/`, `/about` | planned |
| `NoteReadingColumn` | ~680px reading column (renders MDX) | `/notes/[slug]` | planned |
| `NoteMetaRail` | rail: MetaRow + TOC + BacklinkList | `/notes/[slug]` | planned |
| `EmptyState` | no-results / empty list | `/notes`, `/topics/[tag]` | planned |

## Layouts (`layouts/`)

| Component | Purpose | Status |
|---|---|---|
| `Container` | max-width + safe-area insets | planned |
| `TwoColumnReading` | reading column + rail → 1 col on mobile | planned |

## MDX bridge (`mdx/`)

| Item | Purpose | Status |
|---|---|---|
| `mdxComponents` | map MDX → atoms; `[[wiki-link]]`, code highlight, `HandDrawnUnderline` | planned |

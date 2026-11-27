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
| `tokens.css` | raw + semantic: color, spacing, radius, z-index | built |
| `themes.css` | dark-mode overrides (`prefers-color-scheme` + `[data-theme]`) | built |
| `typography.css` | font families (display/serif/mono) + type scale | built |

## Atoms (`atoms/`)

| Component | Purpose | Key props | Status |
|---|---|---|---|
| `Text` | typographic primitive (display/serif/mono, sizes) | `as`, `variant`, `size` | built |
| `Button` | action, accent/ghost variants | `variant`, `href?` | built |
| `Tag` | topic chip | `href`, `label`, `count?` | built |
| `Link` | styled internal/external link | `href`, `external?` | built |
| `Icon` | inline SVG set (incl. sprout, maturity bars) | `name`, `size` | built |
| `MaturityBadge` | 🌱 seedling/budding/evergreen label+icon | `maturity` | built |
| `HandDrawnUnderline` | emphasis underline for a word | `children` | built |

## Molecules (`molecules/`)

| Component | Purpose | Key props | Status |
|---|---|---|---|
| `NoteCard` | note preview — used on `/`, `/notes`, `/topics/[tag]` | `note` | built |
| `SectionHeader` | section heading: title + rule + optional count | `title`, `count?` | built |
| `TopicChipList` | row/grid of `Tag` | `topics` | planned |
| `MetaRow` | confidence · planted · tended | `note` | planned |
| `CitationList` | sources for a note | `citations` | planned |
| `BacklinkList` | connected notes (both directions) | `backlinks` | planned |
| `TableOfContents` | in-note headings nav | `headings` | planned |
| `ThemeToggle` | **client** — theme override + localStorage | — | built |
| `FilterBar` | **client** — filter by maturity + topic | `topics`, `onChange` | planned |

## Organisms (`organisms/`)

| Component | Purpose | Used by | Status |
|---|---|---|---|
| `SiteHeader` | nav + `ThemeToggle` | all pages | built |
| `SiteFooter` | footer | all pages | built |
| `Hero` | home hero | `/` | built |
| `WhatsGrowing` | grid of `NoteCard` (new/featured) | `/` | built |
| `AsideExcerpt` | pulled quote (editorial constant, see `content.ts`) | `/` | built |
| `WanderByTopic` | topic chips with counts | `/` | built |
| `StatsStrip` | garden stats | `/` | built |
| `FreelanceCTA` | hire/contact call-to-action | `/`, `/about` | built |
| `NoteReadingColumn` | ~680px reading column (renders MDX) | `/notes/[slug]` | planned |
| `NoteMetaRail` | rail: MetaRow + TOC + BacklinkList | `/notes/[slug]` | planned |
| `EmptyState` | no-results / empty list | `/notes`, `/topics/[tag]` | planned |

## Layouts (`layouts/`)

| Component | Purpose | Status |
|---|---|---|
| `Container` | max-width + safe-area insets | built |
| `TwoColumnReading` | reading column + rail → 1 col on mobile | planned |

## MDX bridge (`mdx/`)

| Item | Purpose | Status |
|---|---|---|
| `mdxComponents` | map MDX → atoms; `[[wiki-link]]`, code highlight, `HandDrawnUnderline` | planned |

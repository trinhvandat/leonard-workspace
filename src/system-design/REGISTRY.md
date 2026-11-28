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
| `Icon` | inline SVG set (incl. sprout, maturity bars, `copy`/`github` contactrow glyphs) | `name`, `size` | built |
| `Avatar` | gradient initial square (`.ava`) — `Hero` (46px) + `/about` head (72px) | `initial`, `size?` | built |
| `MaturityBadge` | 🌱 seedling/budding/evergreen label+icon | `maturity` | built |
| `HandDrawnUnderline` | emphasis underline for a word | `children` | built |

## Molecules (`molecules/`)

| Component | Purpose | Key props | Status |
|---|---|---|---|
| `NoteCard` | note preview — used on `/`, `/notes`, `/topics/[tag]` | `note` | built |
| `SectionHeader` | section heading: title + rule + optional count | `title`, `count?` | built |
| `TopicChipList` | green-soft `#tag` pills → `/topics/[tag]` | `topics` | built |
| `MetaRow` | field-notes card / narrow meta bar | `note`, `layout?` | built |
| `CitationList` | sources for a note (section-mini) | `citations` | built |
| `BacklinkList` | connected notes, column or rail | `connected`, `variant?` | built |
| `TableOfContents` | in-note headings nav (no scroll-spy yet) | `headings` | built |
| `ThemeToggle` | **client** — theme override + localStorage | — | built |
| `FilterBar` | **client** — filter by maturity + topic | `topics`, `onChange` | planned |
| `PageHead` | generic page head: crumb + `h1` + sub + optional media slot | `crumb`, `title`, `sub?`, `media?` | built |
| `Panel` | card shell with mono uppercase label heading | `title` | built |
| `SkillList` | row of non-link skill chips (`.sk`) | `skills` | built |
| `JobEntry` | one CV entry (Experience / How I work) | `role`, `company?`, `period?`, `detail` | built |
| `CopyButton` | **client** — copy-to-clipboard pill with transient "copied" state | `value`, `label`, `icon?` | built |
| `CtaCard` | shared `.cta` card shell (center/start align) — consumed by `FreelanceCTA` + `ContactPanel` | `align?`, `children` | built |

## Organisms (`organisms/`)

| Component | Purpose | Used by | Status |
|---|---|---|---|
| `SiteHeader` | nav + `ThemeToggle` | all pages | built |
| `SiteFooter` | footer | all pages | built |
| `Hero` | home hero (refactored to consume `Avatar`) | `/` | built |
| `WhatsGrowing` | grid of `NoteCard` (new/featured) | `/` | built |
| `AsideExcerpt` | pulled quote (editorial constant, see `content.ts`) | `/` | built |
| `WanderByTopic` | topic chips with counts | `/` | built |
| `StatsStrip` | garden stats | `/` | built |
| `FreelanceCTA` | hire/contact call-to-action (refactored to consume `CtaCard`) | `/` | built |
| `NotePageHead` | note page head: crumb + maturity + `h1` | `/notes/[slug]` | built |
| `NoteReadingColumn` | ~680px reading column (renders MDX) | `/notes/[slug]` | built |
| `NoteMetaRail` | rail: MetaRow + TOC + BacklinkList | `/notes/[slug]` | built |
| `EmptyState` | no-results / empty list | `/notes`, `/topics/[tag]` | planned |
| `ContactPanel` | `/about` contact block: heading + copy + contactrow (github link, email/cv `CopyButton`) on `CtaCard` | `/about` | built |

## Layouts (`layouts/`)

| Component | Purpose | Status |
|---|---|---|
| `Container` | max-width + safe-area insets (`content`/`wide`/`reading` 1060px) | built |
| `TwoColumnReading` | reading column + rail → 1 col on mobile | built |

## MDX bridge (`mdx/`)

| Item | Purpose | Status |
|---|---|---|
| `MDXContent` | server-only render of a note's compiled MDX body | built |
| `mdxComponents` | map MDX → atoms; `WikiLink`, `a`, `blockquote`→callout | built |
| `prose.module.css` | `.prose` typography + `.wl` + `.callout` + Shiki dark-mode | built |

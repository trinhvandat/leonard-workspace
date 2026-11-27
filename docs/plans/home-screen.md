# PRP — Home screen (`/`)

- **Status:** Draft — awaiting review
- **Created:** 2026-11-27
- **Scope:** The home route `/` only, matching the `#home` screen of the approved prototype.
- **Source of truth (UI):** Artifact `ABRSw9FFi9Z68kKWUioQB1`, `screenHome()`. The prototype wins over prose; match it.
- **Source of truth (scope):** `docs/PRD.md` §5 (route `/`), §3 (design system), §4 (content model).
- **Owner agents:** `ui-builder` (build), `nextjs-reviewer` (review pass), `content-tester` (NoteCard render test).

---

## 1. Goal

Replace the placeholder `src/app/page.tsx` with the full home composition from the prototype:
hero → "What's growing" (featured notes) → aside excerpt → "Wander by topic" → stats → freelance CTA.
It must be a **server component** (SSG), data-driven from the existing content API, pixel-faithful to the
prototype in both light and dark themes, responsive, and token-pure (no raw hex — the design-lint hook enforces this).

The home screen is a **composition** task: the content layer, tokens, and shell already exist and are tested.
The work is building the `planned` components the page depends on, then assembling them.

## 2. What already exists — reuse, do not rebuild

**Content data API** (`src/content/index.ts`) — already tested, consume as-is:

| Need on home | Call |
|---|---|
| Featured note cards (3) | `featured(3)` → newest-tended evergreen/budding, deterministic |
| "N notes" count | `getPublicNotes().length` |
| Topic chips with counts | `topicCounts()` → `{ topic, count }[]` sorted desc |
| Stats strip | `stats()` → `{ notes, topics, pctCited, deadLinks }` |

**Tokens** (`src/system-design/tokens/*.css`) — complete. Use semantic vars:
`--surface-card`, `--text-primary/secondary/muted`, `--border`, `--color-accent*`, `--color-attention*` (coral),
`--color-highlight*` (berry), `--maturity-{seedling,budding,evergreen}`, `--elevation-sm/md`, `--focus-ring-*`.

**Atoms built:** `Text` (variant `display|body|mono`, size `h1|h2|h3|body|meta`), `Link`, `Icon` (has `sprout`).
**Molecules built:** `ThemeToggle`. **Organisms built:** `SiteHeader`, `SiteFooter`. **Layout built:** `Container` (`width="wide"` ≈ 860px, default ≈ 712px, safe-area insets).

**Conventions** (follow existing components): one folder per component = `Component.tsx` + `Component.module.css` + `index.ts`; props via named `interface`; CSS Modules referencing semantic tokens only; server component unless it needs state.

## 3. Components to build

Layered bottom-up. Each must consume tokens only and match the prototype class it maps to. Update `REGISTRY.md`
row to `built` in the same change. New rows (not yet in registry) are flagged **[new]**.

### Atoms

| Component | Maps to prototype | Acceptance |
|---|---|---|
| `Button` | `.btn`, `.btn.ghost` | `variant: "accent" \| "ghost"`, optional `href` (renders `Link`/`<a>` when set, `<button>` otherwise). Coral fill / card ghost, Bricolage 600, hover lift. |
| `MaturityBadge` | `.mat.seed/.bud/.ever` + `matIcon()` | `maturity: Maturity`. Mono label + 3-bar glyph; color from `--maturity-*`. Bar glyphs added to `Icon` set (`maturity-seedling/budding/evergreen`) and consumed here. |
| `HandDrawnUnderline` | `h1 .u svg` | Wraps a phrase; absolutely-positioned coral squiggle SVG, `white-space:nowrap`. Decorative (`aria-hidden` on SVG). |
| `Tag` [new] | `.tg` (+ optional `<b>count</b>`) | `href`, `label`, optional `count`. Mono chip, card bg, hover coral border. Used by topic list + "browse all". |

### Molecules

| Component | Maps to | Acceptance |
|---|---|---|
| `NoteCard` | `noteCard()` / `.note` | `note: Note`. Top row = `MaturityBadge` + tended date (right); `h3` title; dek; stage line (`topics · confidence`). Whole card links to `/notes/[slug]`. **Public surface: no draft styling/badge needed here** (home never shows drafts). Hover lift. |
| `SectionHeader` [new] | `.sh` (h2 + line + count) | `title`, optional `count` label (e.g. "9 notes"). Reused later by `/notes`, `/topics`. |

### Organisms

| Component | Maps to | Notes |
|---|---|---|
| `Hero` | `.hero` | Eyebrow "Hi, I'm Leonard" (coral dot via `::before`); `h1` with `HandDrawnUnderline` on "engineering notes"; lede (`em` emphasis); intro card (gradient avatar "L" + name + role + stack). Static content. |
| `WhatsGrowing` | `screenHome()` §2 | `SectionHeader title="What's growing" count="{n} notes"` + 3 `NoteCard` + `Tag`-style "browse all notes →" → `/notes`. Takes `notes` + `total` as props. |
| `AsideExcerpt` | `.aside` | Tape label, pull-quote, `<pre>` code block. **See Decision D1.** |
| `StatsStrip` | `.seeds`/`.sd` | 4 tiles from `stats()`: notes, topics, `pctCited%` (cited), `deadLinks` (green, "dead links"). 4-col → 2-col ≤520px. |
| `FreelanceCTA` | `.cta` | Heading + copy + `Button href="/about"`. Also reused by `/about` later. |

### Page

`src/app/page.tsx` — server component. Fetch via content API, compose organisms inside `Container`
(default width, matching the prototype's `.wrap`), add per-section vertical rhythm from the prototype.
Keep the file to data-fetch + composition only (no styling logic).

## 4. Interaction & routing translation

The prototype is a client SPA using `data-go`/`data-note`/`data-topic`. Translate to real links:

- `data-note="slug"` → `/notes/[slug]`  · `data-topic="t"` → `/topics/[tag]`  · `data-go="notes|about"` → `/notes`, `/about`.
- Home needs **no client JS** (theme toggle already lives in the header). Keep every home component a server component.

## 5. Decisions

- **D1 — AsideExcerpt source (recommended default):** hold the tape label, pull-quote, and code snippet as a
  small **typed editorial constant co-located with the `AsideExcerpt` organism** (not note frontmatter). Rationale:
  it is hand-picked editorial content, the prototype hardcodes it, and the schema has no `pullquote` field — adding
  one is out of scope and Phase-2-churn. Note in a comment that it can later migrate to a note's frontmatter. 
  *(Alternative if you prefer content-driven now: add an optional `pullquote`/`excerpt` field to the note schema —
  bigger blast radius, needs schema tests. Flagging for your call.)*
- **D2 — Featured set:** use `featured(3)` (deterministic newest-tended evergreen/budding). This may not equal the
  prototype's hardcoded trio (monolith/agentic/idempotency); that is acceptable and more maintainable. Confirm OK.
- **D3 — Stats values:** use real `stats()` output, not the prototype's literal "100%"/"0". With current seed
  content this renders 9 / topics / 100% / 0 — matching the prototype's intent.

## 6. Validation gates (definition of done)

1. `NoteCard` has a render test (`content-tester`): renders title, dek, maturity label, and a `/notes/[slug]` link; no draft markup on public render. (PRD §7 names note card as a required component test.)
2. `npx tsc --noEmit` clean (also runs via the edit hook).
3. Prettier + design-lint hook pass on every changed file (no raw hex outside `tokens/`).
4. `npm run build` (`next build`) succeeds; `/` is statically generated; no internal dead links.
5. `nextjs-reviewer` pass on the diff — address CRITICAL/HIGH before merge (separate pass; no self-approval).
6. Visual check vs prototype in **both** themes at desktop + mobile widths (hero clamp, 4→2 col stats, intro card wrap).
7. `REGISTRY.md` updated: every built component flipped `planned → built` (+ `Tag`, `SectionHeader` rows added).

## 7. Out of scope

Other routes (`/notes`, `/notes/[slug]`, `/topics`, `/topics/[tag]`, `/about`); MDX body rendering + `mdxComponents`;
filter bar / author view; SEO surface beyond what `layout.tsx` already sets (sitemap/RSS/OpenGraph are a later PRP).
Components built here (`NoteCard`, `FreelanceCTA`, `SectionHeader`, `Tag`, `MaturityBadge`) are deliberately
general so those later screens reuse them.

## 8. Task list (execution order)

1. Atoms: `Icon` maturity glyphs → `MaturityBadge`; `Button`; `Tag`; `HandDrawnUnderline`. (+ registry rows)
2. Molecules: `SectionHeader`; `NoteCard` + render test (RED→GREEN).
3. Organisms: `Hero`, `WhatsGrowing`, `AsideExcerpt`, `StatsStrip`, `FreelanceCTA`.
4. Compose `src/app/page.tsx` from the content API.
5. Gates §6: typecheck → build → `nextjs-reviewer` → visual check (both themes) → update `REGISTRY.md`.
6. Branch `feat/home-screen` off `main`; Conventional Commits; `/pr` (no AI attribution per `git-flow`).

## 9. Agent orchestration graph

Agents from `.claude/agents/`. CLAUDE.md rule: authoring and review are **separate lanes** — `ui-builder`
never approves its own work; `nextjs-reviewer` is read-only and runs as a distinct pass.

| Agent | Role | Lane | When |
|---|---|---|---|
| `content-architect` | **Conditional** — only if D1-alternative (add a `pullquote` schema field) is chosen | author | before Phase A |
| `ui-builder` | Builds all components + `app/page.tsx` from the prototype — the main executor | author | Phases A–D, + fixes |
| `content-tester` | `NoteCard` render test (RED→GREEN) | author/test | Phase B |
| `nextjs-reviewer` | Reviews the TS/Next diff — correctness, App Router, a11y, prototype fidelity (read-only) | review | after Phase D |
| `/verify-build` (command) | `tsc` + `next build` + dead-link check | gate | after Phase D |

Recommended path (D1/D2/D3 as-is) uses **3 agents**: `ui-builder`, `content-tester`, `nextjs-reviewer`.

**Dependency flow** (layers import only from below, so order is forced by the consumption chain):

```
[D1-alt only] content-architect  ──▶  schema field + tests
                                        │
Phase A  ui-builder:  Icon glyphs → MaturityBadge · Button · Tag · HandDrawnUnderline · SectionHeader
                                        │  (atoms/molecules ready)
Phase B  ui-builder: NoteCard.tsx  ◀──RED/GREEN──▶  content-tester: NoteCard.test   (PARALLEL pair)
                                        │  (NoteCard built + green)
Phase C  ui-builder:  Hero · WhatsGrowing · AsideExcerpt · StatsStrip · FreelanceCTA (independent siblings)
                                        │
Phase D  ui-builder:  compose app/page.tsx
                                        │  (code complete)
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼ gate (parallel)                                     ▼ review lane
   /verify-build: tsc + next build + dead links        nextjs-reviewer: severity-rated findings
        └───────────────────────────────┬───────────────────────────────┘
                                        ▼
                        fixes (ui-builder) ⇄ re-review   until clean + approved
                                        ▼
                 update REGISTRY.md → branch feat/home-screen → /pr
```

**Parallelism:** two points only — (1) NoteCard code ↔ its test (tight author/tester pair); (2) after Phase D,
`/verify-build` (mechanical) and `nextjs-reviewer` (judgment) run concurrently. Phase C's 5 organisms are
independent but small, so one focused `ui-builder` pass is lighter than fanning them out. Everything else is the
forced atoms → NoteCard → organisms → page spine.

---
**Review checkpoint:** confirm the plan and Decisions D1–D3, then implementation proceeds (no code until approved).

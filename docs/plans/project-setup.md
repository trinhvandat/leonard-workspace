# PRP — Project Setup (Base Code)

- **Status:** Draft — awaiting review
- **Branch:** `chore/project-setup`
- **Owner:** Leonard
- **Supersedes goal:** originally scoped as "home screen"; re-scoped to the foundation the home screen (and every other screen) builds on.

## Goal

Produce **base code**: a foundation complete enough that building any screen is pure composition — no bootstrapping, no token invention, no content plumbing inside a page. When this PRP is done, an engineer starts a screen by importing from `src/system-design/` and the content layer, and assembling.

**Done means:** `next build` passes · dark mode works · the shell renders on every route · adding one `.mdx` note flows into typed, validated data automatically.

## Source of truth

- Scope: `docs/PRD.md`.
- UI: the approved prototype artifact (`https://claude.ai/artifact/ABRSw9FFi9Z68kKWUioQB1`) — read as an artifact, never web-fetched.
- Consumption contract: the `design-system` skill (raw→semantic tokens, reuse-first, top-down from prototype).
- App conventions: the `nextjs-garden` skill. Content model: the `content-model` skill.
- Reuse lookup: `src/system-design/REGISTRY.md` (currently all `planned`).

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| All four phases in one setup task | **Yes** | Repo is empty; one clean foundation PR beats four tiny interdependent ones. |
| Content-layer tool | **Velite** | Zod schema, build-fails-on-bad-frontmatter, type-safe output, strong App Router + MDX DX. Direct fit for "fail the build on bad data". Reversible. |

## Scope

**In scope (shared / infrastructural):**
1. Next.js App Router + TS project, tooling, fonts, deploy-readiness.
2. Token layer (`src/system-design/tokens/`).
3. Content layer (`src/content/` + `content/notes/*.mdx`): schema, validation, loader, derivations, seed notes, tests.
4. Global shell + base layout (header, footer, theme toggle, container) + minimal placeholder `/`.

**Out of scope (deferred to per-screen PRPs):** Hero, WhatsGrowing, NoteCard, StatsStrip, AsideExcerpt, FreelanceCTA, filters, note-detail two-column + rail, MDX body rendering, content-display atoms (`MaturityBadge`, `HandDrawnUnderline`, `Button` variants beyond nav).

---

## Phase 0 — Project scaffold
*Agent: executor.*

- `create-next-app` — App Router, TypeScript, `src/` dir, no `/pages`.
- Wire the toolchain the existing `.claude/hooks/post-edit.sh` expects: Prettier, `tsc --noEmit`, ESLint (so the hook stops being a no-op).
- Fonts via `next/font/google`: Bricolage Grotesque (display), Newsreader (body serif), JetBrains Mono (meta/code).
- `.gitignore`, Vercel-ready defaults.

**Validation gate:** `next build` succeeds; `next dev` serves a page; `tsc --noEmit` clean; Prettier runs.

## Phase 1 — Token layer
*Agent: ui-builder. Top-down from the prototype; do not copy inline raw values into components.*

- `src/system-design/tokens/tokens.css` — **raw** (`--green #1f9e6b`, `--coral #f0603f`, `--berry #7c5cf0`, paper/ink/line/shadow from the prototype `:root`) **plus semantic aliases** (`--color-accent`, `--maturity-{seedling,budding,evergreen}`, `--surface-card`, `--text-*`, focus ring, dot-grid). Components consume **only semantic tokens**.
- `src/system-design/tokens/themes.css` — dark values for every token, under both `@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]`. `body` gets an explicit background in both themes.
- `src/system-design/tokens/typography.css` — font-family + type-scale tokens.

**Validation gate:** design-lint hook green (no raw hex outside `tokens/`); dark mode flips via both media query and `[data-theme]`; REGISTRY token rows → `built`.

## Phase 2 — Content layer
*Agents: content-architect (design) → content-tester (TDD) → executor (implement).*

- Install + configure **Velite**. Output type-safe, validated at build time.
- Zod frontmatter schema (PRD §4): `title`, `slug?` (default from filename), `maturity` (`seedling|budding|evergreen`), `topics[]`, `planted` (date), `tended` (date), `confidence` (`low|medium|high`), `citations[]`, `draft` (default false). **`next build` fails** on missing required field or bad enum.
- Seed **8–10 real `.mdx` notes** under `content/notes/` (content already drafted in the prototype `NOTES[]` + PRD), including at least one `draft: true`.
- Derivations (build-time, type-safe): `getPublicNotes()` (draft-excluded), `topicCounts()`, backlink graph (`[[wiki-link]]`, both directions), `featured()`, `stats()` (notes, topics, % cited, dead internal links).
- Phase-2-safe: no coupling to the public build-time layer that would block the later JWT + Spring Boot + PostgreSQL area.

**Validation gate:** content-tester suite green, **≥80% coverage** on content-layer logic; an intentionally-broken frontmatter fixture fails `next build`; drafts excluded from `getPublicNotes()`.

## Phase 3 — Shell + base layout
*Agent: ui-builder. Reuse-first; minimal shared atoms only.*

- Atoms: `Text`, `Link`, `Icon` (sprout logo + sun/moon).
- Layout: `Container` (max-width + safe-area insets).
- Organisms: `SiteHeader` (nav: Notes/Topics/About + `ThemeToggle`), `SiteFooter`.
- `ThemeToggle` — **client island**; persists to `localStorage` under a stable key; every read/write in try/catch; renders correctly when storage is empty or throws.
- Wire shell into `app/layout.tsx`; minimal placeholder `app/page.tsx` so build/deploy is green.

**Validation gate:** shell renders on every route; theme toggle persists and survives reload; light/dark/mobile/reduced-motion verified; REGISTRY rows → `built`.

## Phase 4 — Documentation
*Agent: writer (Haiku). The human entrypoint — complements, never duplicates, the `.claude/` skills (link to them instead of repeating).*

Write a developer guide so an engineer can start without reverse-engineering the repo. Covers the three jobs the user asked for — **use it, update it, work on it**:

- **Root `README.md`** — what the project is (one-liner + link to `docs/PRD.md`), quick start (`install` → `dev` → `build`), deploy (Vercel), and a map of the repo.
- **`docs/development.md` (or `CONTRIBUTING.md`)** — the working guide:
  - *Use* — scripts, architecture at a glance (`app/` = data + composition only; `src/system-design/` token→atom→organism→layout layers; `src/content/` = content layer), where things live.
  - *Update* — **how to add a note** (create one `.mdx` + frontmatter → lists/topics/backlinks auto-update; `/new-note`), how to change the frontmatter schema, how the build fails on bad data.
  - *Work on it* — the UI consumption contract (consume `system-design`, reuse-first via `REGISTRY.md`, top-down `/design-sync` for prototype changes), the test + validation gates, the PostToolUse hooks (format/typecheck/design-lint), and the `git-flow` branch/commit/PR workflow.
  - *Phase-2 seam* — one short note on what must stay un-coupled (future JWT + Spring Boot + PostgreSQL area).

**Validation gate:** quick start works verbatim on a clean checkout (`install` → `dev` → `build`); every doc link resolves; no duplication of skill content (links instead).

## Phase 5 — Review & verify
*Separate passes — never self-approve in the same context.*

- `nextjs-reviewer` pass → address CRITICAL/HIGH, then MEDIUM where feasible.
- `/verify-build`: clean `next build`, no internal dead links, dark-mode + responsive + safe-area checks, Lighthouse spot-check.
- `/pr` on `chore/project-setup` (Conventional Commits, squash-merge, no AI attribution per `git-flow`).

## Risks

- **MED** — token translation must be a faithful raw→semantic split, not a copy of the prototype's inline values.
- **MED** — content-layer choice locks in later screens (mitigated: Velite chosen deliberately).
- **LOW** — font FOUT, dot-grid contrast in dark mode, hook toolchain wiring.

## Definition of done

- [ ] `next build` passes; `tsc --noEmit` clean; no internal dead links.
- [ ] Dark mode works via `prefers-color-scheme` + manual toggle (persisted).
- [ ] Shell on every route; placeholder `/` deploys.
- [ ] Adding one `.mdx` note updates typed data / topic counts / backlinks with no extra wiring.
- [ ] Bad frontmatter fails the build; drafts hidden from public data.
- [ ] Content-layer tests ≥80% coverage; `nextjs-reviewer` findings addressed.
- [ ] REGISTRY rows for built tokens/atoms/organisms/layout → `built`.
- [ ] `README.md` + developer guide present; quick start works on a clean checkout; covers use / update (add a note) / work-on-it; links to skills rather than duplicating them.

## Follow-up PRPs (not this task)

`home-screen` → `notes-list` + `note-detail` → `topics` → `about`. Each is pure composition over this base.

# Leonard's Garden — Project Harness

Digital garden + portfolio. Static site, no backend in Phase 1.
Source of truth for scope: `docs/PRD.md`. Source of truth for UI: the prototype artifact linked in the PRD.

## Stack (Phase 1)

- **Next.js (App Router) + TypeScript** — SSG, metadata-driven SEO.
- **MDX + content layer** (Velite or Content Collections — decide in planning).
- **CSS tokens** taken from the mockup; dark mode built in.
- **Deploy:** Vercel.
- **No** auth / backend / database / comments / server search in Phase 1. Leave room for Phase 2 (auth + Spring Boot + PostgreSQL) — do not design anything that blocks adding routes/APIs later.

## Core principles

1. **Content is the heart.** A note is one `.mdx` file + frontmatter. Adding a note must auto-update lists, topics, and backlinks with zero extra wiring.
2. **Fail the build on bad data.** Frontmatter is schema-validated; invalid or missing required fields break `next build`.
3. **UI follows the prototype, through system-design.** The approved artifact is the source of truth for layout, tokens, and dark mode — match it, don't reinvent. All UI code **consumes `system-design/`** (tokens + components): no hardcoded colors/fonts/spacing, no re-implementing a component that exists — reuse or extend it. A new or changed prototype is reconciled top-down (token → component → page), not hand-patched. Read the `design-system` skill (the consumption contract) before any UI edit.
4. **Test the content layer.** Frontmatter parsing, schema validation, backlink/topic derivation have tests; target ≥80% coverage on that logic.
5. **Small, focused files.** Organize by feature, not by type. Handle errors explicitly; never trust external data.

## The harness in `.claude/`

- **Agents** (`.claude/agents/`): delegate specialized passes.
  - `content-architect` — content-layer & schema design, backlink/topic derivation, Phase-2-safe decisions.
  - `ui-builder` — build screens from the prototype: CSS tokens, dark mode, responsive.
  - `content-tester` — TDD for the content layer (parse, validate, derive).
  - `nextjs-reviewer` — review TS/Next.js code after it's written.
- **Skills** (`.claude/skills/`): self-written reference, read before implementing.
  - `content-model` — frontmatter schema, maturity, `[[wiki-link]]` backlinks, draft rules, derivation.
  - `design-system` — colors, fonts, dark mode, identity details from the mockup.
  - `nextjs-garden` — routes, MDX rendering, SEO, project conventions.
  - `git-flow` — trunk-based development, branch naming, Conventional Commits, PR process.
- **Commands** (`.claude/commands/`): `/plan` (produce a PRP — an executable plan with validation gates — into `docs/plans/`, then stop for review), `/new-note`, `/check-content`, `/verify-build`, `/pr`, `/design-sync` (reconcile a new/updated prototype → tokens → components → pages, top-down).
- **Design system** (`src/system-design/`): tokens → atoms → molecules → organisms → layouts that pages import; `REGISTRY.md` is the reuse-first lookup. Governed by the `design-system` skill's consumption contract.
- **Hooks** (`.claude/settings.json`): after every edit, auto-format (Prettier) + typecheck (`tsc --noEmit`) changed files, and **design-lint** CSS (no raw hex outside `tokens/`). No-ops safely until the toolchain exists; design-lint needs only grep.

## Workflow

Plan → branch off `main` → write tests first for content-layer logic → implement → `nextjs-reviewer` pass → `/verify-build` → `/pr`.
Keep authoring and review in separate passes; never self-approve in the same context.

## Git

Trunk-based: `main` is always releasable and every merge deploys to Vercel. Short-lived branches named `<type>/<short-desc>`, Conventional Commits (`<type>(scope): description`), squash-merge PRs via `.github/pull_request_template.md`. Full rules in the `git-flow` skill. No AI attribution lines in commits or PRs.

## Routes (Phase 1)

`/` · `/notes` (filter by maturity + topic) · `/notes/[slug]` (2-col: reading column + meta rail) · `/topics` · `/topics/[tag]` · `/about` (CV + contact, the HR landing).

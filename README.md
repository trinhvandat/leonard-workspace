# Leonard's Garden

A digital garden and portfolio — engineering notes that grow from seedlings into evergreen
lessons, plus an about page that doubles as a landing for HR and freelance work. Static site,
no backend in Phase 1.

- **What & why:** see [`docs/PRD.md`](docs/PRD.md) (scope, goals, two-phase strategy).
- **Stack:** Next.js (App Router) + TypeScript, statically generated · MDX notes via
  [Velite](https://velite.js.org) · CSS token design system · deployed on Vercel.

## Quick start

```bash
npm install     # install dependencies
npm run dev     # dev server at http://localhost:3000
npm run build   # validate content + production build
```

`npm run dev` and `npm run build` both compile the content layer first (Velite), so a note with
bad frontmatter surfaces immediately. The build **fails** on invalid frontmatter — see
[`docs/development.md`](docs/development.md).

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Velite + Next dev server (lenient — a WIP note won't block you) |
| `npm run build` | `velite build --strict` + `next build` — the release gate |
| `npm run content` | Rebuild the content layer only (strict) |
| `npm test` / `npm run test:coverage` | Content-layer unit tests (Vitest) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `npm run format` | ESLint / Prettier |

## Repo map

```
src/app/            Next.js App Router — routes, root layout (the shell), fonts, globals.
                    Pages do data-fetching + composition only.
src/system-design/  The design system: tokens → atoms → molecules → organisms → layouts.
                    REGISTRY.md is the reuse-first lookup. Pages import from here.
src/content/        The content layer — schema, derivations, backlink graph (pure, tested).
content/notes/      The notes. One note = one .mdx file + frontmatter.
velite.config.ts    Content build: validates frontmatter, emits typed data into .velite/.
docs/               PRD, plans, and the developer guide.
.claude/            Project harness — agents, skills (the reference docs), commands, hooks.
```

## Deploy

Push to `main` → Vercel builds and deploys (trunk is the release line). `npm run build` must be
green first. Branch/commit/PR conventions live in the `git-flow` skill.

## Learn more

The [`.claude/skills/`](.claude/skills) directory holds the project's reference docs — read these
before working in an area, rather than reverse-engineering the repo:

- **`content-model`** — frontmatter schema, maturity, `[[wiki-link]]` backlinks, draft rules.
- **`design-system`** — tokens, dark mode, and the UI consumption contract.
- **`nextjs-garden`** — App Router structure, MDX, routes, and the SEO surface.
- **`git-flow`** — branching, Conventional Commits, and the PR process.

New here and want to add a note or change a screen? Start with
[`docs/development.md`](docs/development.md).

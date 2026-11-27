# Development guide

How to **use**, **update**, and **work on** Leonard's Garden. This is the human entry point; the
deep reference lives in the [`.claude/skills/`](../.claude/skills) directory — this guide links to
those rather than repeating them.

For _what_ the project is and its scope, see [`PRD.md`](./PRD.md). For the foundation build, see
[`plans/project-setup.md`](./plans/project-setup.md).

---

## Use

### Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

### Architecture at a glance

Work flows one direction — **prototype → tokens → components → pages** — and each layer only
imports from its own layer or below.

| Area | Role |
|---|---|
| `src/app/` | Routes + the root layout (shell). Pages do **data-fetching and composition only** — they import finished pieces from `src/system-design/` and never define reusable styling. |
| `src/system-design/` | The design system in layers: `tokens/` → `atoms/` → `molecules/` → `organisms/` → `layouts/`. [`REGISTRY.md`](../src/system-design/REGISTRY.md) is the reuse-first lookup. |
| `src/content/` | The content layer: `schema.ts` (Zod frontmatter), `derive.ts` (public filter, topic counts, backlink graph, stats), `wiki-links.ts`, and `index.ts` (the public API over the generated data). Pure, unit-tested, build-time only. |
| `content/notes/` | The notes themselves — one `.mdx` file per note. |

Routes planned for Phase 1 (see the `nextjs-garden` skill): `/`, `/notes`, `/notes/[slug]`,
`/topics`, `/topics/[tag]`, `/about`.

---

## Update — add or change a note

**Adding a note requires nothing but creating the file.** Lists, topic pages, and backlinks all
derive automatically.

1. Create `content/notes/<slug>.mdx` (or run `/new-note`).
2. Give it frontmatter that satisfies the schema (full reference: the **`content-model`** skill):

   ```yaml
   ---
   title: "Your note title"
   maturity: seedling # seedling | budding | evergreen
   topics: [architecture, postgres]
   planted: "2026-11-27" # quote the dates
   tended: "2026-11-27"
   confidence: medium # low | medium | high
   citations: ["https://source.example"] # optional
   draft: false # true = hidden from every public surface
   ---
   ```

3. Write the body. Link to another note with `[[other-note-slug]]` — that feeds the **bidirectional
   backlink graph** (the target knows it's linked _from_ you). Link only to **published** notes; a
   `[[wiki-link]]` to a `draft` note is a dead link in the public graph.

`slug` is optional — it defaults to the filename. `draft: true` hides a note from lists, topic
pages, the backlink graph, and (later) the sitemap and RSS.

### The build fails on bad data — on purpose

Frontmatter is validated against the Zod schema at build time. `npm run build` (and `npm run
content`) run `velite build --strict`, which **exits non-zero** on a missing required field or an
out-of-range enum, naming the file and the field:

```
content/notes/my-note.mdx
 error Invalid enum value. Expected 'seedling' | 'budding' | 'evergreen', received 'sapling'  maturity
```

> Note: Velite's config option `strict: true` only _logs_ violations; the CLI `--strict` flag is
> what aborts the build. That flag is wired into the `build`/`content` scripts. `npm run dev` stays
> lenient so a work-in-progress note doesn't block the dev server.

### Changing the schema

Edit `src/content/schema.ts` (the single source of truth, imported by both Velite and the tests),
then update the **`content-model`** skill to match, and add/adjust a test in
`src/content/schema.test.ts`. Keep `slug` / note identity stable — Phase 2 depends on it.

---

## Work on it — changing the UI

All UI obeys the **consumption contract** in the **`design-system`** skill. The essentials:

- **Consume semantic tokens, never hardcode.** Components use `var(--color-accent)`,
  `var(--text-primary)`, `var(--type-family-display)`, etc. — never raw hex or literal font names.
  Raw values live only in `src/system-design/tokens/`.
- **Reuse before you create.** Check [`REGISTRY.md`](../src/system-design/REGISTRY.md) first; if a
  component covers ~70%+ of the need, extend it (add a prop/variant) rather than fork it. New
  components go in the right layer with a `built` REGISTRY row.
- **Reconcile a new prototype top-down.** When the prototype changes, run `/design-sync` and apply
  changes along `token → component → page` — most updates are a single token-value change the whole
  site inherits. Don't hand-patch scattered files.

### Tests and gates

- `npm test` — content-layer unit tests (Vitest). Target **≥80% coverage** on the derivation logic.
- `/check-content` — content-specific checks (frontmatter, backlinks, draft leakage).
- `/verify-build` — the full definition-of-done gate before a PR: `tsc`, tests, `next build`, no
  internal dead links, light/dark/responsive.

### Automatic hooks

A `PostToolUse` hook (`.claude/hooks/post-edit.sh`) runs on every edit:

- **Prettier** formats the changed file.
- **`tsc --noEmit`** typechecks the project on `.ts`/`.tsx` edits (feedback, non-blocking).
- **design-lint** rejects raw hex in component/app CSS (allowed only under `tokens/`).

### Git workflow

Trunk-based — see the **`git-flow`** skill. Branch off `main` as `<type>/<short-desc>`, use
Conventional Commits (`<type>(scope): description`), open a PR with
[`.github/pull_request_template.md`](../.github/pull_request_template.md), and squash-merge. No AI
attribution lines in commits or PRs.

---

## Phase-2 seam — keep this un-coupled

Phase 2 will add an authenticated area (JWT) plus **Spring Boot + PostgreSQL** for private,
DB-stored notes. The Phase 1 content layer is a **pure build-time read — no runtime database, no
auth**. Keep it that way: Phase 2 should be _added beside_ it (App Router makes new routes/APIs
easy), never retrofitted into the public layer. Don't couple page composition or the content layer
to anything that assumes a runtime data source.

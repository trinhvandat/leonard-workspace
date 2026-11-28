# PRP — Note detail (`/notes/[slug]`)

- **Status:** Draft — D2/D3/D4 confirmed (2026-11-28); awaiting go-ahead to implement
- **Created:** 2026-11-28
- **Scope:** The dynamic note route `/notes/[slug]` only, matching the `#note-*` screen of the approved prototype (`screenNote()`), using `monolith-to-microservices` as the reference note.
- **Source of truth (UI):** Artifact `ABRSw9FFi9Z68kKWUioQB1`, `screenNote()` + the `.article`/`.notegrid`/`.prose`/`.metacard`/`.toc`/`.cites`/`.backlinks` CSS. The prototype wins over prose; match it.
- **Source of truth (scope):** `docs/PRD.md` §5 (route `/notes/[slug]`), §4 (content model + backlinks), §6 (MDX + syntax highlight), §3 (design system).
- **Owner agents:** `content-architect` (MDX render + wiki-link design), `content-tester` (wiki-link render + heading-extraction tests), `ui-builder` (components + page), `nextjs-reviewer` (review pass).

---

## 1. Goal

Render a single note as a static page from its `.mdx` file: a **2-column reading layout** — ~680px reading column (compiled MDX body + metabar + citations + connected notes + foot nav) beside a 248px sticky meta rail (Field notes + "On this page" TOC + Connected) — collapsing to one column ≤900px. It must be a **server component** (SSG via `generateStaticParams`), data-driven from the existing content API, pixel-faithful to the prototype in both themes, responsive, token-pure, and it must `notFound()` for unknown or draft slugs.

This route is the **first one that renders the MDX body**, so it owns three content-layer rendering decisions the home screen deferred: how compiled MDX is rendered, how `[[wiki-link]]` becomes a real link, and how code blocks get highlighted. Those are the substance of this PRP (§5 Decisions); the layout itself is composition over already-tested data.

## 2. What already exists — reuse, do not rebuild

**Content data API** (`src/content/index.ts`) — tested, consume as-is:

| Need on this page | Call |
|---|---|
| The note (public only; drafts excluded) | `getNoteBySlug(slug)` → `Note \| undefined` |
| Static params (public slugs) | `getPublicNotes().map(n => n.slug)` |
| Bidirectional connected notes | `backlinks().graph.get(slug)` → `{ linksTo[], linkedFrom[] }` |
| Resolve a connected slug → title | `getNoteBySlug(slug)` |
| Metadata description (dek) | `extractDek(note.raw)` (reuse `molecules/NoteCard/dek.ts`) |

`Note` already carries everything the rail needs: `title, maturity, confidence, planted, tended, topics, citations, path, raw, body`. `body` is the **compiled MDX function-body string** (`s.mdx()`); `raw` is the untouched source feeding the backlink graph.

**Tokens** — complete. Reuse semantic vars used by the home screen plus: `--maturity-{seedling,budding,evergreen}` for the badge, and map the prototype's **confidence dot** (`.conf.high/.medium/.low`) to `--color-accent` (green) / `--color-attention` (coral) / `--text-muted`. Add no raw hex (design-lint enforces).

**Already built & reused here:** atoms `Text`, `Link`, `Icon`, `MaturityBadge`, `Button`, `Tag`; molecule `SectionHeader`; organisms `SiteHeader`/`SiteFooter` (via `layout.tsx`); layout `Container`. The prototype's `.section-mini` heading (Citations / Connected) is a `SectionHeader`-family element — reuse or extend it rather than a new heading.

**Conventions** (match existing components): one folder per component = `Component.tsx` + `Component.module.css` + `index.ts`; props via named `interface`; CSS Modules → semantic tokens only; server component unless it needs state; flip the `REGISTRY.md` row to `built` in the same change.

## 3. Content-layer work (do first — everything renders on top of it)

This is the new ground. It lives under `src/content/` and `src/system-design/mdx/`, is owned by `content-architect`, and is covered by `content-tester` before the UI consumes it.

### 3a. MDX rendering bridge — `src/system-design/mdx/`

- `MDXContent.tsx` — turns a `Note['body']` (compiled function-body string) into React via the React jsx runtime (the Velite-documented `new Function(code)({ ...jsxRuntime })` pattern), passing the `mdxComponents` map. Runs at build/SSG on the server (no client JS). **See Decision D1.**
- `mdxComponents.tsx` — the element map: `h2/h3` → prototype heading styles (with `id`s for TOC/anchors); `p/ul/li/code/pre` → `.prose` styling; `a` → `Link`; the **WikiLink** element (D2) → resolved internal link; `blockquote`/callout handling per D5. Registered in `REGISTRY.md` MDX bridge row.
- `prose.module.css` — the `.prose` ruleset from the prototype (font sizes, heading rhythm, `code`/`pre`, `.wl` dotted wiki-link, `.callout`), tokens only. `h2` gets `scroll-margin-top` for anchor landings.

### 3b. Wiki-link rendering — `[[slug]]` → link (Decision D2)

The backlink *graph* already parses `raw`; this adds the **render** counterpart so `[[feature-flags-that-scale]]` appears inline as the prototype's dotted `.wl` link. Recommended split (keeps derivations pure, resolution at the render boundary where the content API is available):

1. A **remark plugin** (`src/content/remark-wiki-link.ts`), registered in `velite.config.ts` `mdx.remarkPlugins`, rewrites each `[[slug]]` text occurrence into a `wikiLink` MDX element carrying the raw `slug`.
2. `mdxComponents` renders `wikiLink`: resolve `slug` via `getNoteBySlug` — if public → `Link href="/notes/[slug]"` with the target's `title` as text (prototype shows the slug text, but the title reads better; **confirm** — see D2); if unresolved/draft → plain text (never a dead `<a>`). Dead targets are already counted by `buildBacklinkGraph` and surfaced by the build dead-link check.

### 3c. Heading extraction for the TOC (Decision D4)

The rail's "On this page" needs the note's `h2/h3` as `{ id, text, depth }[]`. Extract at build via a small rehype/remark step (rehype-slug for ids + a headings collector) exposed as a Velite-derived field (`toc`) **or** derived from `raw` with a pure parser in `src/content/toc.ts`. Recommended: pure `src/content/toc.ts` over `raw` (unit-testable like the other derivations, no Velite coupling), with `rehype-slug` ensuring the rendered headings get matching ids. **Confirm in D4.**

## 4. Components to build

Layered bottom-up; each consumes tokens only and maps to a prototype class.

### Molecules (`src/system-design/molecules/`)

| Component | Maps to prototype | Acceptance |
|---|---|---|
| `MetaRow` | `.metacard` rows + `.metabar` (narrow) | `note: Note`. Renders planted/tended (via `fmtDate`-equivalent — reuse `NoteCard/formatTended.ts`), maturity (`MaturityBadge`), confidence dot+label. Two presentations: rail card (`.metacard`) and inline mobile bar (`.metabar only-narrow`) — one component, a `variant`/layout prop, or a thin wrapper. |
| `CitationList` | `.section-mini` Citations + `.cites` | `citations: string[]`. Numbered `[n]` list; each an external `Link` (`target=_blank rel=noopener`); display the host or full URL (prototype shows a label — we only have the URL, so render the URL/host; **note**). Rendered only when `citations.length > 0`. |
| `BacklinkList` | `.backlinks` + `.sideconnect` (rail) | `connected: { direction: "linksTo"\|"linkedFrom"; note: Note }[]`. Two presentations: the in-column `.backlinks` cards ("links to →" / "← linked from") and the compact rail `.sideconnect`. Empty → the prototype's "No connected notes yet — this one's still a seedling." line. |
| `TableOfContents` | `.toc` ("On this page") | `headings: TocHeading[]`. Server-rendered anchor links (`#id`). Hidden when `< 2` headings (matches prototype's `hidden` default). Scroll-spy active state (`.toc a.on`) is a **progressive-enhancement client island — see D4**; ship server links first. |
| `TopicChipList` | `.metacard .tgs` (`#topic`) | `topics: string[]`. Row of `Tag` → `/topics/[tag]`. (Registry row already `planned`; reused by rail Field-notes tags.) |

### Organisms (`src/system-design/organisms/`)

| Component | Maps to | Notes |
|---|---|---|
| `NoteReadingColumn` | `.notemain` | `note`, `connected`. Composes: narrow `MetaRow` → `MDXContent(note.body)` inside `.prose` → `CitationList` → in-column `BacklinkList` → `.notefoot` (`Button`/`Tag`: "← all notes", "Work with me →"). |
| `NoteMetaRail` | `.noteside` | `note`, `headings`, `connected`. Sticky rail: "Field notes" `MetaRow` + `TopicChipList` → `TableOfContents` → rail `BacklinkList`. `display:none` ≤900px (the column renders the narrow metabar + in-column connected instead). |

### Layout (`src/system-design/layouts/`)

| Component | Maps to | Acceptance |
|---|---|---|
| `TwoColumnReading` | `.notegrid` | `main`, `rail` slots. `grid-template-columns: minmax(0,1fr) 248px; gap: 52px; align-items:start`; collapses to one column with the rail hidden ≤900px. Sticky offset on the rail accounts for the header + safe-area (`top: calc(env(safe-area-inset-top) + 82px)`). |

### Page

`src/app/notes/[slug]/page.tsx` — server component:
- `export function generateStaticParams()` → public slugs only (drafts not statically generated).
- `export async function generateMetadata({ params })` → title = note title; description = `extractDek(note.raw)`. Full OpenGraph/sitemap/RSS stays **out of scope** (later SEO PRP, per the home plan).
- Default export: `getNoteBySlug(slug)`; if `undefined` → `notFound()`. Fetch `backlinks().graph.get(slug)`, resolve connected notes (drop drafts), build `headings`, render the page-head (crumb + `MaturityBadge` + `h1`) then `TwoColumnReading` with `NoteReadingColumn` + `NoteMetaRail` inside the prototype's `.notewrap` (~1060px) width.
- `src/app/notes/[slug]/not-found.tsx` — the prototype's 404/empty treatment (optional; may defer to a route-group `not-found` in a later PRP — **note**).

## 5. Decisions (confirm before build)

- **D1 — MDX render runtime (recommended):** render `note.body` **server-side** via the React jsx-runtime + `new Function` pattern in a server `MDXContent` component. Rationale: Phase 1 is pure SSG; server rendering keeps the body out of the client bundle and needs no `"use client"`. *(Alternative: Velite's `useMDXComponent` client hook — unnecessary client JS for static prose. Recommend server.)*
- **D2 — Wiki-link resolution [CONFIRMED]:** remark plugin marks `[[slug]]`, `mdxComponents` resolves via the content API at render (§3b). Resolved links display the **target note's title**; unresolved/draft → plain text (never a dead `<a>`).
- **D3 — Syntax highlighting [CONFIRMED: Shiki]:** highlight code blocks at **build time with Shiki** (via `@shikijs/rehype` in Velite's `mdx.rehypePlugins`), dual light/dark theme driven by the existing theme tokens/`data-theme`. Zero client JS, SSG-friendly, matches the prototype's highlighted Kotlin. Adds dev deps (`shiki` / `@shikijs/rehype`).
- **D4 — TOC + scroll-spy [CONFIRMED: defer scroll-spy]:** server-render the TOC from headings extracted via a pure `src/content/toc.ts` over `raw`, with `rehype-slug` giving rendered headings matching ids. **Scroll-spy active highlight is deferred** to a later client-island pass — out of scope for this PRP. Static anchor links ship now.
- **D5 — Callouts:** the prototype's berry `.callout` is editorial; **current note `.mdx` files contain none** (plain markdown only). Map `blockquote` → the `.callout` style so a future `> …` renders correctly, and keep `.callout` CSS available; do **not** invent a custom `<Callout>` MDX component yet (YAGNI / Phase-2 churn). *(Confirm.)*
- **D6 — Draft handling:** drafts are not publicly addressable (`getNoteBySlug` excludes them) and are **not** in `generateStaticParams`, so `/notes/<draft-slug>` → `notFound()`. The prototype's "author view (show drafts)" belongs to `/notes` (a later PRP), not here. *(Confirm no author view on this route in Phase 1.)*

## 6. Validation gates (definition of done)

1. **Content-layer tests (`content-tester`, RED→GREEN):** wiki-link render resolution (resolved slug → link to `/notes/[slug]`; unresolved/draft → plain text, no dead `<a>`); `toc.ts` heading extraction (ids, depth, order; `< 2` headings → hidden). PRD §7 names backlinks + note-page render as required tests.
2. `npx tsc --noEmit` clean (also runs via the edit hook).
3. Prettier + design-lint pass on every changed file (no raw hex outside `tokens/`); `npm run content` (velite `--strict`) passes with the new remark/rehype plugins wired.
4. `npm run build` succeeds; every public note statically generated; **no internal dead links** (the backlink dead-link count stays 0 for public notes); draft slug 404s.
5. `nextjs-reviewer` pass on the diff — CRITICAL/HIGH addressed before merge (separate lane; no self-approval).
6. Visual check vs prototype in **both** themes, at desktop (2-col + sticky rail + TOC) and mobile ≤900px (1-col, rail hidden, narrow metabar + in-column connected). Verify highlighted code reads in both themes.
7. `REGISTRY.md` updated: `MetaRow`, `CitationList`, `BacklinkList`, `TableOfContents`, `TopicChipList`, `NoteReadingColumn`, `NoteMetaRail`, `TwoColumnReading`, `mdxComponents` flipped `planned → built`.
8. **Recorded evidence for Leonard (required, not optional):** run the app (`npm run dev`), open `/notes/monolith-to-microservices` in the browser and **record a GIF** (claude-in-chrome `gif_creator`) demonstrating it actually runs — scroll the reading column, a `[[wiki-link]]` resolving to another note, highlighted code, the sticky rail/TOC on desktop, the theme toggle (light **and** dark), and the ≤900px 1-column collapse. Also capture a `notFound()` draft slug (e.g. `/notes/event-driven-sagas` → 404). Save with a meaningful name and **share the path/recording with Leonard**. This is the final proof — it does **not** replace the `nextjs-reviewer` pass (gate 5), it comes after it. (Memory: *always-manual-test-and-record*.)

## 7. Out of scope

`/notes` list + filter bar/author view; `/topics`, `/topics/[tag]`; `/about`; full SEO surface (OpenGraph images, `sitemap.xml`, RSS — later PRP); a shared route-group `not-found`; TOC scroll-spy if deferred per D4. Components built here are general so those routes reuse `MetaRow`, `BacklinkList`, `TableOfContents`, `EmptyState`-adjacent pieces, and the whole MDX bridge.

## 8. Task list (execution order)

1. **Content layer** (`content-architect` + `content-tester`): remark wiki-link plugin + velite wiring (D2); Shiki rehype in velite (D3); `src/content/toc.ts` (D4) — each with tests (RED→GREEN). Verify `npm run content` still strict-passes.
2. **MDX bridge** (`ui-builder`): `MDXContent`, `mdxComponents`, `prose.module.css` (D1/D5).
3. **Molecules** (`ui-builder`): `MetaRow`, `CitationList`, `BacklinkList`, `TableOfContents`, `TopicChipList` (+ registry rows). `BacklinkList`/wiki render tests land with step 1 where they touch content logic.
4. **Layout + organisms** (`ui-builder`): `TwoColumnReading`; `NoteReadingColumn`; `NoteMetaRail`.
5. **Page** (`ui-builder`): `app/notes/[slug]/page.tsx` (`generateStaticParams`, `generateMetadata`, `notFound`), optional `not-found.tsx`.
6. **Gates §6:** typecheck → `npm run content` → `next build` + dead-link check → `nextjs-reviewer` → visual check (both themes, both widths) → update `REGISTRY.md`.
7. **Record evidence (gate §6.8):** `npm run dev`, drive `/notes/[slug]` in the browser, record the GIF (light + dark, desktop + mobile, wiki-link, highlighted code, draft→404), save with a meaningful name, and **send Leonard the recording** before calling the work done.
8. Branch `feat/note-detail` off `main`; Conventional Commits; `/pr` (no AI attribution per `git-flow`).

## 9. Agent orchestration graph

Agents from `.claude/agents/`. CLAUDE.md rule: authoring and review are **separate lanes** — authors never approve their own work; `nextjs-reviewer` is read-only and runs as a distinct pass.

| Agent | Role | Lane | When |
|---|---|---|---|
| `content-architect` | Design the MDX render bridge, wiki-link remark plugin, Shiki wiring, `toc.ts` (the §3 ground) | author | Phase A |
| `content-tester` | Tests for wiki-link resolution + `toc.ts` extraction (RED→GREEN) | author/test | Phase A (paired) |
| `ui-builder` | MDX bridge components, molecules, layout, organisms, the page | author | Phases B–D, + fixes |
| `nextjs-reviewer` | Reviews the TS/Next diff — App Router (`generateStaticParams`/metadata/`notFound`), a11y, prototype fidelity (read-only) | review | after Phase D |
| `/verify-build` (command) | `content` + `tsc` + `next build` + dead-link check | gate | after Phase D |

**Dependency flow** (layers import only from below; the content layer gates everything):

```
Phase A  content-architect: remark wiki-link + Shiki + toc.ts   ◀──RED/GREEN──▶  content-tester: resolution + toc tests   (PARALLEL pair)
                                        │  (content layer green + velite strict-passes)
Phase B  ui-builder:  MDXContent · mdxComponents · prose.module.css
                                        │  (body can render)
Phase C  ui-builder:  MetaRow · CitationList · BacklinkList · TableOfContents · TopicChipList   (independent siblings)
                                        │
Phase D  ui-builder:  TwoColumnReading · NoteReadingColumn · NoteMetaRail → app/notes/[slug]/page.tsx
                                        │  (code complete)
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼ gate (parallel)                                     ▼ review lane
   /verify-build: content + tsc + build + dead links    nextjs-reviewer: severity-rated findings
        └───────────────────────────────┬───────────────────────────────┘
                                        ▼
                        fixes (ui-builder) ⇄ re-review   until clean + approved
                                        ▼
         ui-builder: npm run dev → drive /notes/[slug] in browser → record GIF
         (light+dark · desktop+mobile · wiki-link · highlighted code · draft→404)
                   → SEND LEONARD THE RECORDING   (gate §6.8, required)
                                        ▼
                 update REGISTRY.md → branch feat/note-detail → /pr
```

**Parallelism:** two points — (1) the Phase A content work ↔ its tests (tight author/tester pair); (2) after Phase D, `/verify-build` (mechanical) and `nextjs-reviewer` (judgment) run concurrently. Phase C's molecules are independent but small, so one focused `ui-builder` pass beats fanning out. Everything else is the forced content → MDX bridge → molecules → organisms → page spine.

---
**Review checkpoint:** D2/D3/D4 confirmed; D1 (server-side MDX render), D5 (blockquote→callout), D6 (draft→404) stand as recommended unless you object. Give the go-ahead and implementation proceeds from Phase A (no code until then).

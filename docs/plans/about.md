# PRP — About / CV landing (`/about`)

- **Status:** Draft — D1/D6 confirmed (2026-11-28); D2–D5 stand as recommended; awaiting go-ahead to implement
- **Created:** 2026-11-28
- **Scope:** The static route `/about` only, matching the `#about` screen of the approved prototype (`screenAbout()`). This is the **portfolio's #1-priority surface** — the page sent to HR and freelance/contract leads (PRD §1).
- **Source of truth (UI):** Artifact `ABRSw9FFi9Z68kKWUioQB1`, `screenAbout()` + the `.about-hero` / `.panel` / `.job` / `.skillset` / `.sk` / `.cvcols` / `.cta` / `.contactrow` / `.copybtn` CSS. The prototype wins over prose; match it in both themes.
- **Source of truth (scope):** `docs/PRD.md` §5 (route `/about` — "landing cho HR"), §1 (priority #1), §6 (About = capability summary + GitHub/CV links + contact button), §3 (design system).
- **Owner agents:** `content-architect` (CV data module + schema, Avatar/PageHead extraction), `content-tester` (data-schema + `CopyButton` tests), `ui-builder` (atoms, molecules, organisms, page), `nextjs-reviewer` (review pass).

---

## 1. Goal

Render `/about` as a **fully static** server-rendered page from a typed CV data module: a page-head (crumb + 72px gradient avatar + name + one-line pitch), a "What I do well" panel (summary + skill chips), a two-column CV grid (Experience + How I work, collapsing to one column ≤620px), and a left-aligned contact card (copy-email, GitHub, CV) that reuses the home CTA's card shell. It must be token-pure, pixel-faithful to the prototype in light **and** dark, responsive, and confine its only interactivity — copy-to-clipboard — to a single small client island, leaving the rest server-rendered (zero unnecessary client JS).

Unlike `/notes/[slug]`, this route renders **no MDX and no note data** — its substance is (a) deciding where the CV content lives so it isn't scattered inline (D1) and (b) three reuse-vs-extract calls that pay off across the remaining routes: a generic `PageHead`, an extracted `Avatar` atom, and a shared CTA card shell (D2–D4). Those are the real decisions here; the layout is composition of small pieces.

## 2. What already exists — reuse, do not rebuild

Confirmed by a full survey of `src/system-design/` + `src/content/` + `src/app/` on 2026-11-28.

**Reuse as-is:**

| Need on this page | Reuse |
|---|---|
| 860px page width (`.wrap-wide`) | `Container width="wide"` — already has `content`(712)/`wide`(860)/`reading`(1060). No new variant. |
| 712px width if needed | `Container` (default `content`). |
| Headings / body / mono labels | `Text` atom — `size: h1\|h2\|h3\|body\|name\|meta`, `variant: display\|body\|mono`. |
| Internal + external links | `Link` atom (`external` → `target=_blank rel=noopener noreferrer`). |
| Buttons | `Button` atom (`variant: accent\|ghost`, `href?`). |
| Crumb → topic/notes links later | `Link`; `Tag` for `#topic` pills (not used on `/about`). |

**Extend / extract (shared with ≥1 other surface — belongs in `system-design/` per the consumption contract):**

- **`FreelanceCTA`** (`organisms/FreelanceCTA/`) already exists and its doc comment says *"Reused on `/about` later."* But the prototype's `/about` contact block is **not** the home CTA: it is left-aligned, has different copy ("Open to freelance & contract backend work"), and swaps the single "Say hello" button for a `.contactrow` of copy/link buttons. What the two share is the **`.cta` card shell** (border, `border-radius:18px`, `--surface-card`, `--elevation-md`, padding). → **D4**: extract that shell so both consume it; do not duplicate it.
- **Avatar gradient "L" square** is currently **inline** in `Hero` (`organisms/Hero/Hero.module.css .avatar`: 46px, `linear-gradient(142deg, var(--color-accent), var(--color-highlight))` = green→berry). `/about` needs the same square at **72px**. Two call-sites (Hero intro + about-hero) = extract an `Avatar` atom. → **D2**.
- **Page-head**: `NotePageHead` exists but is **note-bound** (takes a `Note`, hardcodes the `garden / notes / slug` crumb + a `MaturityBadge`). The prototype's `.pagehead` (crumb + `h1.pt` + `.sub`) recurs on `/about`, `/notes`, `/topics`, `/topics/[tag]`. → **D3**: build a generic `PageHead`.

**Must create new (nothing close exists):**

- `src/app/about/page.tsx` — the route (no `src/app/about/` today).
- CV **data module** — no experience/skills/CV data lives anywhere today (all identity text is inline in `Hero`/`FreelanceCTA`). → **D1**.
- `Panel`, `SkillList`, `JobEntry` molecules — `.panel`/`.skillset`+`.sk`/`.job`. (`.sk` is a non-link paper-2 chip — distinct from `Tag`, which requires `href` and uses green-soft; do not force-fit `Tag`.)
- `CopyButton` — `"use client"` island (`.copybtn`). Pattern = `ThemeToggle` (the only existing client component: `useState`/`useEffect`, try/catch, renders a `<button>` + `Icon`).
- New `Icon` glyphs — current `IconName` has no `copy`/`github`/`file`. Add what the contactrow needs. → **D5**.

**No gradient/radius tokens exist** (survey: `tokens.css` has color/surface/text/border/accent/maturity/shadow/focus/z but **no `--radius-*` and no gradient token**, despite the registry line). The `Avatar` extraction should reuse the literal `linear-gradient(142deg, var(--color-accent), var(--color-highlight))` or introduce a token — **note in D2**, don't silently hardcode a new value.

**Conventions** (match every existing component): one folder = `Component.tsx` + `Component.module.css` + `index.ts` + colocated `Component.test.tsx`; props via named `interface`; CSS Modules → **semantic tokens only** (design-lint fails on raw hex outside `tokens/`); server component unless it needs state; flip the `REGISTRY.md` row to `built` in the same change.

## 3. Content / data work (do first — the page renders on top of it)

**`src/content/about.ts`** (owned by `content-architect`, tested by `content-tester`) — a typed, validated CV model so content is single-sourced and Phase-2-safe (could later be served from the Spring Boot API without touching the UI). Shape (confirm in D1):

```ts
interface Profile   { name: string; initial: string; role: string; pitch: string; summary: string }
interface JobEntry  { role: string; company?: string; period?: string; detail: string }
interface Contact   { kind: "email" | "github" | "cv"; value: string; label: string }
interface AboutData {
  profile: Profile;
  skills: string[];
  experience: JobEntry[];   // role + company + period + detail
  principles: JobEntry[];   // "How I work" — role + detail only
  contacts: Contact[];
}
```

- **Validation (build-fails-on-bad-data, per PRD §4/§7 ethos):** validate the module against a schema at build (Zod or the project's existing validation approach — match `src/content/`). Required fields missing / empty → throw at build. `content-tester` covers: valid data parses; a missing required field or empty `experience` fails.
- The real content (actual roles, skills, email, GitHub URL, CV asset) is **Leonard's to supply** — the prototype's text is placeholder (see **Open content** below). Ship the module + schema with placeholder-but-real-shape data so the page builds; swap in real content before deploy.
- **`/about` calls zero content-API functions** — it does not list notes or (per the prototype) show garden stats. Confirmed: `screenAbout()` references no `NOTES`/`topicCounts`/`stats`. If Leonard wants a stat line, `stats()` is available (**note**, not planned).

## 4. Components to build

Layered bottom-up; each consumes tokens only and maps to a prototype class.

### Atoms (`src/system-design/atoms/`)

| Component | Maps to | Acceptance |
|---|---|---|
| `Avatar` | `.intro .ava` (46) / `.about-hero .ava` (72) | `initial: string`, `size?: number` (default 46), `aria-hidden`. Gradient square (green→berry), display font, white glyph. **Refactor `Hero` to consume it** (D2) so the extraction has two real call-sites. |
| `Icon` (extend) | contactrow glyphs | Add `IconName` entries needed by the contactrow: `copy`, `github`, and the CV glyph (`file`/`download`). No new component — extend the existing SVG map + union type. (D5) |

### Molecules (`src/system-design/molecules/`)

| Component | Maps to | Acceptance |
|---|---|---|
| `PageHead` | `.pagehead` + `.crumb` + `.pt` + `.sub` | `crumb: { label: string; href?: string }[]` (last item = current, no link), `title: string`, `sub?: string`, `media?: ReactNode` (the `.about-hero` avatar sits beside title via a flex row — `media` + title/sub). Generic → reused by `/notes`, `/topics`, `/topics/[tag]` later. `NotePageHead` stays as-is this PRP (note it *could* later compose `PageHead`; don't refactor it now). (D3) |
| `Panel` | `.panel` + `.panel h3` | `title: string`, `children`. Card shell; title is the **mono uppercase muted label** (the prototype's `.panel h3` is overridden to `JetBrains Mono`, uppercase, `letter-spacing:.06em`, `--text-muted`, 12px — render via `Text variant="mono" size="meta"`, not display). |
| `SkillList` | `.skillset` + `.sk` | `skills: string[]`. Row of non-link `.sk` chips (paper-2 bg, `--border`, mono). Not `Tag` (no href, different surface). |
| `JobEntry` | `.job` | `role`, `company?`, `period?`, `detail`. One component serves both columns: Experience (role+company+period+detail) and How-I-work (role+detail). `period` floats right (mono, muted); bottom border between entries, none on last. |
| `CopyButton` | `.copybtn` (copy variant) | **`"use client"`.** `value: string`, `label: string`, `icon?: IconName`. `navigator.clipboard.writeText` in try/catch; transient "copied ✓" state (revert after ~1.5s); keyboard/focus-visible correct; renders a `<button type="button">`. Graceful when clipboard is unavailable/denied (no throw, no dialog). Pattern = `ThemeToggle`. |

### Organisms (`src/system-design/organisms/`)

| Component | Maps to | Acceptance |
|---|---|---|
| `ContactPanel` | `/about` `.cta` (left-aligned) + `.contactrow` | `contacts: Contact[]`, heading + copy from data. Renders the contactrow: email → `CopyButton`; github → external `Link` styled as `.copybtn`; cv → `CopyButton` (or `Link` if a real asset — D6). Consumes the **shared CTA card shell** (D4). |
| CTA card shell | `.cta` card | Extracted shell shared by `FreelanceCTA` (centered) and `ContactPanel` (left). A small presentational wrapper (molecule or `layouts/`-adjacent) exposing an `align?: "center"\|"start"` + `children`; `FreelanceCTA` refactored to consume it. (D4) |

### Page

`src/app/about/page.tsx` — server component:
- Import `aboutData` from `src/content/about.ts`.
- `export const metadata` (or `generateMetadata`) → title `"About — Leonard"`, description = `profile.pitch`. Full OpenGraph/sitemap/RSS stays **out of scope** (later SEO PRP, consistent with the note-detail plan).
- Compose: `Container width="wide"` → `PageHead` (crumb `garden / about`, `media={<Avatar initial size={72}/>}`, title=name, sub=pitch) → `Panel "What I do well"` (summary + `SkillList`) → two-column grid of `Panel "Experience"` (`experience.map(JobEntry)`) + `Panel "How I work"` (`principles.map(JobEntry)`), collapsing ≤620px → `ContactPanel`.
- Static route — **no** `generateStaticParams` (not dynamic), **no** `notFound`.

## 5. Decisions (confirm before build)

- **D1 — CV content source [recommend: typed data module].** Put all CV content in `src/content/about.ts` (typed + schema-validated), not inline JSX and not MDX. Rationale: single-sourced, build-fails-on-bad-data like the rest of the content layer, and Phase-2-safe (same shape could later come from an API). *(Alt: inline JSX — scatters content, no validation; MDX — overkill for structured records, not prose.)*
- **D2 — Avatar extraction [recommend: extract atom, refactor Hero].** Extract `Avatar` from `Hero` and have both Hero (46px) and about-hero (72px) consume it. Reuse the literal green→berry gradient, **or** add a `--gradient-avatar` token if we want it single-sourced (lean: keep the literal in the atom's CSS for now — one place — and note a token as a later cleanup). *(Alt: inline a second copy on `/about` — violates the reuse contract.)*
- **D3 — Generic `PageHead` [recommend: build generic].** Build `PageHead` (crumb + title + sub + `media` slot) now, reused by `/about` and the four later list routes. Leave `NotePageHead` untouched this PRP. *(Alt: about-specific head — throwaway; four routes still need one.)*
- **D4 — CTA card shell [recommend: extract shared shell].** Extract the `.cta` card shell so `FreelanceCTA` and the new `ContactPanel` share it (`align` prop). *(Alt: duplicate the shell in `ContactPanel` — two sources for one look.)* Confirm shell lives as a molecule vs a `FreelanceCTA` variant with slots.
- **D5 — Copy island + icons [recommend: `CopyButton` client molecule + 3 new icons].** One `"use client"` `CopyButton`; extend `IconName` with `copy`, `github`, `file`/`download` (the prototype inlines these SVGs — port them into the `Icon` map). Everything else on the page stays server-rendered. Confirm the glyph set + that GitHub is a plain external `Link` (not a copy action).
- **D6 — CV download [CONFIRMED: copy-link placeholder].** Render the CV contact as a `CopyButton` of a placeholder URL, matching the prototype, until a real PDF + domain exist. Swap to a direct-download `Link` (with `public/cv.pdf`) in a later pass.
- **D7 — Coral-button fidelity [note, mostly out of scope].** The prototype's primary `.btn` is **coral**; the already-built `FreelanceCTA`/`Button variant="accent"` renders **green** (`--color-accent`). `/about`'s contact buttons are `.copybtn` (ghost-ish), so **no coral button is needed here**. Flagging the pre-existing home mismatch for a separate fix, not this PRP.

## 6. Validation gates (definition of done)

1. **Tests (`content-tester`, RED→GREEN where logic exists):** `about.ts` schema validation (valid parses; missing required field / empty `experience` fails the build); `CopyButton` (copies `value`; shows then clears the "copied" state; does not throw when `navigator.clipboard` is absent or rejects). Render tests for `Panel`, `JobEntry`, `SkillList`, `PageHead`, `ContactPanel` (PRD §7 wants main components render-tested).
2. `npx tsc --noEmit` clean (also runs via the edit hook).
3. Prettier + **design-lint** pass on every changed file — **no raw hex outside `tokens/`** (watch the avatar gradient and any new `.sk`/`.copybtn`/`.panel` colors).
4. `npm run build` succeeds; `/about` present in the static output; **no internal dead links** (crumb → `/`; the only off-site targets are the external GitHub link + `mailto`/copy values, which are not internal links).
5. `nextjs-reviewer` pass on the diff — App Router (static route, `metadata`), a11y (the copy `<button>`, `aria-hidden` avatar, contrast of `.sk`/`.copybtn` in both themes), and prototype fidelity. CRITICAL/HIGH addressed before merge (separate lane; **no self-approval**).
6. **Visual check vs prototype in both themes**, desktop (two-column CV grid + about-hero row) and mobile (≤620px → CV grid 1 column; about-hero wraps). Copy buttons show the copied state.
7. `REGISTRY.md` updated: `Avatar`, `PageHead`, `Panel`, `SkillList`, `JobEntry`, `CopyButton`, `ContactPanel` (+ CTA shell) flipped `planned/new → built`; `FreelanceCTA` + `Hero` rows annotated as refactored to consume the shared shell / `Avatar`.
8. **Recorded evidence for Leonard (required, not optional — memory: _always-manual-test-and-record_):** `npm run dev`, open `/about`, **record a GIF** (claude-in-chrome `gif_creator`) showing it actually runs — scroll the page, the two-column CV collapsing to one column at ≤620px, the theme toggle in **light and dark**, and a **copy button copying** (visible "copied" state). Save with a meaningful name and **send Leonard the recording**. This comes **after** the `nextjs-reviewer` pass (gate 5), not instead of it.

## 7. Open content (Leonard to supply before deploy)

Placeholder shape ships so the build is green; real content swaps into `src/content/about.ts`:
- Real **experience** entries (roles, companies/context, periods, one-line outcomes) and **"How I work"** principles.
- **Skills** list (the chips).
- **Contact**: real email, GitHub URL, and the **CV decision (D6)** — PDF asset or placeholder link.
- Confirm the **name/initial/pitch** wording for the hero (prototype uses "Leonard" + the boring-under-load pitch).

*(This mirrors PRD §9's open "initial content" item — content prep runs in parallel with the build.)*

## 8. Out of scope

`/notes` list + filter/author view; `/topics`, `/topics/[tag]`; the full SEO surface (OpenGraph images, `sitemap.xml`, RSS — later PRP); any garden-stats block on `/about` unless Leonard asks (D-note); fixing the pre-existing green-vs-coral `Button` mismatch (D7); a `--radius-*`/gradient token sweep. `PageHead`, `Avatar`, the CTA shell, `Panel`, `JobEntry`, and `SkillList` are built **general** so the later list routes reuse them.

## 9. Task list (execution order)

1. **Data layer** (`content-architect` + `content-tester`): `src/content/about.ts` + schema + validation; tests RED→GREEN. Verify `npm run build`/content step fails on bad data.
2. **Atoms** (`ui-builder`): extract `Avatar` (+ refactor `Hero` to use it); extend `Icon` with `copy`/`github`/`file` (D2/D5).
3. **Molecules** (`ui-builder`): `PageHead`, `Panel`, `SkillList`, `JobEntry`, `CopyButton` (client) — each with colocated render/interaction tests + `index.ts` + registry row (D3/D5).
4. **Organisms** (`ui-builder`): extract the shared **CTA card shell**, refactor `FreelanceCTA` onto it, build `ContactPanel` (D4).
5. **Page** (`ui-builder`): `src/app/about/page.tsx` + `metadata`.
6. **Gates §6:** typecheck → prettier/design-lint → `npm run build` + dead-link check → `nextjs-reviewer` → visual check (both themes, both widths) → update `REGISTRY.md`.
7. **Record evidence (gate §6.8):** `npm run dev`, drive `/about` in the browser, record the GIF (light + dark, desktop + ≤620px collapse, a copy button copying), save with a meaningful name, and **send Leonard the recording** before calling the work done.
8. Branch `feat/about` off `main`; Conventional Commits; `/pr` (no AI attribution per `git-flow`).

## 10. Agent orchestration graph

Agents from `.claude/agents/`. CLAUDE.md rule: authoring and review are **separate lanes** — authors never approve their own work; `nextjs-reviewer` is read-only and runs as a distinct pass.

| Agent | Role | Lane | When |
|---|---|---|---|
| `content-architect` | Design `about.ts` shape + schema; confirm Avatar/PageHead/CTA-shell extraction boundaries (D1–D4) | author | Phase A |
| `content-tester` | Tests for `about.ts` validation + `CopyButton` behavior (RED→GREEN) | author/test | Phase A (paired) |
| `ui-builder` | `Avatar` + Icon, molecules, CTA-shell + `ContactPanel`, the page; refactor `Hero`/`FreelanceCTA` | author | Phases B–D, + fixes |
| `nextjs-reviewer` | Reviews the TS/Next diff — static route/metadata, a11y, prototype fidelity (read-only) | review | after Phase D |
| `/verify-build` (command) | content/schema + `tsc` + `next build` + dead-link check | gate | after Phase D |

**Dependency flow** (layers import only from below; the data layer gates nothing UI-shaped but the schema must be green first):

```
Phase A  content-architect: about.ts + schema      ◀──RED/GREEN──▶  content-tester: schema + CopyButton tests   (PARALLEL pair)
                                    │  (data shape frozen + validates)
Phase B  ui-builder:  Avatar (+refactor Hero) · Icon glyphs
                                    │
Phase C  ui-builder:  PageHead · Panel · SkillList · JobEntry · CopyButton   (independent siblings)
                                    │
Phase D  ui-builder:  CTA shell (+refactor FreelanceCTA) · ContactPanel → app/about/page.tsx
                                    │  (code complete)
        ┌───────────────────────────┴───────────────────────────┐
        ▼ gate (parallel)                               ▼ review lane
   /verify-build: content + tsc + build + dead links   nextjs-reviewer: severity-rated findings
        └───────────────────────────┬───────────────────────────┘
                                    ▼
                    fixes (ui-builder) ⇄ re-review   until clean + approved
                                    ▼
         ui-builder: npm run dev → drive /about in browser → record GIF
         (light+dark · desktop + ≤620px collapse · copy button copying)
                   → SEND LEONARD THE RECORDING   (gate §6.8, required)
                                    ▼
                 update REGISTRY.md → branch feat/about → /pr
```

**Parallelism:** two points — (1) the Phase A data work ↔ its tests (author/tester pair); (2) after Phase D, `/verify-build` (mechanical) and `nextjs-reviewer` (judgment) run concurrently. Phase C's molecules are independent but small, so one focused `ui-builder` pass beats fanning out.

---
**Review checkpoint:** D1 (build now, placeholder content) and D6 (copy-link placeholder) **confirmed 2026-11-28**; D2–D5 stand as recommended unless you object; D7 is a flagged out-of-scope note; §7 real content swaps in before deploy. Give the go-ahead and implementation proceeds from Phase A — **no code until then**.

---
name: nextjs-garden
description: Project conventions for Leonard's Garden — Next.js App Router structure, MDX rendering, routes, and the SEO surface (metadata, OpenGraph, sitemap, RSS). Read before scaffolding the app, adding routes, or wiring MDX and SEO.
---

# Next.js garden — app conventions

Next.js **App Router** + TypeScript, static-generated, deployed to Vercel. No backend, auth, or database in Phase 1.

## Routes (PRD §5)

| Route | Content |
|---|---|
| `/` | hero, "What's growing", aside note excerpt, topics, stats, freelance CTA |
| `/notes` | all notes; filter by maturity + topic |
| `/notes/[slug]` | note body (MDX), meta (maturity/confidence/dates), citations, backlinks — 2-col + rail |
| `/topics` | topics with counts |
| `/topics/[tag]` | notes in one topic |
| `/about` | profile + CV + freelance contact (the HR landing) |

Use `generateStaticParams` for `[slug]` and `[tag]`. Keep static content in server components; only interactive bits (theme toggle, filters) are client components.

## MDX

- Render MDX with code blocks syntax-highlighted.
- Support `[[wiki-link]]` → internal links, feeding the backlink graph (see the `content-model` skill).
- Content layer: **Velite** or **Content Collections** — decide in planning (PRD §9). Either way, output is type-safe and validated at build time.

## SEO surface (PRD §6)

- Per-page `metadata` (title, description) + OpenGraph for nice shares.
- `sitemap.xml` and an RSS feed. Both exclude drafts.
- Good Lighthouse scores (Performance / SEO / Accessibility) before deploy.

## Definition of done (PRD §7–8)

- `next build` passes; no internal dead links.
- Content-layer logic tested, ≥80% coverage.
- Home page matches the mockup, dark mode works.
- Adding one `.mdx` file updates lists / topics / backlinks automatically.

## Phase-2 seam

Phase 2 adds an authenticated area (JWT) + Spring Boot + PostgreSQL for private, DB-stored notes. App Router makes adding routes/APIs later easy — don't couple the public build-time content layer to anything that would block that.

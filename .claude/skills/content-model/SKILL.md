---
name: content-model
description: The content model for Leonard's Garden — frontmatter schema, maturity levels, [[wiki-link]] backlinks, topic derivation, and draft rules. Read before building, testing, or changing anything in the content layer (parsing, validation, derivation, or note authoring).
---

# Content model — the heart of the garden

A note is one `.mdx` file with YAML frontmatter. The build reads all notes into type-safe data and derives lists, topics, and backlinks. Adding a note must require nothing beyond creating the file.

## Frontmatter schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | |
| `slug` | string | no | defaults to the filename |
| `maturity` | `seedling` \| `budding` \| `evergreen` | yes | growth stage |
| `topics` | string[] | yes | may be empty `[]` |
| `planted` | date (`YYYY-MM-DD`) | yes | created date |
| `tended` | date (`YYYY-MM-DD`) | yes | last updated |
| `confidence` | `low` \| `medium` \| `high` | yes | |
| `citations` | string[] (URLs) | no | supports the "100% cited" goal |
| `draft` | boolean | no | default `false`; `true` hides from public |

### Example

```yaml
---
title: "Monolith → microservices: the patterns that held up"
slug: monolith-to-microservices
maturity: evergreen
topics: [architecture, microservices]
planted: 2026-08-01
tended: 2026-11-15
confidence: high
citations:
  - "https://example.com/source"
draft: false
---
```

## Validation rule (hard requirement)

Frontmatter is validated against the schema at build time. The build **fails** when a required field is missing or when `maturity` / `confidence` holds a value outside its enum. Errors must name the file and the offending field. Never let bad data through silently.

## Derivation rules (build-time)

- **Maturity** → label + sprout icon (🌱 seedling → budding → evergreen) on every note.
- **Backlinks** → `[[wiki-link]]` inside MDX bodies builds a bidirectional graph: each note knows what it *links to* and what *links from* it. Resolve targets by slug. An unresolved link is a reported warning, not a silent drop.
- **Topics** → aggregate every note's `topics[]` into `/topics` and `/topics/[tag]`, each with a count.
- **Draft** → `draft: true` is excluded from **all** public surfaces: note lists, topic pages, backlink graph, `sitemap.xml`, and RSS.

## Invariants to protect

- Slug / note identity is stable — Phase 2 (DB-backed private notes) will rely on it.
- The public content layer is a pure build-time read: no runtime DB, no auth. Keep it that way so Phase 2 can be *added* beside it, not retrofitted into it.

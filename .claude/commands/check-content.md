---
description: Validate all notes — frontmatter schema, backlinks, and internal links.
---

Audit every `.mdx` note against the content model (see the `content-model` skill). Report, don't fix (unless I ask).

Check and report:

1. **Frontmatter schema** — for each note, confirm all required fields are present and `maturity` / `confidence` hold valid enum values. List every violation as `file: field: problem`.
2. **Dates** — `planted` and `tended` parse as valid dates; `tended` is not before `planted`.
3. **Backlinks** — every `[[wiki-link]]` resolves to an existing, non-draft note. List unresolved links.
4. **Drafts** — confirm `draft: true` notes do not leak into any public collection, sitemap, or RSS output (inspect the build output or the content-layer data).
5. **Topics** — report the topic list with counts so stray/duplicate topics are easy to spot.

Finish with a short pass/fail summary. If the content layer or build tooling isn't set up yet, say so instead of guessing.

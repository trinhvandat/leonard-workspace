---
description: Scaffold a new .mdx note with valid, schema-complete frontmatter.
argument-hint: "<note title>"
---

Create a new digital-garden note from the title: **$ARGUMENTS**

Follow the `content-model` skill for the schema. Steps:

1. Derive a kebab-case `slug` from the title.
2. Pick the notes content directory used by this project (e.g. `content/notes/` — match whatever the content layer is configured to read). If none exists yet, ask before inventing a location.
3. Create `<slug>.mdx` with complete, valid frontmatter:
   - `title` = the given title
   - `maturity: seedling` (new notes start as seedlings)
   - `topics: []` (leave for the author to fill)
   - `planted` and `tended` = today's date
   - `confidence: low`
   - `draft: true` (new notes start hidden until ready)
4. Add a short MDX body stub with a heading and a TODO.
5. Remind the author to set real `topics`, raise `maturity`/`confidence` when ready, and flip `draft: false` to publish.

Do not fabricate citations or dates. If a note with that slug already exists, stop and report it.

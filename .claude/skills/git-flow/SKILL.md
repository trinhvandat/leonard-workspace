---
name: git-flow
description: Git workflow for Leonard's Garden — trunk-based development, branch naming, Conventional Commits, and the PR process. Read before creating a branch, writing a commit, or opening a pull request.
---

# Git flow — trunk-based

`main` is the trunk and is **always releasable**: every merge to `main` deploys to Vercel. Work on short-lived branches, keep them small, merge often. Avoid long-running feature branches — they drift from trunk and make the deploy risky.

## Branches

- Branch off the latest `main`.
- One branch = one focused change. Aim to merge within a day or two; rebase on `main` rather than let it age.
- Delete the branch after merge.

### Naming

```
<type>/<short-kebab-description>
```

`<type>` is the same set as commit types (below). Keep it short and specific; optionally prefix an issue number.

- `feat/note-backlinks`
- `fix/draft-leak-in-sitemap`
- `chore/add-prettier`
- `feat/42-topic-filter` (with issue #42)

## Commits — Conventional Commits

```
<type>(optional-scope): <description>

<optional body — the why, not the what>
<optional footer — BREAKING CHANGE:, Closes #42>
```

- **Types:** `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.
- Description: imperative mood, lowercase, no trailing period (`add topic filter`, not `Added topic filter.`).
- One logical change per commit; keep them atomic so history is bisectable.
- Scope is optional but handy: `feat(content): validate frontmatter at build`.

No AI attribution lines in commits or PRs — this repo keeps authorship clean (matches the global convention).

### Examples

```
feat(content): derive bidirectional backlinks from [[wiki-link]]
fix(seo): exclude drafts from sitemap.xml
test(content): reject invalid maturity enum
chore: configure Velite content layer
```

## Pull requests

- Open a PR into `main`; fill the template at `.github/pull_request_template.md`.
- **Squash merge** to keep the trunk history linear and each merge atomic.
- Keep PRs small and single-purpose — easier to review, safer to deploy.
- Before requesting review, run the definition-of-done gate (`/verify-build`): typecheck, content tests, `next build`, no dead links, no draft leakage.
- Draft the summary from the **full** commit history on the branch, not just the last commit (`git diff main...HEAD`).
- Include a test plan. Link the issue it closes.

## Releasing

Merge to `main` → Vercel builds and deploys. There is no separate release branch in Phase 1; trunk *is* the release line. If a deploy breaks, revert the merge commit on `main` to roll back, then fix forward.

---
description: Run the Phase-1 "definition of done" gate before deploy or PR.
---

Run the project's definition-of-done gate (PRD §7–8) and report real evidence for each step — never claim a pass without showing the command output.

Run in order and stop at the first hard failure:

1. **Typecheck** — `tsc --noEmit` (or the project's typecheck script). Must be clean.
2. **Content tests** — the content-layer test suite with coverage. Report the coverage number; content-layer logic target is ≥80%.
3. **Build** — `next build`. Must succeed with no errors.
4. **Internal links** — confirm no internal dead links (build output or link check).
5. **Content audit** — run the `/check-content` checks; frontmatter all valid, backlinks all resolve, no draft leakage.
6. **Quality (pre-deploy)** — remind me to run Lighthouse (Performance / SEO / Accessibility) and confirm the home page matches the mockup with working dark mode.

Report each step as PASS/FAIL with the evidence. If any step fails, summarize what's broken and stop — do not report overall success. If the toolchain isn't installed yet, say which steps could not run.

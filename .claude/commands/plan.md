---
description: Produce a PRP (Product Requirement Prompt) for a feature — an executable plan with validation gates — then stop for review. Does not implement.
argument-hint: "[feature or change to plan, e.g. 'topic index page']"
---

Turn a request into a **PRP** (Product Requirement Prompt = PRD slice + codebase intelligence + runbook) written to `docs/plans/`. A good plan here is not prose — it carries **executable validation gates** a later executor can run and fix against. This command **plans only**: it never writes app code and never self-approves. The person reviews the PRP before any implementation.

Feature to plan: $ARGUMENTS

## Run in order

1. **SCOPE.** Read `docs/PRD.md` (source of truth for scope) and skim `CLAUDE.md`. If the request is ambiguous or spans Phase-2 territory (auth/backend/DB), ask 1–3 sharp questions first; otherwise proceed. Never design anything that blocks adding routes/APIs later.

2. **RESEARCH — fan out, read-only, in parallel.** Dispatch independent lanes in a single message so they run concurrently. They must not overlap in files. Typical split:
   - **Content lane → `content-architect`**: schema/frontmatter, `[[wiki-link]]` backlinks, topic derivation, draft rules, Phase-2-safe structural choices. Must consult the `content-model` skill.
   - **UI lane → `Explore` (or read the `design-system` skill directly)**: which tokens/components the feature needs, reuse-first via `system-design/REGISTRY.md`, dark-mode + responsive implications, prototype as source of truth.
   - Add a third lane only for a genuinely separate concern (e.g. SEO surface via the `nextjs-garden` skill). Skip a lane the feature doesn't touch.

3. **SYNTHESIZE.** As orchestrator, merge the lanes into one PRP — resolve conflicts, do not paste raw agent output. Keep it a vertical slice.

4. **WRITE THE PRP** to `docs/plans/<yyyy-mm-dd>-<kebab-slug>.md` with these sections:
   - `## Goal` — the vertical slice and the concrete "done" criteria.
   - `## Context` — exact file paths to touch, skills to read (`content-model`, `design-system`, `nextjs-garden`), and the Phase-2-safe constraints that apply.
   - `## Design` — schema/route/component decisions. **Reuse-first:** name the existing `system-design/` atoms/molecules to extend; justify any new component (nothing covers ~70%+).
   - `## Tasks` — a table: `# · description · parallel? · depends-on · agent`. Mark which tasks may run in parallel (must not touch the same files) and which are sequential.
   - `## Validation Gates` — runnable commands the executor must pass: `/check-content`, `/verify-build`, a `nextjs-reviewer` pass, and ≥80% coverage on any new content-layer logic (`content-tester`, tests-first). List them as a checklist.
   - `## Risks / Out-of-scope` — what this slice deliberately excludes, and known risks.

5. **STOP.** Print the PRP path and a 3–5 line summary (goal + task count + gates). Do **not** branch, write app code, or implement. Hand back for review — implementation is a separate pass that follows the harness workflow (`branch → tests-first → implement → nextjs-reviewer → /verify-build → /pr`).

If `docs/plans/` doesn't exist, create it. If `docs/PRD.md` is missing, say so and plan from the request + `CLAUDE.md` alone, flagging the gap.

---
description: Reconcile a new or updated prototype artifact into tokens → components → pages, top-down.
argument-hint: "[artifact URL or 'prototype changed']"
---

Reconcile the UI with a new or changed design, **without hand-patching scattered files**. The prototype artifact is the source of truth; `system-design/` is how the codebase consumes it. Read the `design-system` skill (the consumption contract) first — this command executes that skill's reconciliation flow.

Source to reconcile from: $ARGUMENTS (an artifact URL, or the existing prototype linked at the top of `docs/PRD.md` if none given).

## Run in order

1. **FETCH.** Read the artifact with the Artifact `read` action — it is a `claude.ai/artifact/...` link, so **never** web-fetch it. Pull out: color/spacing/radius/font values, screens, and the UI blocks each screen is built from. If the source is "prototype changed," re-read the linked prototype.

2. **DIFF.** Compare what you fetched against the current code:
   - **Tokens** — fetched values vs `system-design/tokens/`.
   - **Components** — fetched UI blocks vs the component REGISTRY (`system-design/REGISTRY.md`); fall back to scanning `system-design/` if the registry is absent.

3. **CLASSIFY** each change by blast radius (smallest first — prefer the cheapest layer that can own it):
   - **(a) token value** (color/space/font changed) → edit the token only; components inherit it. *Most updates are this.*
   - **(b) component variant** → add a prop/variant to the existing component; do not fork.
   - **(c) new atom/molecule/organism** → only when nothing covers ~70%+; place in the right layer with a test.
   - **(d) layout change** → edit `system-design/layouts/`.
   - **(e) page composition change** → edit the `app/` page (data + assembly only).

4. **APPLY top-down along the chain:** `tokens → atoms → molecules → organisms → pages`. Lower layers must be stable before the layers that consume them change. Delegate the actual edits to `ui-builder`.

5. **UPDATE THE RECORD.** Bring the `design-system` skill's token tables and `system-design/REGISTRY.md` back in sync with what you applied. When the prototype and the skill disagree, the prototype wins — update the skill to match.

6. **VERIFY.** `ui-builder` confirms it builds; `nextjs-reviewer` reviews; visually diff against the artifact; run `/verify-build`. Report each change made, its classification (a–e), and the files touched. Do not self-approve — review is a separate pass.

If the toolchain or `system-design/` doesn't exist yet, say so and produce the reconciliation plan (the classified change list) instead of editing.

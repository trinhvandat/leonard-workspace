---
description: Open a trunk-based pull request into main using the repo template.
---

Create a pull request for the current branch into `main`, following the `git-flow` skill.

Steps:

1. Confirm the branch is not `main` and is pushed (`git push -u origin HEAD` if needed).
2. Review the **full** branch history, not just the last commit: `git diff main...HEAD` and `git log main..HEAD`.
3. Fill `.github/pull_request_template.md`:
   - **Summary** from the whole diff — what changed and why.
   - Tick the correct **type of change**.
   - Complete the **content impact** checklist if notes / content layer changed.
   - Write a real **test plan** with the commands you ran and their results. Do not tick a box you didn't verify.
4. Before opening, run `/verify-build` and include the outcome in the test plan.
5. Open the PR with `gh pr create`, base `main`, using the filled template as the body. Link the issue it closes.

Keep the PR small and single-purpose; it will be squash-merged. No AI attribution lines in the title or body.

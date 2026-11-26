#!/usr/bin/env bash
# PostToolUse hook: format + typecheck edited TS/MDX files.
# Reads the tool-call JSON on stdin, extracts the edited file path, and
# runs Prettier on it plus a project typecheck. No-ops safely when the
# toolchain (package.json / prettier / tsc) isn't present yet, so the
# harness is portable to a fresh clone.

set -euo pipefail

input="$(cat)"

# Extract the edited file path from the hook payload using node (always
# available in a Next.js project). Fall back to empty on any error.
file="$(printf '%s' "$input" | node -e '
  let s = "";
  process.stdin.on("data", d => s += d);
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(s);
      const ti = j.tool_input || {};
      process.stdout.write(ti.file_path || ti.path || "");
    } catch { process.stdout.write(""); }
  });
' 2>/dev/null || true)"

# Nothing to do without a path or a relevant extension.
[ -n "$file" ] || exit 0
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.mdx|*.md|*.css) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

# design-lint: enforce the design-system consumption contract (no hardcoded
# colors). Component CSS must consume semantic tokens — raw hex belongs only in
# the token files under a `tokens/` directory. Runs before the toolchain gate
# below because it needs only grep. Scoped to UI layers to avoid noise; surfaces
# to Claude as feedback (exit 2) without blocking the edit.
case "$file" in
  *.css)
    case "$file" in
      */tokens/*) ;;                 # token files are where raw values live — skip
      *system-design/*|*/app/*)
        if hits="$(grep -nE '#[0-9a-fA-F]{3,8}\b' "$file" 2>/dev/null)"; then
          {
            echo "design-lint: hardcoded color in $file — consume a semantic token (var(--...)) instead."
            echo "The design-system consumption contract forbids raw hex outside tokens/. Offending lines:"
            printf '%s\n' "$hits"
          } >&2
          exit 2
        fi
        ;;
    esac
    ;;
esac

# Locate the project root (nearest package.json up from the file).
dir="$(cd "$(dirname "$file")" && pwd)"
root=""
while [ "$dir" != "/" ]; do
  if [ -f "$dir/package.json" ]; then root="$dir"; break; fi
  dir="$(dirname "$dir")"
done
[ -n "$root" ] || exit 0   # no package.json yet → nothing installed, skip
cd "$root"

# Format the single edited file if Prettier is available. Never fail the edit.
if npx --no-install prettier --version >/dev/null 2>&1; then
  npx --no-install prettier --write "$file" >/dev/null 2>&1 || true
fi

# Typecheck the project for TS edits, if a TS toolchain is available.
case "$file" in
  *.ts|*.tsx)
    if [ -f "$root/tsconfig.json" ] && npx --no-install tsc --version >/dev/null 2>&1; then
      if ! npx --no-install tsc --noEmit >/tmp/omc-tsc.log 2>&1; then
        echo "typecheck failed after editing $file:" >&2
        tail -n 20 /tmp/omc-tsc.log >&2
        # Surface to Claude as feedback without blocking the edit.
        exit 2
      fi
    fi
    ;;
esac

exit 0

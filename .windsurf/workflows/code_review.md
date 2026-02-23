---
auto_execution_mode: 0
description: "Bundle-first code review using Codex CLI (outside Windsurf)"
---
# Workflow: /code_review (Bundle + Codex CLI)

Goal: Produce a deterministic review from a snapshot of STAGED changes.
Inputs: intent + staged diff + evidence (CI output).
Output: a markdown review file you can feed back to the implementer.

## Step 0 — Stage the exact changes to review (local only)
```bash
git status

# Stage intentionally. Use -A only if you truly want everything reviewed.
git add -A

git status
git diff --staged --name-only
```

## Steps 1–5 — Bundle + CI + Codex review (run in one shell)
This generates an immutable review file:

`docs/code-reviews/session-YYYY-MM-DD_HHMMSS.md`

```bash
bash -euo pipefail <<'BASH'
REPO_ROOT=$(git rev-parse --show-toplevel)
REVIEW_DIR="${REPO_ROOT}/docs/code-reviews"

TS=$(date -u +"%Y%m%d-%H%M%S")
BUNDLE_DIR="${REPO_ROOT}/bundles/${TS}"

mkdir -p "${BUNDLE_DIR}"
echo "Created ${BUNDLE_DIR}"

# intent.md (required)
cat > "${BUNDLE_DIR}/intent.md" <<'EOF'
# Intent

## Why
- 

## What changed
- 

## Risks / Tradeoffs
- 

## Rollback plan
- 
EOF

# diff.patch (authoritative staged change)
git diff --staged > "${BUNDLE_DIR}/diff.patch"

# status.txt
{
  echo "# git status";
  git status;
  echo "";
  echo "# staged files";
  git diff --staged --name-only;
} > "${BUNDLE_DIR}/status.txt"

# ci.txt (evidence)
CI_EXIT=0
set +e
make ci 2>&1 | tee "${BUNDLE_DIR}/ci.txt"
CI_EXIT=${PIPESTATUS[0]}
set -e

mkdir -p "${REVIEW_DIR}"

REVIEW_FILE="${REVIEW_DIR}/session-$(date -u +%F_%H%M%S).md"
if [ -e "${REVIEW_FILE}" ]; then
  echo "ERROR: Review file already exists: ${REVIEW_FILE}"
  echo "Refusing to overwrite; create a new file or move the existing one."
  exit 1
fi

codex exec \
  --cd "${BUNDLE_DIR}" \
  --add-dir "${REVIEW_DIR}" \
  -c 'sandbox_permissions=["disk-read-only"]' \
  -c 'approval_policy="never"' \
  - > "${REVIEW_FILE}" <<'PROMPT'
You are the Review Agent. You MUST review ONLY the files present in this bundle directory:

- intent.md
- diff.patch
- status.txt
- ci.txt

Do NOT edit code. Do NOT propose applying patches. Do NOT read any files outside the bundle.

Write a new markdown review with EXACTLY this structure:

## Blockers (Must Fix)
## Should Fix
## Nice to Have
## Tests / Coverage Notes
## Security Notes
## Hermetic Compliance Notes

Be concise and action-oriented. If there are no blockers, write "Blockers (Must Fix): 0" and proceed.
PROMPT

echo "Wrote review to ${REVIEW_FILE}"

if [ "${CI_EXIT}" -ne 0 ]; then
  echo "WARNING: make ci failed with exit code ${CI_EXIT}. Review still generated."
  exit "${CI_EXIT}"
fi
BASH
```

## Step 6 — Loop behavior (controlled)
If the review contains blockers:

- Fix issues
- Re-stage changes
- Generate a NEW bundle
- Re-run `/code_review`

Guardrails:

- Max 3 loops
- Only modify files that are already staged
- Protected paths still require human approval

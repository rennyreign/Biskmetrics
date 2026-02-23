---
auto_execution_mode: 0
description: "End of session summary and continuity tracking"
---
# Workflow: End of Session

Use this workflow at the end of each work session to ensure continuity.

## Step 1 — Update Plan Tracker
- Review `plan/plan.md`
- Mark completed items with [x]
- Update "Current Status" section
- Add any new tasks discovered
- Update "Recent Completions" section

## Step 2 — Create Session Summary
- Update `plan/end-of-session.md` with:
  - What was accomplished this session
  - Current state and phase
  - Key decisions made
  - Blockers (if any)
  - Immediate next actions for next session
  - Context needed for continuity

## Step 3 — Document Key Learnings
- Note any architectural decisions (consider ADR if significant)
- Document any deviations from original plan
- Capture any technical debt or future refactors needed
- Note any questions or uncertainties to address

## Step 3.5 — AI Code Review (if code was written)

**If code was written this session:**
- Run `/code_review` (bundle-first)
- Ensure **Blockers (Must Fix) = 0** before proceeding
- Address any blockers and re-run `/code_review` as needed
- Record the review summary + metrics in the session summary

**If no code was written:**
- Skip this step

## Step 4 — Verify Clean State
- Ensure all changes are committed (if appropriate)
- Check for any uncommitted work that needs attention
- Verify no hanging processes or resources
- Confirm tests are passing (if code was written)

## Step 5 — Set Next Session Context
- Clearly state the starting point for next session
- List specific files or components to focus on
- Highlight any dependencies or prerequisites
- Note any external factors (waiting on decisions, etc.)

---

**Goal**: Next session should start with zero ambiguity about where we are and what to do next.

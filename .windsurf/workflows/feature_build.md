---
auto_execution_mode: 0
description: ""
---
# Workflow: Build a Feature (Hermetic)

You are operating under the Hermetic Software Engineering Standards (v2).

## Step 1 — Clarify
- Ask clarifying questions ONLY if requirements are ambiguous.
- If clear, state: “Requirements understood.”

## Step 2 — Architecture Plan
Provide:
- Components and boundaries
- Data flow
- Integration points
- Any ADR required (yes/no)

## Step 3 — Dependency Declaration
List:
- New packages
- External services
- APIs
State: “No new dependencies” if none.

## Step 4 — File Touch List
Explicitly list:
- Files to create
- Files to modify
- Files to delete

Do NOT write code yet.

## Step 5 — Risk Notes
Call out:
- Security implications
- Data migrations
- Breaking changes
- Performance concerns

## Step 6 — Implementation
- Write code and tests together
- Follow repo conventions
- Keep functions small and typed

## Step 7 — Verification
Run and paste output for:
- Lint
- Typecheck (if applicable)
- Tests

## Step 8 — Documentation
Update as required:
- README
- OpenAPI
- CHANGELOG
- ADRs

## Step 9 — Deployment Readiness
State clearly:
- Ready / Not Ready
- Remaining gaps
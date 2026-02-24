# Intent

## Why
- Second code review identified 2 new blockers after initial fixes
- addMetric was writing to state but custom metrics weren't appearing in UI
- Math.random() made scorecard output nondeterministic across rerenders

## What changed
- Modified metrics useMemo to merge base metrics AND custom metrics from metricsState
- Custom metrics now filtered by pipeline and appended to visible array
- Replaced Math.random() with deterministic ID-based hash for streaks
- Streaks now consistent across rerenders but still varied per metric

## Risks / Tradeoffs
- ID hash approach is simple but not cryptographically secure (fine for mock data)
- Custom metrics appended to end of list (not sorted by sortOrder within category)
- Mitigation: Low risk for Phase 1 mock data, can enhance sorting later

## Rollback plan
- Revert commits to restore previous behavior
- Custom metrics visibility fix is safe and necessary
- Deterministic streaks fix is safe and improves UX stability

# Intent

## Why
- Code review identified 2 blockers that needed immediate fixing
- EditMetricDialog had state sync bug causing stale/incorrect values
- AddMetric was a no-op, not actually adding metrics to state

## What changed
- Added useEffect to EditMetricDialog to resync form state when metric prop changes
- Added addMetric function to useScorecardData hook
- Implemented handleAddMetric to generate id/sortOrder and call addMetric
- Removed unused Button import from ScorecardPage (bonus fix)

## Risks / Tradeoffs
- useEffect dependency on metric object could cause extra rerenders if metric reference changes unnecessarily
- Generated IDs use timestamp which could theoretically collide if two metrics added in same millisecond
- Mitigation: Low risk in practice for single-user scorecard editing

## Rollback plan
- Revert commits to restore previous behavior
- EditMetricDialog state sync is safe to keep (fixes bug)
- AddMetric functionality is new, safe to revert if issues arise

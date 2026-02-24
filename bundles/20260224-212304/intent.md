# Intent

## Why
- Third code review identified final blocker: status recalculation didn't update streaks/IDS flags
- Could produce contradictory state (green status with red IDS flag)
- Need all derived fields to stay consistent after target edits

## What changed
- Extended status recalculation block to also recalculate greenStreak, redStreak, and idsFlagged
- All derived fields now computed together using same ID hash approach
- Ensures consistent state: status, streaks, and IDS flag all reflect current target

## Risks / Tradeoffs
- Minimal risk - just extending existing recalculation logic
- Uses same deterministic ID hash for streaks as calculateMetricData
- No breaking changes, purely additive consistency fix

## Rollback plan
- Revert commit to restore previous behavior
- Fix is safe and necessary for data consistency
- No user-facing behavior changes except fixing the bug

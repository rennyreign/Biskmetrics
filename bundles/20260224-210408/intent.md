# Intent

## Why
- Investment Insights panel showed misleading 5-factor methodology that wasn't actually implemented
- Graph View was redundant with Table view and added cognitive load
- Scorecard metric status wasn't updating when targets were changed in Edit dialog
- Need accurate, honest representation of recommendation engine logic

## What changed
- Updated Investment Insights to show actual performance-based criteria (lead volume, conversion rate, CPE, data quality)
- Removed Graph View (772 lines) and ViewToggle components entirely
- Simplified Dashboard to table-only view
- Fixed status calculation in useScorecardData to recalculate after target updates
- Updated strategic notes to match actual recommendation actions

## Risks / Tradeoffs
- Users lose visual chart comparisons (scatter plots, bar charts)
- Mitigation: Table is sortable/filterable, Program Drilldown has detailed charts
- Investment Insights now looks simpler (less impressive) but is honest
- Tradeoff: Accuracy and trust over marketing polish

## Rollback plan
- Revert commits to restore Graph View if users demand it
- Investment Insights methodology can be reverted to 5-factor display
- Status calculation fix is safe and should not be reverted

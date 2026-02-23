# Intent

## Why
- Integrate FixedDataProvider to connect business logic to UI
- Display ROI metrics (CPL, CPO, CPA, CPE) in dashboard table
- Show data quality and budget recommendations visually
- Enable users to assess program performance at a glance

## What changed
- Created FixedDataProvider implementing DataProvider interface
- Migrated program data to new schema (funnel/conversions/spend)
- Added ROI columns to ProgramTable with currency formatting
- Created DataCompletenessBadge component (green/yellow/red indicators)
- Created BudgetRecommendationBadge component (Increase/Hold/Reduce/Pause)
- Updated App.tsx to use data provider with async loading
- Added 13 unit tests for FixedDataProvider
- Fixed PostCSS config for Tailwind CSS v4 compatibility
- Updated tsconfig to handle nested field sorting

## Risks / Tradeoffs
- Program data migration script uses placeholder spend values ($50/lead)
- TypeScript path alias errors in badge components (IDE-only, Vite resolves correctly)
- Large number of UI component files modified (Prettier formatting)
- No integration tests yet (planned for Phase 5)

## Rollback plan
- Revert to commit fdbc562 (hermetic foundation)
- Programs.ts can be regenerated from original data
- No database changes, purely frontend

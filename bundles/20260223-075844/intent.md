# Intent

## Why
Fix code review blockers from previous review (session-2026-02-23_075439.md):
- Blocker 1 & 2: TypeScript path alias resolution
- Blocker 3: TypeScript strict null checks in recommendationEngine

## What changed
- Added baseUrl and paths configuration to tsconfig.json for @/ imports
- Fixed recommendationEngine.ts to handle null/undefined costPerEnrollment properly
- Used null coalescing and early return to satisfy TypeScript strict mode

## Risks / Tradeoffs
- None - these are pure type safety improvements
- No runtime behavior changes

## Rollback plan
- git restore --staged tsconfig.json src/lib/recommendationEngine.ts

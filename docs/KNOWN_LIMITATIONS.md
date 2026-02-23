# Known Limitations - Phase 2+3

## Placeholder Data (Temporary)

### Spend Data
**Status:** Placeholder values in use  
**Impact:** ROI metrics (CPL, CPO, CPA, CPE) are calculated using synthetic spend data  
**Formula:** `totalSpend = leads × $50`  
**Mitigation:** All ROI columns clearly labeled. Budget recommendations marked as preliminary.  
**Resolution:** Phase 4 will integrate real spend data from HubSpot API  
**Owner:** Data integration team  
**Target:** Q1 2026

### Funnel Stages
**Status:** Calculated from legacy enrollment rates  
**Impact:** Opportunities and applications are reverse-engineered estimates  
**Mitigation:** Migration script uses conservative assumptions (45% app-to-enroll, 65% opp-to-app)  
**Resolution:** Phase 4 will replace with actual funnel data  
**Owner:** Data integration team  
**Target:** Q1 2026

## Technical Debt

### Legacy Code Exclusions
**Status:** TypeScript checking disabled for legacy files  
**Files Affected:**
- `src/data/mockData.ts` (old schema, unused)
- `src/components/ui/**/*` (shadcn components with version-pinned imports)

**Impact:** Reduced type-safety coverage (99 TypeScript errors in excluded files)  
**Mitigation:** Excluded files are not used in production code paths  
**Resolution:** Phase 4 cleanup - migrate or remove legacy files  
**Owner:** Engineering team  
**Target:** Q1 2026

### ESLint Warnings
**Status:** 27 warnings (0 errors)  
**Categories:**
- Unused imports (4 warnings)
- `any` types in test files (7 warnings)
- Fast refresh warnings in UI components (6 warnings)
- Legacy component warnings (10 warnings)

**Impact:** Non-blocking, mostly in test files and legacy components  
**Mitigation:** All warnings documented and tracked  
**Resolution:** Progressive cleanup in Phase 4  
**Owner:** Engineering team  
**Target:** Q2 2026

## User-Facing Limitations

### Loading States
**Status:** Not implemented  
**Impact:** Silent failures on data provider errors  
**Mitigation:** FixedDataProvider uses static data (no network calls)  
**Resolution:** Phase 4 will add loading/error UI for HubSpot integration  
**Owner:** UI team  
**Target:** Q1 2026

### GraphView Scoring Labels
**Status:** Outdated documentation in UI  
**Impact:** Profitability score formula changed but labels not updated  
**Current:** 30% volume + 70% enrollment  
**Old Label:** 20% volume + 35% contact-to-enroll + 45% enrollment  
**Resolution:** Update tooltip text in Phase 4  
**Owner:** UI team  
**Target:** Q1 2026

---

**Last Updated:** 2026-02-23  
**Review Cycle:** Monthly during Phase 4 development

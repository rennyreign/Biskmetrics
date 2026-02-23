# ADR 001: Data Provider Architecture

## Status
Accepted

## Context
Biskmetrics needs to support two distinct data sources across its lifecycle:
- **Phase 1**: Static dataset (current prototype data) for immediate delivery
- **Phase 2**: Live HubSpot API integration for real-time program performance tracking

Additionally, there's an ongoing Salesforce → HubSpot migration, meaning:
- Data structures may be incomplete or inconsistent
- Field mappings may change during migration
- Attribution logic may need adjustment

We need an architecture that:
1. Allows seamless switching between data sources without UI changes
2. Supports graceful degradation when data is incomplete
3. Makes testing easy by allowing mock data providers
4. Isolates data fetching logic from business logic

## Decision
We will implement a **Data Provider Pattern** with the following structure:

### Interface Definition
```typescript
interface DataProvider {
  getPrograms(filters?: ProgramFilters): Promise<Program[]>;
  getScorecardMetrics(week?: Date): Promise<ScorecardMetrics>;
  getProgramDetail(programId: string): Promise<ProgramDetail>;
  getSpendData(programId: string): Promise<SpendData>;
}
```

### Phase 1: FixedDataProvider
- Reads from static JSON/TypeScript files
- No external dependencies
- Immediate, synchronous data access
- Serves as the baseline for testing

### Phase 2: HubSpotDataProvider
- Implements same interface
- Handles API authentication, rate limiting, caching
- Maps HubSpot objects to our domain model
- Includes retry logic and error handling

### Provider Selection
```typescript
// In App.tsx or root provider
const dataProvider = import.meta.env.VITE_ENABLE_HUBSPOT
  ? new HubSpotDataProvider(config)
  : new FixedDataProvider();
```

## Consequences

### Positive
- **UI remains unchanged** when switching data sources
- **Easy testing** with mock providers
- **Clear separation of concerns** between data fetching and business logic
- **Gradual migration** - can test HubSpot integration without breaking existing functionality
- **Data quality visibility** - providers can return completeness metadata

### Negative
- **Additional abstraction layer** adds some complexity
- **Interface must be comprehensive** enough for all use cases
- **Type safety** requires careful mapping between HubSpot schema and our types

### Neutral
- Requires discipline to keep all data access through providers
- May need to extend interface as new features are added

## Implementation Notes

### Defensive Programming
All providers must handle:
- Missing/null values (show "N/A" in UI)
- Division by zero in calculations (return null)
- Incomplete data (flag with completeness score)

### Caching Strategy (Phase 2)
- Cache HubSpot responses for 5 minutes
- Invalidate on user-triggered refresh
- Store in memory (no persistent cache needed initially)

### Error Handling
- Providers throw typed errors (e.g., `DataProviderError`)
- UI catches and displays user-friendly messages
- Errors include context for debugging

## Alternatives Considered

### Direct API Calls in Components
**Rejected** because:
- Tight coupling between UI and data source
- Difficult to test
- Hard to switch data sources
- Business logic mixed with data fetching

### Redux/State Management Library
**Rejected** for Phase 1 because:
- Overkill for static data
- Adds unnecessary complexity
- Can be added later if needed for Phase 2

### GraphQL Layer
**Rejected** because:
- HubSpot doesn't provide GraphQL API
- Would require building our own GraphQL server
- Adds deployment complexity

## References
- [Program Shelf V2 Requirements](../../plan/program-shelf-v2.md)
- [Hermetic Engineering Rules](../../.windsurf/rules/hermetic-engineering.md)

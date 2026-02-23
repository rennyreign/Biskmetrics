# AGENTS.md

## Project: Biskmetrics
Unified Program Performance Dashboard for tracking program ROI, funnel performance, and marketing scorecard metrics.

## Quick Start
```bash
# One-command setup (hermetic principle)
./scripts/setup.sh

# Or manually
npm ci
npm run dev
```

## Commands

### Development
- `npm run dev` - Start development server (Vite)
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Quality Gates
- `npm run test` - Run tests (Vitest)
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - TypeScript type checking
- `npm run quality` - Run all quality checks (format, lint, typecheck, test)

### Scripts
- `./scripts/setup.sh` - Bootstrap development environment
- `./scripts/pre-commit.sh` - Pre-commit quality checks
- `./scripts/audit-deps.sh` - Security audit dependencies

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Material-UI + Radix UI components + shadcn/ui patterns
- **Charts**: Recharts for data visualization
- **State**: React hooks for local state
- **Data Layer**: Modular provider architecture (FixedDataProvider → HubSpotDataProvider)
- **Forms**: react-hook-form + Zod validation
- **Testing**: Vitest + Testing Library
- **Code Quality**: Prettier + ESLint + TypeScript strict mode

## Project Structure (Hermetic Compliant)
```
biskmetrics/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── ProgramTable.tsx # Main program table
│   │   ├── GraphView.tsx    # Chart visualizations
│   │   ├── Scorecard/       # EOS scorecard components
│   │   ├── ProgramDetail/   # Drilldown view components
│   │   └── DataQuality/     # Data completeness indicators
│   ├── providers/
│   │   ├── DataProvider.interface.ts  # Abstract interface
│   │   ├── FixedDataProvider.ts       # Phase 1 static data
│   │   └── HubSpotDataProvider.ts     # Phase 2 API integration
│   ├── lib/
│   │   ├── metricsEngine.ts           # ROI calculations
│   │   ├── recommendationEngine.ts    # Budget recommendations
│   │   └── dataQuality.ts             # Completeness scoring
│   ├── data/
│   │   ├── programs.ts      # Program data
│   │   └── mockData.ts      # Scorecard mock data
│   ├── types/
│   │   ├── program.ts       # Program types
│   │   ├── metrics.ts       # ROI metric types
│   │   └── scorecard.ts     # Scorecard types
│   └── App.tsx              # Main application
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── setup.ts             # Test configuration
├── scripts/                 # Automation scripts
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   └── AGENTS.md            # This file
└── .windsurf/
    └── rules/               # Project rules and standards
```

## Code Style
- Use `@/` path alias for imports from src/
- TypeScript with strict settings
- Functional components with hooks
- Prettier formatting (100 char line length, single quotes)
- Conventional commits required

## Testing Requirements
- Minimum 80% coverage for business logic
- 100% coverage for critical paths (ROI calculations, recommendations)
- Tests required for new public functions
- Tests required for bugfixes

## Data Provider Architecture

The application uses a modular data provider pattern:

### Phase 1: Fixed Data Provider
```typescript
import { FixedDataProvider } from '@/providers/FixedDataProvider';

const dataProvider = new FixedDataProvider();
const programs = await dataProvider.getPrograms();
```

### Phase 2: HubSpot Provider (Future)
```typescript
import { HubSpotDataProvider } from '@/providers/HubSpotDataProvider';

const dataProvider = new HubSpotDataProvider({
  apiKey: process.env.VITE_HUBSPOT_API_KEY,
  portalId: process.env.VITE_HUBSPOT_PORTAL_ID,
});
const programs = await dataProvider.getPrograms();
```

## Key Features

### 1. Program Performance Dashboard
- Sortable/filterable program table
- ROI metrics: CPL, CPO, CPA, CPE
- Data completeness indicators
- Budget recommendations

### 2. Recommended Verdict Tab
- Program scoring and recommendations
- Investment action suggestions (Increase/Hold/Reduce)

### 3. Scorecard Tab (EOS-Style)
- Leading vs. Lagging indicators
- Weekly tracking with WoW deltas
- 8-week performance trends
- Status tracking (On Track/Off Track/Flagged)

### 4. Program Drilldown
- Detailed funnel performance
- ROI calculator with scenario modeling
- Conversion stage analysis
- Trend visualizations

## Environment Variables
See `.env.example` for required configuration:
- `VITE_HUBSPOT_API_KEY` - HubSpot API key (Phase 2)
- `VITE_HUBSPOT_PORTAL_ID` - HubSpot portal ID (Phase 2)
- `VITE_ENABLE_HUBSPOT` - Feature flag for HubSpot integration

## Version Pinning
- Node.js: 24.11.1 (see `.nvmrc` and `.tool-versions`)
- Dependencies locked via `package-lock.json`

## Documentation
- `CHANGELOG.md` - Version history and changes
- `docs/adr/` - Architecture Decision Records
- `README.md` - Project overview and setup
- `plan/program-shelf-v2.md` - Detailed requirements

## Hermetic Engineering Compliance
This project follows hermetic engineering principles:
- ✅ Reproducible builds with locked dependencies
- ✅ Comprehensive testing framework
- ✅ Code quality tooling (Prettier, ESLint, TypeScript)
- ✅ Version pinning (.nvmrc, .tool-versions)
- ✅ Environment variable templates
- ✅ Structured project layout
- ✅ Documentation and ADRs
- ✅ Quality gate scripts
- ✅ One-command bootstrap

See `.windsurf/rules/hermetic-engineering.md` for full ruleset.

## Development Workflow

1. **Start new feature**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   npm run dev          # Development server
   npm run test:ui      # Watch tests
   ```

3. **Before commit**
   ```bash
   ./scripts/pre-commit.sh  # Run all quality checks
   ```

4. **Commit with conventional format**
   ```bash
   git commit -m "feat: add ROI calculator to drilldown view"
   ```

## Common Tasks

### Adding a New Metric
1. Update types in `src/types/metrics.ts`
2. Add calculation logic in `src/lib/metricsEngine.ts`
3. Add tests in `tests/unit/metricsEngine.test.ts`
4. Update UI components to display the metric

### Adding a New Data Provider
1. Implement `DataProvider` interface
2. Add provider in `src/providers/`
3. Add integration tests
4. Update environment variables if needed

### Debugging Data Quality Issues
1. Check data completeness indicators in UI
2. Review `src/lib/dataQuality.ts` scoring logic
3. Inspect provider output in browser console (dev mode)

## Performance Targets
- Initial load: < 3 seconds
- Table sorting: < 500ms
- Drilldown open: < 1 second
- Test suite: < 30 seconds

## Security
- No secrets in repository
- Environment variables for sensitive data
- Input validation with Zod
- Defensive programming for calculations (null/0 handling)

## Contributing
1. Follow conventional commit format
2. Run quality checks before committing
3. Ensure tests pass and coverage meets requirements
4. Update documentation for significant changes

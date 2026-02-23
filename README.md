# Biskmetrics

**Unified Program Performance Dashboard** for tracking program ROI, funnel performance, and marketing scorecard metrics following the Program Shelf System methodology.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646cff)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-6e9f18)](https://vitest.dev/)

## 🚀 Quick Start

### Prerequisites
- Node.js 24.11.1 (use nvm or asdf for version management)
- npm (comes with Node.js)

### One-Command Setup (Hermetic)
```bash
./scripts/setup.sh
```

### Manual Setup
```bash
# Install dependencies (use npm ci for reproducible builds)
npm ci

# Copy environment variables (optional for Phase 1)
cp .env.example .env

# Start development server
npm run dev
```

## 📋 Features

### Dashboard Tab
- **Program Performance Table** with sortable/filterable columns
- **ROI Metrics**: Cost Per Lead (CPL), Cost Per Opportunity (CPO), Cost Per Application (CPA), Cost Per Enrollment (CPE)
- **Data Completeness Indicators** for migration gap detection
- **Budget Recommendations** (Increase/Hold/Reduce spend)
- **Graph Visualizations** for lead volume, conversion rates, and scatter analysis

### Recommended Verdict Tab
- Program scoring and investment recommendations
- Comparative performance rankings
- Top/bottom performer identification

### Scorecard Tab (EOS-Style)
- **Leading vs. Lagging Indicators** tracking
- **Weekly Performance Metrics** with WoW deltas
- **8-Week Trend Charts** for pattern detection
- **Status Tracking** (On Track/Off Track/Flagged for IDS)
- **Dual Pipeline Support** (Degree vs. Certificate programs)

### Program Drilldown View
- Detailed funnel performance analysis
- Interactive ROI calculator with scenario modeling
- Conversion stage drop-off insights
- Historical trend visualizations

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Material-UI + Radix UI** - Component libraries
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first styling

### Data Architecture
- **Modular Provider Pattern** - Swappable data sources
- **Phase 1**: Fixed data provider (static dataset)
- **Phase 2**: HubSpot API integration (planned)

### Quality Tools
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **Prettier** - Code formatting
- **ESLint** - Linting and code quality

## 📦 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Quality Gates
```bash
npm run test              # Run tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Run tests with coverage
npm run lint              # Run ESLint
npm run lint:fix          # Auto-fix ESLint issues
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
npm run typecheck         # TypeScript type checking
npm run quality           # Run all quality checks
```

### Scripts
```bash
./scripts/setup.sh        # Bootstrap development environment
./scripts/pre-commit.sh   # Pre-commit quality checks
./scripts/audit-deps.sh   # Security audit dependencies
```

## 📁 Project Structure

```
biskmetrics/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── Scorecard/   # EOS scorecard components
│   │   ├── ProgramDetail/ # Drilldown view
│   │   └── DataQuality/ # Completeness indicators
│   ├── providers/       # Data provider architecture
│   ├── lib/             # Utility functions & engines
│   │   ├── metricsEngine.ts
│   │   ├── recommendationEngine.ts
│   │   └── dataQuality.ts
│   ├── data/            # Static data & mocks
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application
├── tests/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── setup.ts         # Test configuration
├── scripts/             # Automation scripts
├── docs/
│   ├── adr/             # Architecture Decision Records
│   └── AGENTS.md        # AI agent development guide
└── .windsurf/
    └── rules/           # Project rules and standards
```

## 🔒 Environment Variables

Copy `.env.example` to `.env` (optional for Phase 1):

```env
# Phase 2 - HubSpot Integration
VITE_HUBSPOT_API_KEY=your_api_key
VITE_HUBSPOT_PORTAL_ID=your_portal_id
VITE_ENABLE_HUBSPOT=false
```

## 🧪 Testing

This project follows hermetic engineering principles with comprehensive testing:

- **Minimum 80% coverage** for business logic
- **100% coverage** for critical paths (ROI calculations, recommendations)
- Tests required for new public functions and bugfixes

Run tests:
```bash
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:ui           # Interactive test UI
```

## 🎨 Code Style

- **Path alias**: Use `@/` for imports from `src/`
- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Formatting**: Prettier (100 char line length, single quotes)
- **Commits**: Conventional commits required

## 📚 Documentation

- [`docs/AGENTS.md`](./docs/AGENTS.md) - Agent/AI development guide
- [`CHANGELOG.md`](./CHANGELOG.md) - Version history
- [`docs/adr/`](./docs/adr/) - Architecture Decision Records
- [`plan/program-shelf-v2.md`](./plan/program-shelf-v2.md) - Detailed requirements
- [`.windsurf/rules/hermetic-engineering.md`](./.windsurf/rules/hermetic-engineering.md) - Engineering standards

## 🔐 Security

- No secrets in repository
- Environment variables for sensitive data
- Input validation with Zod
- Defensive programming for calculations (null/0 handling)

## 🤝 Contributing

1. Follow conventional commit format
2. Run quality checks before committing: `./scripts/pre-commit.sh`
3. Ensure tests pass and coverage meets requirements
4. Update documentation for significant changes

## 📄 License

Private project - All rights reserved

## 🙏 Acknowledgments

Built with modern web technologies and hermetic engineering principles for reproducibility, quality, and maintainability. Inspired by the EOS (Entrepreneurial Operating System) methodology and the Program Shelf System framework.
# EOS Pulse — Scorecard Rebuild Brief

**Version:** 1.0  
**Date:** February 2026  
**Purpose:** Full specification for rebuilding the EOS Pulse Marketing Scorecard as a module within another application.

---

## 1. Overview & Purpose

**EOS Pulse** is a weekly marketing performance scorecard built for a higher-education marketing team (Bisk). It tracks key marketing metrics across two student enrollment pipelines — **Degree** and **Certificate** — and surfaces performance data in a structured, EOS (Entrepreneurial Operating System) format.

The scorecard is used during weekly EOS leadership sessions to:
- Review current week performance vs. targets
- Identify metrics trending off-track
- Flag underperforming metrics for IDS (Issues, Discuss, Solve) discussion
- Track 8-week historical trends and conversion funnel health

**Live URL:** `https://bisk-eos-scorecard.netlify.app/`  
**GitHub:** `https://github.com/rennyreign/eos-pulse`

---

## 2. Core Concepts

### 2.1 Pipelines
All metrics are scoped to one of two **pipelines**:
- **Degree Pipeline** — metrics for degree-seeking student enrollment
- **Certificate Pipeline** — metrics for certificate/short-course enrollment

Each pipeline has its own independent set of metrics, targets, and weekly scores. They are viewed via tabs and never merged.

### 2.2 Metric Categories
Within each pipeline, metrics are split into two categories:

| Category | Description |
|---|---|
| **Leading Indicators** | Forward-looking metrics that predict future outcomes (e.g. Visitor to Inquiry rate, Cost per Lead) |
| **Lagging Indicators** | Outcome metrics that reflect results already achieved (e.g. Cost per Application, Opportunity to Application Rate) |

### 2.3 Metric Types
Two directional types exist:
- **Rate/Count metrics** — Higher is better (e.g. conversion rates, lead counts)
- **Cost metrics** — Lower is better (e.g. Cost per Lead, Cost per Application). Detected automatically by checking if the metric name contains the word "cost".

### 2.4 Week Key
All data is anchored to a `week_key` — a `YYYY-MM-DD` date string representing the Monday of each EOS session week. The user can navigate forward/backward through weeks using chevron buttons in the header.

### 2.5 EOS Session Day
The team can configure which day of the week their EOS session falls on. This is stored per-team and affects how the current week is calculated.

---

## 3. Page Structure

The application is a single-page dashboard (`/`) with the following layout from top to bottom:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  Logo | "Marketing Scorecard" | Week Nav | EOS Day | Actions│
├─────────────────────────────────────────────────────────────┤
│  PIPELINE TABS                                               │
│  [ Degree Pipeline ] [ Certificate Pipeline ]                │
├─────────────────────────────────────────────────────────────┤
│  EXECUTIVE SNAPSHOT (per active tab)                         │
│  On Track | Off Track | Flagged for IDS                      │
│  Leading Pacing % | Lagging Pacing %                         │
├─────────────────────────────────────────────────────────────┤
│  LEADING INDICATORS TABLE                                    │
│  Metric | Owner | Current | Last Week | WoW Δ | 4-Wk Avg   │
│  | Target | Status | Streak | IDS                           │
├─────────────────────────────────────────────────────────────┤
│  LAGGING INDICATORS TABLE                                    │
│  (same columns as above)                                     │
├─────────────────────────────────────────────────────────────┤
│  TREND CHARTS (2 side by side)                               │
│  8-Week Performance Trends | Marketing Funnel (Current Week) │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Feature Specifications

### 4.1 Header

- **Logo:** Bisk brand mark (left)
- **Title:** "Marketing Scorecard" (primary heading)
- **Subtitle:** "EOS Session" badge — clickable to open EOS Day picker dialog
- **Week Navigation:** `< [Week of Mon DD MMM YYYY] >` — left/right chevrons to move between weeks
- **Actions:**
  - **Enter Weekly Scores** button — opens the Weekly Score Entry dialog
  - **Sign Out** button

### 4.2 Pipeline Tabs

Two tabs: **Degree Pipeline** and **Certificate Pipeline**.

- Switching tabs preserves the current scroll position (no jump to top)
- Each tab fetches its own metrics from the database filtered by `pipeline`
- Each tab renders its own Executive Snapshot, Leading table, Lagging table, and Trend Charts independently

### 4.3 Executive Snapshot

A summary card shown at the top of each pipeline tab with:

**Weekly Status Summary (3 stat boxes):**
| Box | Colour | Value |
|---|---|---|
| Metrics On Track | Green | Count of metrics with `status = 'green'` |
| Metrics Off Track | Red | Count of metrics with `status = 'red'` |
| Flagged for IDS | Orange | Count of metrics with `ids_flagged = true` |

**Quarter Pacing Summary (2 rows):**
- Leading Indicators: `X of Y on track` → percentage → risk badge
- Lagging Indicators: `X of Y on track` → percentage → risk badge

Risk badge thresholds:
| Pacing % | Label | Colour |
|---|---|---|
| ≥ 85% | Stable | Green |
| ≥ 70% | Watch | Yellow |
| < 70% | At Risk | Red |

### 4.4 Metric Tables (Leading & Lagging)

Each table has a header row with `+ Add Metric` button (top right).

**Columns:**

| Column | Description |
|---|---|
| **Metric** | Metric name (bold) |
| **Owner** | Person responsible (e.g. "CFO", "Enrollment Director") |
| **Current** | Most recent week's actual value, formatted with unit |
| **Last Week** | Previous week's value |
| **WoW Δ** | Week-over-week % change with directional icon and colour |
| **4-Wk Avg** | Rolling 4-week average |
| **Target** | The metric's target value |
| **Status** | Green "On Track" or Red "Off Track" badge |
| **Streak** | Consecutive green 🟢 or red 🔴 weeks badge |
| **IDS** | Orange flag icon 🚩 if flagged for IDS discussion |

**WoW Δ colour logic:**
- For **cost metrics**: decrease = green (good), increase = red (bad)
- For **rate metrics**: increase = green (good), decrease = red (bad)

**Status logic:**
- For **cost metrics**: `green` if `actual_value <= target`
- For **rate metrics**: `green` if `actual_value / target >= threshold.green` (default 0.9)

**Streak logic (calculated dynamically from history):**
- Iterates through weekly scores from most recent to oldest
- Counts consecutive weeks of the same status
- Resets to 0 when status changes
- Streaks are NOT stored in the database — computed at runtime

**IDS auto-flagging:**
- Any metric with `red_streak >= 2` is automatically flagged for IDS
- Flagged rows are highlighted with an orange background
- Clicking a flagged metric opens the Edit dialog with IDS discussion fields

**Row click behaviour:**
- Clicking any row opens the **Edit Metric Dialog**

### 4.5 Edit Metric Dialog

Opened by clicking any metric row. Fields:

| Field | Editable |
|---|---|
| Metric name | No (display only) |
| Current value | Yes |
| Target | Yes |
| Owner | Yes |
| IDS Hypothesis | Yes (only shown if `ids_flagged = true`) |
| IDS Action Plan | Yes (only shown if `ids_flagged = true`) |

Saves to the `metrics` table in Supabase.

### 4.6 Add Metric Dialog

Opened via the `+ Add Metric` button in any table header. Fields:

| Field | Type |
|---|---|
| Metric Name | Text input |
| Category | Select: Leading / Lagging |
| Owner | Text input |
| Target | Number input |
| Unit | Text input (e.g. `$`, `%`) |
| Pipeline | Auto-set from active tab |

Saves a new row to the `metrics` table.

### 4.7 Weekly Score Entry Dialog

Opened via the **Enter Weekly Scores** button in the header.

- Shows all metrics for both pipelines
- User enters the actual value for each metric for the current `week_key`
- On save, upserts rows into `weekly_scores` table
- After save, the scorecard refreshes to reflect new values

### 4.8 Trend Charts

Two charts rendered below the metric tables for each pipeline:

**Chart 1 — 8-Week Performance Trends (Line Chart):**
- X-axis: Week labels (Wk 1 → Wk 8)
- Left Y-axis: Cost per Lead ($)
- Right Y-axis: Visitor to Inquiry (%)
- Two lines: blue for cost, green for conversion rate
- Summary cards below showing latest value and 8-week % change

**Chart 2 — Marketing Funnel (Horizontal Bar Chart):**
- Stages: Visitors → Inquiries → Opportunities → Applications
- Volumes estimated from current week conversion rates
- Conversion % shown per stage
- Uses actual metric values from the current week's data

### 4.9 EOS Day Picker

Accessible by clicking the "EOS Session" badge in the header.

- Dialog with 7 day buttons: Sun Mon Tue Wed Thu Fri Sat
- Selected day is highlighted
- Saves to the `teams` table as `commencement_day` (0 = Sunday, 6 = Saturday)
- Affects how the current week's `week_key` is calculated

### 4.10 Authentication

Two login methods:

1. **Supabase Auth** — standard email/password login
2. **Demo/Admin bypass** — username `admin`, password `admin123`
   - Sets `demo_session = 'true'` in `localStorage`
   - Creates a mock user object without hitting Supabase Auth
   - Used for UAT/demo access

Sign out clears both Supabase session and `demo_session` from localStorage.

---

## 5. Database Schema (Supabase / PostgreSQL)

### 5.1 `metrics` table

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Unique identifier |
| `function_unit_id` | uuid | FK to function_units |
| `name` | text | Metric display name |
| `type` | text | `execution` or `outcome` |
| `source` | text | `manual`, `api`, or `agent` |
| `category` | text | `leading` or `lagging` |
| `pipeline` | enum | `degree` or `certificate` |
| `owner` | text | Person responsible |
| `unit` | text | Display unit (e.g. `$`, `%`) |
| `target` | numeric | Target value |
| `thresholds` | jsonb | `{ "green": 0.9, "yellow": 0.8 }` |
| `weight` | numeric | Metric weight (unused currently) |
| `sort_order` | integer | Display order |
| `is_inverse` | boolean | True if lower = better |
| `ids_flagged` | boolean | IDS flag (overridden at runtime) |
| `ids_hypothesis` | text | IDS root cause hypothesis |
| `ids_action` | text | IDS action plan |
| `ids_expected_impact_week` | date | Expected resolution week |
| `green_streak` | integer | Stored streak (overridden at runtime) |
| `red_streak` | integer | Stored streak (overridden at runtime) |
| `created_at` | timestamptz | Row creation time |

> **Note:** `ids_flagged`, `green_streak`, and `red_streak` in the database are legacy/unused. The application calculates these dynamically from `weekly_scores` history at runtime.

### 5.2 `weekly_scores` table

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Unique identifier |
| `metric_id` | uuid (FK → metrics.id) | Which metric this score belongs to |
| `week_key` | date | Monday date of the EOS week (e.g. `2026-02-09`) |
| `actual_value` | numeric | The entered metric value for that week |
| `created_at` | timestamptz | Row creation time |
| `updated_at` | timestamptz | Last update time |

### 5.3 `teams` table

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Unique identifier |
| `name` | text | Team name |
| `commencement_day` | integer | Day of week for EOS session (0=Sun, 6=Sat) |

### 5.4 `function_units` table

| Column | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Unique identifier |
| `name` | text | Function unit name |

### 5.5 Other tables (lower priority)

- `quarterly_targets` — per-metric quarterly targets (not actively used in current UI)
- `metric_history` — legacy history table (superseded by `weekly_scores`)
- `team_notes` — per-team notes (not surfaced in current UI)
- `weekly_submissions` — tracks which weeks have been submitted

---

## 6. Current Metric Set

### Degree Pipeline

**Leading Indicators:**
| Metric | Owner | Unit | Target | Notes |
|---|---|---|---|---|
| Cost per Lead | CFO | $ | 200 | Cost metric (lower = better) |
| Cost per MQL | CFO | $ | 400 | Cost metric |
| Cost per Visit | CFO | $ | 50 | Cost metric |
| Visitor to Inquiry | Marketing Director | % | 25 | Rate metric |

**Lagging Indicators:**
| Metric | Owner | Unit | Target | Notes |
|---|---|---|---|---|
| Cost per Application | CFO | $ | 2000 | Cost metric |
| Cost per Opportunity | Enrollment Director | $ | 800 | Cost metric |
| Inquiry to Opportunity Rate | Enrollment Director | % | 25 | Rate metric |
| Opportunity to Application Rate | Enrollment Director | % | 40 | Rate metric |

### Certificate Pipeline

**Leading Indicators:**
| Metric | Owner | Unit | Target | Notes |
|---|---|---|---|---|
| Cost per Lead | CFO | $ | 150 | Cost metric |
| Cost per MQL | CFO | $ | 300 | Cost metric |
| Cost per Visit | CFO | $ | 40 | Cost metric |
| Visitor to Inquiry | Marketing Director | % | 20 | Rate metric |

**Lagging Indicators:**
| Metric | Owner | Unit | Target | Notes |
|---|---|---|---|---|
| Cost per Application | CFO | $ | 1500 | Cost metric |
| Cost per Opportunity | Enrollment Director | $ | 600 | Cost metric |
| Inquiry to Opportunity Rate | Enrollment Director | % | 20 | Rate metric |
| Opportunity to Enrollment Rate | Enrollment Director | % | 35 | Rate metric (renamed from "Opportunity to Application Rate") |

---

## 7. Calculation Logic

### 7.1 Status
```
if metric name contains "cost":
  status = actual_value <= target ? "green" : "red"
else:
  performance = actual_value / target
  status = performance >= thresholds.green ? "green" : "red"
```

### 7.2 Week-over-Week Delta (WoW Δ)
```
wowDelta = ((currentValue - lastWeekValue) / lastWeekValue) * 100
```
Displayed as a percentage with directional icon. Colour inverted for cost metrics.

### 7.3 4-Week Rolling Average
```
rollingAvg4Week = average of the 4 most recent weekly values
```
Only shown when 4+ weeks of data exist.

### 7.4 Streak Calculation (runtime, not stored)
```
for each week from most recent to oldest:
  weekStatus = calculateStatus(value, target, thresholds, isCostMetric)
  if weekStatus == "red":
    redStreak++
    greenStreak = 0
  else if weekStatus == "green":
    greenStreak++
    redStreak = 0
  else:
    break
```

### 7.5 IDS Auto-Flag
```
ids_flagged = redStreak >= 2
```

---

## 8. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript + Vite |
| **Routing** | React Router v6 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **State / Server** | TanStack React Query |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Edge Functions) |
| **Forms** | react-hook-form + Zod |
| **Drag & Drop** | @dnd-kit (metric reordering) |
| **Date Utilities** | date-fns |
| **Deployment** | Netlify (CI/CD from GitHub) |

---

## 9. Key Hooks

| Hook | Purpose |
|---|---|
| `useEOSMetrics(weekKey, pipeline)` | Fetches metrics + weekly scores, calculates status, streaks, WoW delta, 4-week avg |
| `useHistoricalMetrics(pipeline, weeks)` | Fetches 8 weeks of historical data for trend charts |
| `useAuth()` | Manages Supabase auth + demo session bypass |
| `useScorecard()` | Manages teams, function units, metric CRUD |
| `useLocalStorage()` | Persists submitted weeks and other UI state |

---

## 10. Key Components

| Component | File | Purpose |
|---|---|---|
| `PipelineTabs` | `src/components/scorecard/PipelineTabs.tsx` | Tab switcher for Degree / Certificate pipelines |
| `EOSMetricTable` | `src/components/scorecard/EOSMetricTable.tsx` | Core metric table with all columns |
| `ExecutiveSnapshot` | `src/components/scorecard/ExecutiveSnapshot.tsx` | Summary stats + pacing panel |
| `MetricsTrendChart` | `src/components/scorecard/MetricsTrendChart.tsx` | 8-week line chart + funnel bar chart |
| `WeeklyScoreEntryDialog` | `src/components/scorecard/WeeklyScoreEntryDialog.tsx` | Dialog for entering weekly metric values |
| `AddMetricDialog` | `src/components/scorecard/AddMetricDialog.tsx` | Dialog for adding a new metric |
| `EditMetricDialog` | `src/components/scorecard/EditMetricDialog.tsx` | Dialog for editing metric target, owner, IDS fields |
| `EOSCalculations` | `src/components/scorecard/EOSCalculations.ts` | Pure functions: calculateStatus, calculateWoWDelta, calculate4WeekAverage |

---

## 11. Routes

| Route | Component | Description |
|---|---|---|
| `/` | `Index.tsx` | Main scorecard dashboard (protected) |
| `/auth` | `Auth.tsx` | Login page |
| `/health` | `Health.tsx` | Health check endpoint |
| `/ready` | `Ready.tsx` | Readiness endpoint |

Protected routes redirect to `/auth` if no user session exists.

---

## 12. Environment Variables

```env
VITE_SUPABASE_PROJECT_ID=nonzlxgayljvufcwycne
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key>
VITE_SUPABASE_URL=https://nonzlxgayljvufcwycne.supabase.co
```

---

## 13. Known Decisions & Constraints

| Decision | Rationale |
|---|---|
| No blended pipeline view | Blended metrics require true weighted averages from Looker/CRM data. Manual calculation would not match source-of-truth dashboards. Planned as v3 feature. |
| Streaks calculated at runtime | Database streak values were static/stale. Runtime calculation from `weekly_scores` ensures accuracy. |
| Cost metric detection by name | `metric.name.toLowerCase().includes('cost')` — simple heuristic. Could be replaced by `is_inverse` boolean column. |
| Demo login via localStorage | Allows UAT access without Supabase Auth account. Not for production use. |
| Funnel chart uses estimated volumes | True visitor/lead volumes are not stored in the database. Funnel estimates from conversion rates applied to a base visitor count of 1,800. |

---

## 14. Screenshots Reference

> The agent should request screenshots from the user for the following views:
> 1. Full dashboard — Degree Pipeline tab (showing Executive Snapshot + both tables + charts)
> 2. Certificate Pipeline tab
> 3. Weekly Score Entry dialog (open)
> 4. Edit Metric dialog — IDS-flagged metric (showing hypothesis/action fields)
> 5. Add Metric dialog
> 6. EOS Day picker dialog
> 7. Login / Auth page

---

## 15. Rebuild Integration Notes

When integrating into another application:

1. **The scorecard is self-contained.** The core data model (`metrics` + `weekly_scores`) is simple and can be migrated to any PostgreSQL-compatible database.

2. **The pipeline concept is the primary organisational unit.** If the target app has a different concept (e.g. "department", "brand", "channel"), map it to `pipeline`.

3. **The `week_key` pattern is important.** All data is keyed to a Monday date. Ensure the host app respects this convention when writing scores.

4. **Streak and IDS calculations are pure functions** in `EOSCalculations.ts` and can be ported independently of the React layer.

5. **The `useEOSMetrics` hook is the single source of truth** for all metric display data. Any rebuild should replicate its logic: fetch metrics, fetch scores, join them, calculate derived values.

6. **Authentication can be replaced** entirely with the host app's auth system. The only requirement is that a `user` object is available to protect the dashboard route.

7. **Charts are optional.** The core value is in the metric tables and Executive Snapshot. Charts can be added incrementally.

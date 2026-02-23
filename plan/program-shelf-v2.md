# Program Shelf Database

CRM Account: Bisk Education (https://www.notion.so/Bisk-Education-3021229adc4a80eda25ceabf80fab779?pvs=21)
Due: March 6, 2026
Operating Area: Building
Start: February 16, 2026
Status: Active

## Project Name

**Program Performance Dashboard (Unified Decision Hub)**

## Background / Context

Bisk currently has two separate dashboard experiences:

1. **Marketing Scorecard (EOS Execution Dashboard)** – tracks weekly performance indicators and pacing metrics.
2. **Program Performance Dashboard** – a program shelf-style view listing programs and showing funnel performance, plus a “Recommended Verdict” tab that scores programs for investment decisions.

The problem is that decision-making around **which programs to promote, scale, or reduce spend on** is still too slow and requires too much manual interpretation across multiple views.

This project aims to merge the scorecard logic into the program shelf dashboard and expand the program-level ROI metrics so marketing and leadership can make faster, more accurate budget allocation decisions.

---

## Primary Goal

Build a **single unified dashboard experience** that enables rapid, confident decisions about program investment based on real funnel outcomes, cost metrics, and ROI.

---

## Core Objectives

### 1. Merge Scorecard Into Program Performance Dashboard

- The Marketing Scorecard will be integrated into the Program Performance Dashboard as a **third tab**.
- Current tab structure:
    - Dashboard
    - Recommended Verdict
    - **Scorecard (new tab)**

This should create a single “home base” for decision-making.

Background and structure of the marketing scorecard dashboard can be found in the following images and under eos-pulse folder, which is the entire project structure of the current marketing scorecard dashboard. 

![Bisk-Scorecard-–-EOS-Execution-Dashboard-5.png](Program%20Shelf%20Database/Bisk-Scorecard--EOS-Execution-Dashboard-5.png)

![Bisk-Scorecard-–-EOS-Execution-Dashboard-6.png](Program%20Shelf%20Database/d652070b-40c2-42a3-b733-540a8b022094.png)

![Bisk-Scorecard-–-EOS-Execution-Dashboard-7.png](Program%20Shelf%20Database/cbd9248e-3c2d-4f85-98e0-758d3098c68d.png)

---

### 2. Add Program-Level Cost + ROI Metrics (New Columns)

Each program row must include these new cost metrics:

- **Cost Per Lead**
- **Cost Per Opportunity**
- **Cost Per Application**
- **Cost Per Enrollment**

These should be calculated using marketing spend inputs divided by funnel outcomes.

The program table should support sorting/filtering based on these ROI metrics.

---

### 3. Move Data Feed Toward Real-Time HubSpot API Integration

The long-term requirement is for the dashboard to run on **real-time or near real-time data pulled from HubSpot’s API**.

However, there is an active migration from Salesforce → HubSpot, so some reporting objects/fields may not yet exist or may not reconcile cleanly.

**Phase 1 should use the fixed dataset currently available**, but architecture should be built with HubSpot as the intended future source of truth.

---

### 4. Build an ROI Calculator + Budget Recommendation Layer

The dashboard must include a way to compare:

- marketing spend (budget inputs)
    
    vs
    
- enrollment outcomes (results)

This should output:

- ROI indicators per program
- recommended investment actions (increase / hold / reduce spend)
- optional scenario modeling ("if we increase spend by X, expected enrollments become Y")

The budget allocation recommendation does not need to be “perfect finance-grade” at launch, but should be directionally useful and transparent.

---

### 5. Drill-Down Program Detail View

Clicking a program row should open a **drilled-down program detail view** containing deeper insight.

This view should include:

- funnel performance trends
    - These are currently listed on the main index table: inquiry to opportunity rate | opportunity to application rate etc
- cost efficiency trends
- lead quality indicators
- conversion stage drop-off insights
- likely explanation flags (ex: “strong demand but weak contact-to-enroll”)

This drill-down view is also the best place to host the **ROI calculator + scenario modeling**, rather than cluttering the main table.

---

## Key Design / UX Requirements

### Main Program Table View

The program list should remain the core interface, but enhanced with ROI columns and better decision-making context.

Suggested features:

- Sortable columns
- Filtering by school, program type, market category, verdict
- Quick badges for “High ROI”, “At Risk”, “Scaling Candidate”
- A “confidence score” indicator based on data completeness

### Scorecard Tab

Should feel like the EOS Scorecard but aligned with program performance reality:

- leading vs lagging indicators
- pacing trends
- metric streaks (improving vs declining)

### Drilldown Page

Program drilldown should include:

- pipeline funnel chart (currently shown on main index)
- time trend chart
- ROI calculator module
- narrative insights section (auto-generated)
- recommendation summary (“Buy / Strong Buy / Hold / Reduce”)

---

## Data + Metrics Requirements

### Funnel Stages (Minimum Required)

Each program should support these core metrics:

- Visitors
- Inquiries
- Opportunities
- Applications
- Enrollments

### Spend Inputs

Marketing spend must be available by program or attributable via campaign mapping.

If spend cannot be fully mapped yet, allow:

- manual override input
- fallback allocation rules (even distribution or weighted distribution)

---

## Migration Risk & Data Quality Reality

There is an ongoing Salesforce → HubSpot migration, meaning:

- some objects may not exist yet
- attribution may be incomplete
- opportunity/application/enrollment fields may not map cleanly
- time-series consistency may be broken

Instead of treating this as a blocker, the dashboard should intentionally expose gaps.

### Explicit Requirement: Data Completeness Visibility

Add a “data quality” indicator per program that signals:

- complete
- partial
- unreliable

This helps the dashboard double as a **migration weakness detector**.

---

## Phased Build Approach (Recommended)

### Phase 1 (Immediate Delivery)

- Use fixed snapshot dataset (current source)
- Merge scorecard as tab #3
- Add cost metrics columns
- Enable row click drilldown
- Basic ROI calculation per program
- Static verdict recommendations (existing model)

### Phase 2 (Migration-Aware HubSpot Integration)

- Connect HubSpot API
- Replace snapshot with real-time feed
- Introduce data mapping logic and reconciliation checks
- Highlight missing/unstable fields

### Phase 3 (Optimization + Intelligence Layer)

- Add predictive ROI scenarios
- Budget allocation optimizer
- Confidence scoring system
- Auto-insight narrative generation

---

## Suggested Enhancements (Optional but Valuable)

### A. “Portfolio View” Budget Allocator

A separate module that shows:

- total spend
- spend by school/program type
- ROI distribution
- suggested reallocation plan

### B. Automated Insight Flags

Examples:

- “High traffic, low inquiry conversion → landing page issue”
- “Strong inquiry conversion, weak opportunity conversion → admissions bottleneck”
- “Strong cost efficiency but low demand → niche program”

### C. Benchmarking

Compare each program against:

- same school averages
- same program category averages
- previous quarter performance

---

## Technical Requirements

- Frontend should preserve current dashboard style and layout consistency.
- Backend should be modular so data source can shift from “fixed dataset” to HubSpot API without redesigning the UI.
- HubSpot integration should be structured as a service layer with caching and refresh logic.

---

## Success Criteria

This dashboard is successful if it enables leadership and marketing to:

- quickly identify which programs to scale or cut
- understand true cost efficiency at the program level
- validate whether spend is producing enrollments (not just leads)
- expose gaps in HubSpot migration data quality
- reduce time-to-decision from hours/days → minutes

---

## Output Expectations

Final application should include:

- Unified Program Performance Dashboard with 3 tabs
- Expanded program table with ROI cost metrics
- Drilldown program detail view with ROI calculator
- Scorecard tab integrated
- HubSpot-ready architecture (Phase 2 integration)

---

---

# Functional Requirements + Acceptance Criteria

## Project: Unified Program Performance Dashboard + Scorecard + ROI Engine

### Purpose

Create a unified dashboard experience that enables Bisk leadership and marketing teams to make **faster, more accurate program investment decisions** using funnel performance, cost efficiency, and ROI indicators.

---

# 1. Navigation & Layout Requirements

## 1.1 Dashboard Tab Structure

### Requirement

The Program Performance Dashboard must contain **three tabs**:

1. Dashboard
2. Recommended Verdict
3. Scorecard (new tab)

### Acceptance Criteria

- The Scorecard tab appears as the third tab.
- Tab switching does not reload the entire application (smooth SPA behavior preferred).
- Current Recommended Verdict functionality remains unchanged.

---

# 2. Program Table Enhancements

## 2.1 Program Table New ROI Cost Columns

### Requirement

Add the following calculated metrics as columns to each program row:

- Cost Per Lead (CPL)
- Cost Per Opportunity (CPO)
- Cost Per Application (CPA)
- Cost Per Enrollment (CPE)

### Formula Rules

Each metric should calculate as:

- CPL = Marketing Spend / Leads
- CPO = Marketing Spend / Opportunities
- CPA = Marketing Spend / Applications
- CPE = Marketing Spend / Enrollments

### Acceptance Criteria

- All 4 metrics appear as columns in the program table.
- Values are numeric and formatted as currency.
- If denominator = 0, show “—” or “N/A” (never show infinity or crash).
- Columns are sortable.
- Rows can be filtered by these values (basic filtering acceptable in Phase 1).

---

## 2.2 Table Sorting & Filtering

### Requirement

The program table must support sorting by all ROI metrics.

### Acceptance Criteria

- Clicking a column header sorts ascending/descending.
- Sorting persists until user changes it.
- Sorting does not break pagination or scrolling.

---

# 3. Scorecard Integration (EOS Tab)

## 3.1 Scorecard Tab UI

### Requirement

The Scorecard tab should replicate the EOS-style scorecard experience currently used by Marketing.

It must include:

- Executive Snapshot (metrics on track / off track / flagged)
- Leading indicator table
- Lagging indicator table
- Weekly pacing summary
- Trend charts (8-week performance)

### Acceptance Criteria

- Scorecard tab loads successfully from the Program Performance Dashboard.
- Scorecard metrics display with current week + last week comparisons.
- Indicators show On Track / Off Track status.
- At least one trend visualization exists (line chart or bar chart).

---

## 3.2 Scorecard Metric Grouping

### Requirement

Scorecard metrics must be grouped into:

- Leading Indicators
- Lagging Indicators

### Acceptance Criteria

- Leading and Lagging tables are visually separated.
- Each metric includes: current value, last week, WoW delta, target, status.

---

# 4. Drilldown Program Detail View

## 4.1 Row Click Drilldown

### Requirement

Clicking a program row must open a drilldown view showing detailed performance insights.

### Acceptance Criteria

- Clicking a program row opens a new view (modal or dedicated page).
- Drilldown includes program name, school, program type.
- User can easily return to the program list without losing sorting/filter state.

---

## 4.2 Drilldown Performance Details

### Requirement

The drilldown view must display deeper performance insights, including:

- Funnel stage counts
- Funnel conversion rates
- Trend performance over time
- Cost metrics over time (if possible)

### Acceptance Criteria

- Funnel stages displayed: Visitors → Leads/Inquiries → Opportunities → Applications → Enrollments
- Conversion % displayed between each stage
- At least one trend chart exists (last 8 weeks preferred)
- All displayed values match underlying dataset

---

# 5. ROI Calculator + Budget Recommendation Engine

## 5.1 ROI Calculator Module

### Requirement

Each program drilldown view must contain an ROI calculator that compares spend to outcomes.

Must allow:

- Marketing spend input (editable or pulled from dataset)
- Enrollment outcomes input (auto)
- Cost efficiency calculation
- ROI calculation (basic)

### Suggested ROI Outputs

- Cost per Enrollment
- Total Enrollment Value (optional)
- Net ROI / Efficiency Score

### Acceptance Criteria

- ROI calculator appears on drilldown view.
- Spend can be modified (manual override).
- Calculations update immediately after change.
- Outputs are clearly labeled.

---

## 5.2 Budget Allocation Recommendations

### Requirement

System should generate a recommended action label per program:

- Increase Spend
- Hold Spend
- Reduce Spend
- Pause / Investigate

Recommendation should be based on ROI indicators (even if simple in Phase 1).

### Acceptance Criteria

- Every program receives a recommendation label.
- Recommendation logic is transparent (tooltip or “why” section).
- Recommendation updates when spend input changes (if calculator is adjusted).

---

# 6. Data Architecture & Source Requirements

## 6.1 Phase 1 Data Source (Fixed Dataset)

### Requirement

Phase 1 must work fully using the existing fixed dataset currently powering the dashboard.

### Acceptance Criteria

- Application runs without HubSpot API dependency.
- All ROI metrics and scorecard metrics compute correctly using fixed dataset.

---

## 6.2 Phase 2 HubSpot API Integration

### Requirement

The architecture must be designed so that the data layer can later be replaced by HubSpot API feeds.

HubSpot data must support:

- funnel stage counts
- program-level attribution
- marketing spend association (or mapping mechanism)

### Acceptance Criteria

- Data fetching logic is abstracted into a service/module.
- A “mock data provider” can be swapped with “HubSpot provider.”
- Minimal UI changes required when switching data sources.

---

# 7. Migration Data Quality + Completeness Indicators

## 7.1 Data Completeness Flagging

### Requirement

Each program must show a data quality indicator reflecting completeness.

Example statuses:

- Complete
- Partial
- Missing / Unreliable

### Acceptance Criteria

- Each program row shows a data completeness badge.
- Drilldown view shows which fields are missing.
- If missing key metrics, ROI calculation gracefully degrades.

---

## 7.2 Migration Weakness Exposure

### Requirement

The dashboard should not hide incomplete data. Instead, it should surface it clearly as a signal of migration gaps.

### Acceptance Criteria

- Programs missing key funnel stages are flagged.
- Programs missing spend attribution are flagged.
- Users can filter to view only incomplete programs.

---

# 8. Performance & Usability Requirements

## 8.1 Load Time

### Requirement

Dashboard must load within acceptable speed for decision-making.

### Acceptance Criteria

- Initial load completes in < 3 seconds using fixed dataset (target).
- Table scrolling does not lag significantly.
- Drilldown opens in < 1 second (target).

---

## 8.2 Responsiveness

### Requirement

Dashboard must render cleanly on standard laptop resolutions.

### Acceptance Criteria

- Works at 1440px wide and 1920px wide.
- No major layout breaking at 1280px.

---

# 9. Reporting & Export (Optional but Recommended)

## 9.1 Export Program Table

### Requirement

Allow exporting the program table to CSV.

### Acceptance Criteria

- Export includes all visible columns including ROI metrics.
- Export respects filters/sorting.

---

# 10. Out of Scope (For Now)

To prevent scope explosion, the following are explicitly out of scope unless later requested:

- Full predictive modeling of future enrollments
- Automated spend attribution logic if HubSpot data does not support it
- Multi-touch attribution modeling
- Machine learning scoring beyond simple weighted rules
- User permissions / role-based access control

---

# 11. Definition of Done

Project is considered complete when:

- Scorecard is integrated as a third tab
- ROI cost metrics are visible and accurate per program row
- Program drilldown exists and works
- ROI calculator exists in drilldown
- Recommendations display per program
- System supports fixed dataset now and is architected for HubSpot API later
- Data completeness indicators are present

---

# Suggested Technical Implementation Notes (Helpful for Cascade)

- Use modular “Data Provider” architecture:
    - FixedDataProvider (Phase 1)
    - HubSpotDataProvider (Phase 2)
- Keep calculations centralized in a single metrics engine file/module
- Use defensive programming for missing denominators (0/null)
- Keep ROI calculator state isolated per program
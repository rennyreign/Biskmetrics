# Program Performance Dashboard - Brief

## Overview
A single-screen analytics dashboard designed for Marketing & Enrollment leadership at BISK to compare program performance across multiple schools, degrees, and certificates.

**Data Window:** January 1 – December 3, 2025 (static snapshot)

---

## Key Features

### 1. Filtering & Segmentation
- **School Filter:** View data for specific institutions (MSU, SMU, USF, Emory ECE, Emory GBS, ECSU, KEEP) or all schools combined
- **Level Filter:** Toggle between Certificates, Degrees, or view all programs
- **Dynamic Summary:** Real-time count of filtered programs displayed

### 2. Dual View Modes

#### Table View
- Sortable columns for all metrics (click any header to sort)
- Visual badges for top performers (top 3 in Lead to Enrollment Rate)
- Color-coded level chips (Certificate vs. Degree)
- Clean, spreadsheet-style layout with hover states

#### Graph View
Three interactive chart types:
- **Leads Volume:** Horizontal bar chart showing top 15 programs by lead count, color-coded by school
- **Conversion Rates:** Grouped bar chart comparing Lead to Enrollment, Application Rate, and Enrollment Rate
- **Volume vs Conversion:** Scatter plot revealing the relationship between lead volume and conversion performance

### 3. Metrics Tracked
- Leads (volume)
- Contact to Application Rate
- Application Rate
- Enrollment Rate
- Contact to Enrollment Rate
- Inquiry to Enrollment Rate (SMU certificates)
- Lead to Enrollment Rate

---

## User Tasks Supported

1. **Quick Comparison:** Instantly compare programs within a school or across all schools
2. **Performance Ranking:** Identify top and bottom performers based on any metric
3. **Volume Analysis:** See which programs are driving the most leads
4. **Conversion Analysis:** Discover which programs excel at converting leads despite lower volume
5. **Opportunity Identification:** Find weak spots and high-potential programs

---

## Design & Branding

- **Header:** BISK branded with dark navy background (#2c3e50) and pink accent (#e91e63)
- **Base:** Clean white cards on light gray background
- **UI Framework:** Material-UI components for professional, enterprise-grade interface
- **Accent Color:** Pink (#e91e63) used for active states, sorting indicators, and CTAs
- **Typography:** Clear hierarchy with bold program names and subdued metrics

---

## Technical Stack

- **Framework:** React with TypeScript
- **UI Library:** Material-UI (MUI)
- **Charts:** Recharts for data visualization
- **Icons:** Lucide React
- **State Management:** React hooks (useState, useMemo)
- **Data:** Mock data (24+ programs across 7 schools)

---

## Empty States

- Friendly "No programs found" message when filters return no results
- Option to clear filters and reset view

---

## Responsive Design

- Desktop-first approach (optimized for 1440px)
- Flexible layout adapts to tablet and smaller screens
- Horizontal scrolling enabled for tables on narrow viewports

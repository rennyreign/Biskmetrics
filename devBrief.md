## 2️⃣ ENGINEERING BRIEF (FOR WINDSURF / DEV AGENT)

**Project:** Program Performance Dashboard (Static Data)

**Design Source:** Figma file provided by UX.

**Goal:** Implement the dashboard as a **simple front-end app with static data**, no backend, no API calls.

---

### 1. Tech Stack & Output

Use whichever is most convenient in Windsurf, but **one of:**

- **Preferred:** React (JS or TS) + CSS.
- **Alternative:** Single static `index.html` with inline JS.

Assume this will be hosted as a **static asset** (no server logic).

Deliver:

- A small set of files that can be dropped into a basic React/Vite app or served as static HTML:
    - React: `App.jsx`/`App.tsx` + `data.ts`/`data.js` + CSS.
    - Vanilla: `index.html` including `<style>` + `<script>`.

---

### 2. Data Model

The data is **fixed** and comes from the program tables provided (MSU, SMU, USF, Emory ECE, Emory GBS, ECSU, KEEP — Certificates + Degrees).

Define a type like:

```tsx
type ProgramLevel = "Certificate" | "Degree";

type SchoolId =
  | "MSU"
  | "SMU"
  | "USF"
  | "Emory ECE"
  | "Emory GBS"
  | "ECSU"
  | "KEEP";

interface ProgramRecord {
  school: SchoolId;
  level: ProgramLevel;
  programName: string;
  leads: number;

  contactToApplicationRate?: number | null;
  applicationRate?: number | null;
  enrollmentRate?: number | null;
  contactToEnrollmentRate?: number | null;
  inquiryToEnrollmentRate?: number | null;
  leadToEnrollmentRate?: number | null;
}

```

**Rules:**

- Use **exact values** from the tables.
- If a cell is **blank or “—”**, store as `null`.
- Do **not recalculate** any metrics; trust the provided percentages.

You can keep the data in a `const programs: ProgramRecord[] = [...]` in a separate file or same file, your choice.

---

### 3. Filtering Logic

Two filters:

1. **School filter**
    - Values:
        - `"ALL"` (default)
        - `"MSU"`, `"SMU"`, `"USF"`, `"Emory ECE"`, `"Emory GBS"`, `"ECSU"`, `"KEEP"`
    - Behavior:
        - `"ALL"` → don’t filter by school.
        - Otherwise → only rows where `record.school` matches.
2. **Level filter**
    - Values:
        - `"ALL"` (default)
        - `"Certificate"`, `"Degree"`
    - Behavior:
        - `"ALL"` → no level filter.
        - Otherwise → filter by `record.level`.

**Filtered list:**

```tsx
const filteredPrograms = programs
  .filter(applySchoolFilter)
  .filter(applyLevelFilter);

```

If `filteredPrograms` is empty → show the “No programs found for this filter combination.” message as per UX design.

---

### 4. Sorting Logic

We need **sortable columns**, default sorted by **Leads (descending)**.

State to track:

```tsx
type SortColumn =
  | "programName"
  | "school"
  | "level"
  | "leads"
  | "contactToApplicationRate"
  | "applicationRate"
  | "enrollmentRate"
  | "contactToEnrollmentRate"
  | "inquiryToEnrollmentRate"
  | "leadToEnrollmentRate";

type SortDirection = "asc" | "desc";

const [sortColumn, setSortColumn] = ...
const [sortDirection, setSortDirection] = ...

```

Interaction:

- On first click on a column header:
    - Set `sortColumn` to that column.
    - Default direction to `"desc"` for numeric columns; `"asc"` for text (program name).
- On second click, toggle asc/desc.
- Display sort indicator (↑/↓) based on `sortDirection`.

Sorting behavior:

- Treat percentage fields as **numeric values** (e.g. 4.2% → `4.2`).
- `null` values in the sorted column should always sort to the **bottom** (regardless of asc/desc).

Implementation note (for numeric):

```tsx
function compareNullableNumbers(a: number | null | undefined, b: number | null | undefined, direction: SortDirection) {
  if (a == null && b == null) return 0;
  if (a == null) return 1; // a goes after b
  if (b == null) return -1;
  return direction === "asc" ? a - b : b - a;
}

```

---

### 5. Display / Formatting

**Leads**

- Display as integers with thousands separators.
    - Use `toLocaleString()`.

**Percentages**

- Values already exist as percentages conceptually (e.g., 4.2).
- Display with **one decimal place** and a `%` sign.
    - `value.toFixed(1) + "%"`.

**Missing values**

- If `null` or `undefined`, render as `—`.

**School column visibility**

- When School filter = `"ALL"`:
    - Show `School` column.
- When School filter is a specific school:
    - You *may* hide the School column per design. If you keep it, it will just repeat the same value, which is harmless.

Follow the Figma spec for exact behavior (if it specifies one).

---

### 6. Layout & Styling

Follow Figma, but core pieces:

- Main container centered, max-width ~1200px.
- Header with title + subtitle.
- Filter row above table:
    - `<select>` for school.
    - `<select>` for level.
- Table:
    - Header row, body rows, hover state.
    - Optional “Top performer” visual if UX provided.

You can implement styles via:

- Plain CSS file (e.g., `App.css`).
- BEM-like class names or simple utility approach.

No need for CSS frameworks unless you prefer something minimal and local.

---

### 7. Responsiveness

Make it usable at:

- Desktop widths (~1200–1440 px).
- Tablet (~768–1024 px):
    - Filters may wrap to two lines.
    - Table can scroll horizontally if needed.
- Mobile:
    - Horizontal scroll for the table is acceptable.
    - Ensure filters stack vertically.

We’re not chasing pixel-perfect mobile, just “not broken”.

---

### 8. Testing Scenarios

Please verify:

1. **Default view**
    - School = All
    - Level = All
    - Sorted by Leads desc.
2. **MSU Certificates**
    - School = MSU
    - Level = Certificates
    - Confirm that only MSU cert programs appear.
3. **MSU Degrees**
4. **SMU Certificates**
5. **USF Degrees**
6. **Emory ECE Certificates**
7. **Emory GBS Certificates**
8. **ECSU Degrees**
9. **KEEP Certificates**
10. **All Schools + Degrees**
    - School = All, Level = Degrees.
11. Sort interactions:
    - Click `Lead to Enrollment Rate` to see highest conversion programs at top.
    - Click `Program` to sort alphabetically.
    - Confirm `null` metrics go to the bottom when sorting on that metric.

---

If you want, I can next:

- Turn this into a **prompt template** you can paste straight into Windsurf for the dev agent, and another that’s tailored to Figma/Make for the design agent
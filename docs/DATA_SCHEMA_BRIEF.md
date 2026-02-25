# Biskmetrics Data Schema & Integration Brief

**Version:** 1.0  
**Date:** February 25, 2026  
**Purpose:** Define the database schema and data integration requirements to power the Biskmetrics Performance Dashboard with real data from HubSpot and marketing channels.

---

## Executive Summary

The Biskmetrics dashboard requires two primary data domains:
1. **Program Performance Metrics** - Marketing funnel, ROI, and investment recommendations
2. **EOS Scorecard Metrics** - Weekly operational metrics tracked by pipeline (Degree/Certificate)

**Primary Data Sources:**
- HubSpot CRM (contacts, deals, lifecycle stages)
- Marketing channels (Google Ads, Meta Ads, LinkedIn Ads, etc.)
- Financial/spend tracking systems

---

## 1. Program Performance Schema

### 1.1 Core Program Table

**Table:** `programs`

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique program identifier | Generated |
| `school_id` | VARCHAR(50) | School code (MSU, SMU, USF, etc.) | Manual/Config |
| `program_name` | VARCHAR(255) | Full program name | Manual/Config |
| `level` | ENUM('Certificate', 'Degree') | Program level | Manual/Config |
| `is_active` | BOOLEAN | Whether program is currently active | Manual/Config |
| `created_at` | TIMESTAMP | Record creation date | System |
| `updated_at` | TIMESTAMP | Last update timestamp | System |

**HubSpot Mapping:**
- Programs should be tracked as a custom property on Deals or Contacts
- Recommended: Create custom property `program_id` or `program_name` in HubSpot

---

### 1.2 Funnel Metrics Table

**Table:** `program_funnel_metrics`

Tracks daily/weekly snapshots of funnel stage counts per program.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique record ID | Generated |
| `program_id` | UUID | Foreign key to programs | - |
| `date` | DATE | Snapshot date | System |
| `period_type` | ENUM('daily', 'weekly', 'monthly') | Aggregation period | System |
| `visitors` | INTEGER | Website visitors (optional) | Google Analytics |
| `inquiries` | INTEGER | Total inquiries/leads | HubSpot |
| `opportunities` | INTEGER | Qualified opportunities | HubSpot |
| `applications` | INTEGER | Submitted applications | HubSpot |
| `enrollments` | INTEGER | Confirmed enrollments | HubSpot |
| `created_at` | TIMESTAMP | Record creation | System |

**HubSpot Mapping:**
- `inquiries`: Contacts with lifecycle stage = "Lead" or "MQL"
- `opportunities`: Contacts with lifecycle stage = "Opportunity" or "SQL"
- `applications`: Contacts with lifecycle stage = "Application Submitted"
- `enrollments`: Contacts with lifecycle stage = "Customer" or "Enrolled"

**Required HubSpot Properties:**
- `lifecyclestage` (standard property)
- `program_id` or `program_name` (custom property)
- `createdate` (standard property)

**Query Logic:**
```sql
-- Example: Get inquiries for a program in a date range
SELECT COUNT(DISTINCT contact_id) as inquiries
FROM hubspot_contacts
WHERE program_id = 'msu-1'
  AND lifecyclestage IN ('Lead', 'MQL')
  AND createdate BETWEEN '2025-01-01' AND '2025-12-31'
```

---

### 1.3 Marketing Spend Table

**Table:** `program_marketing_spend`

Tracks daily spend by program and channel.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique record ID | Generated |
| `program_id` | UUID | Foreign key to programs | - |
| `date` | DATE | Spend date | Marketing Platform |
| `channel` | VARCHAR(50) | Marketing channel (Google Ads, Meta, LinkedIn, etc.) | Marketing Platform |
| `spend_amount` | DECIMAL(10,2) | Daily spend in USD | Marketing Platform |
| `impressions` | INTEGER | Ad impressions | Marketing Platform |
| `clicks` | INTEGER | Ad clicks | Marketing Platform |
| `created_at` | TIMESTAMP | Record creation | System |

**Marketing Channel Sources:**
- **Google Ads**: Google Ads API
- **Meta Ads**: Meta Marketing API (Facebook/Instagram)
- **LinkedIn Ads**: LinkedIn Marketing API
- **Other channels**: Manual upload or API integration

**Required Setup:**
- UTM parameters or campaign naming convention to map spend to programs
- Recommended format: `{school}_{program_level}_{program_name}`
- Example: `MSU_Degree_DataScience`

---

### 1.4 Conversion Metrics (Calculated)

**Table:** `program_conversion_metrics`

Pre-calculated conversion rates for performance optimization.

| Column | Type | Description | Calculation |
|--------|------|-------------|-------------|
| `id` | UUID | Unique record ID | Generated |
| `program_id` | UUID | Foreign key to programs | - |
| `date` | DATE | Calculation date | System |
| `period_type` | ENUM('daily', 'weekly', 'monthly') | Aggregation period | System |
| `inquiry_to_opportunity_rate` | DECIMAL(5,2) | % conversion | (opportunities / inquiries) * 100 |
| `opportunity_to_application_rate` | DECIMAL(5,2) | % conversion | (applications / opportunities) * 100 |
| `application_to_enrollment_rate` | DECIMAL(5,2) | % conversion | (enrollments / applications) * 100 |
| `lead_to_enrollment_rate` | DECIMAL(5,2) | % conversion | (enrollments / inquiries) * 100 |
| `created_at` | TIMESTAMP | Record creation | System |

**Calculation Frequency:** Daily batch job or real-time trigger

---

### 1.5 ROI Metrics (Calculated)

**Table:** `program_roi_metrics`

Pre-calculated cost-per-stage metrics.

| Column | Type | Description | Calculation |
|--------|------|-------------|-------------|
| `id` | UUID | Unique record ID | Generated |
| `program_id` | UUID | Foreign key to programs | - |
| `date` | DATE | Calculation date | System |
| `period_type` | ENUM('daily', 'weekly', 'monthly') | Aggregation period | System |
| `cost_per_lead` | DECIMAL(10,2) | Cost per inquiry | total_spend / inquiries |
| `cost_per_opportunity` | DECIMAL(10,2) | Cost per opportunity | total_spend / opportunities |
| `cost_per_application` | DECIMAL(10,2) | Cost per application | total_spend / applications |
| `cost_per_enrollment` | DECIMAL(10,2) | Cost per enrollment | total_spend / enrollments |
| `total_spend` | DECIMAL(10,2) | Total spend for period | SUM(spend_amount) |
| `created_at` | TIMESTAMP | Record creation | System |

---

### 1.6 Investment Recommendations Table

**Table:** `program_recommendations`

Stores AI/rule-based investment recommendations.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique record ID | Generated |
| `program_id` | UUID | Foreign key to programs | - |
| `date` | DATE | Recommendation date | System |
| `action` | ENUM('increase', 'hold', 'reduce', 'pause') | Recommended action | Algorithm |
| `confidence` | ENUM('high', 'medium', 'low') | Confidence level | Algorithm |
| `reasoning` | TEXT | Explanation for recommendation | Algorithm |
| `suggested_spend_change` | DECIMAL(5,2) | % change suggested | Algorithm |
| `created_at` | TIMESTAMP | Record creation | System |

**Recommendation Algorithm Inputs:**
- Cost per enrollment trend
- Lead-to-enrollment conversion rate
- Spend efficiency vs. benchmarks
- Enrollment volume vs. targets
- Historical performance trends

---

## 2. EOS Scorecard Schema

### 2.1 Scorecard Metrics Definition Table

**Table:** `eos_metrics`

Defines the metrics tracked in the EOS Scorecard.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique metric ID | Generated |
| `name` | VARCHAR(255) | Metric name | Manual/Config |
| `category` | ENUM('leading', 'lagging') | Metric category | Manual/Config |
| `pipeline` | ENUM('degree', 'certificate') | Pipeline type | Manual/Config |
| `owner` | VARCHAR(100) | Metric owner name | Manual/Config |
| `unit` | VARCHAR(20) | Unit of measurement ($, %, count) | Manual/Config |
| `target` | DECIMAL(10,2) | Target value | Manual/Config |
| `is_cost_metric` | BOOLEAN | Whether lower is better | Manual/Config |
| `sort_order` | INTEGER | Display order | Manual/Config |
| `is_active` | BOOLEAN | Whether metric is active | Manual/Config |
| `created_at` | TIMESTAMP | Record creation | System |
| `updated_at` | TIMESTAMP | Last update | System |

**Example Metrics:**
- **Leading (Degree):** Visitors, Inquiries, Opportunities, Applications
- **Leading (Certificate):** Visitors, Inquiries, Opportunities, Applications
- **Lagging (Degree):** Enrollments, Cost per Lead, Cost per Enrollment
- **Lagging (Certificate):** Enrollments, Cost per Lead, Cost per Enrollment

---

### 2.2 Scorecard Weekly Values Table

**Table:** `eos_metric_values`

Stores weekly actual values for each metric.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique record ID | Generated |
| `metric_id` | UUID | Foreign key to eos_metrics | - |
| `week_start_date` | DATE | Monday of the week | System |
| `current_value` | DECIMAL(10,2) | Current week value | HubSpot/Marketing |
| `last_week_value` | DECIMAL(10,2) | Previous week value | Calculated |
| `four_week_avg` | DECIMAL(10,2) | 4-week rolling average | Calculated |
| `wow_delta` | DECIMAL(5,2) | Week-over-week % change | Calculated |
| `status` | ENUM('green', 'red') | On/off track status | Calculated |
| `green_streak` | INTEGER | Consecutive green weeks | Calculated |
| `red_streak` | INTEGER | Consecutive red weeks | Calculated |
| `ids_flagged` | BOOLEAN | Whether flagged for IDS | Calculated (red_streak >= 2) |
| `created_at` | TIMESTAMP | Record creation | System |
| `updated_at` | TIMESTAMP | Last update | System |

**Data Sources by Metric Type:**

| Metric | Source | HubSpot Query/API |
|--------|--------|-------------------|
| Visitors | Google Analytics | GA4 API |
| Inquiries | HubSpot | Count contacts created with lifecycle = "Lead" |
| Opportunities | HubSpot | Count contacts with lifecycle = "Opportunity" |
| Applications | HubSpot | Count contacts with lifecycle = "Application Submitted" |
| Enrollments | HubSpot | Count contacts with lifecycle = "Customer" |
| Cost per Lead | Calculated | total_spend / inquiries |
| Cost per Enrollment | Calculated | total_spend / enrollments |

---

### 2.3 IDS (Identify, Discuss, Solve) Table

**Table:** `eos_ids_actions`

Tracks IDS items for flagged metrics.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique record ID | Generated |
| `metric_id` | UUID | Foreign key to eos_metrics | - |
| `week_start_date` | DATE | Week when flagged | System |
| `hypothesis` | TEXT | Root cause hypothesis | Manual |
| `action` | TEXT | Corrective action plan | Manual |
| `status` | ENUM('open', 'in_progress', 'resolved') | Action status | Manual |
| `resolved_date` | DATE | Date resolved | Manual |
| `created_at` | TIMESTAMP | Record creation | System |
| `updated_at` | TIMESTAMP | Last update | System |

---

### 2.4 Scorecard Trend Data Table

**Table:** `eos_trend_data`

Stores 8-week trend data for charts.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `id` | UUID | Unique record ID | Generated |
| `pipeline` | ENUM('degree', 'certificate') | Pipeline type | - |
| `week_start_date` | DATE | Monday of the week | System |
| `cost_per_lead` | DECIMAL(10,2) | Weekly CPL | Calculated |
| `visitor_to_inquiry_rate` | DECIMAL(5,2) | Conversion % | Calculated |
| `visitors` | INTEGER | Total visitors | Google Analytics |
| `inquiries` | INTEGER | Total inquiries | HubSpot |
| `opportunities` | INTEGER | Total opportunities | HubSpot |
| `applications` | INTEGER | Total applications | HubSpot |
| `created_at` | TIMESTAMP | Record creation | System |

---

## 3. HubSpot Integration Requirements

### 3.1 Required HubSpot Objects

1. **Contacts** (Standard Object)
   - Primary object for tracking leads through the funnel
   
2. **Deals** (Standard Object) - Optional
   - Can be used to track program-specific opportunities
   
3. **Custom Properties Needed:**

| Property Name | Object | Type | Purpose |
|--------------|--------|------|---------|
| `program_id` | Contact | Single-line text | Link contact to program |
| `program_name` | Contact | Single-line text | Human-readable program name |
| `school` | Contact | Dropdown | School affiliation |
| `program_level` | Contact | Dropdown | Certificate or Degree |
| `application_date` | Contact | Date | When application submitted |
| `enrollment_date` | Contact | Date | When enrolled |

### 3.2 HubSpot API Endpoints Required

1. **Contacts API**
   - `GET /crm/v3/objects/contacts` - Fetch contacts with filters
   - `GET /crm/v3/objects/contacts/search` - Search contacts by criteria
   
2. **Properties API**
   - `GET /crm/v3/properties/contacts` - List all contact properties
   
3. **Analytics API** (if available)
   - Custom reports for funnel metrics

### 3.3 HubSpot Lifecycle Stage Mapping

| Dashboard Stage | HubSpot Lifecycle Stage | Notes |
|-----------------|------------------------|-------|
| Inquiries | Lead, MQL | Initial contact/form submission |
| Opportunities | Opportunity, SQL | Qualified and engaged |
| Applications | Custom: "Application Submitted" | Needs custom stage |
| Enrollments | Customer | Final conversion |

**Action Required:** Create custom lifecycle stage "Application Submitted" in HubSpot

---

## 4. Marketing Channel Integration

### 4.1 Google Ads Integration

**API:** Google Ads API v14+

**Required Metrics:**
- Campaign-level spend by day
- Impressions, clicks, conversions
- Campaign naming must include program identifier

**Campaign Naming Convention:**
```
{School}_{Level}_{Program}_{Channel}_{CampaignType}
Example: MSU_Degree_DataScience_Search_Brand
```

**API Endpoints:**
- `GoogleAdsService.SearchStream` - Query campaign performance
- Filter by campaign name pattern matching

### 4.2 Meta Ads Integration

**API:** Meta Marketing API (Graph API)

**Required Metrics:**
- Ad account spend by day
- Campaign-level performance
- Campaign naming must include program identifier

**Campaign Naming Convention:** Same as Google Ads

**API Endpoints:**
- `/act_{ad_account_id}/insights` - Campaign insights
- Filter by campaign name

### 4.3 LinkedIn Ads Integration

**API:** LinkedIn Marketing API

**Required Metrics:**
- Campaign spend by day
- Impressions, clicks, conversions
- Campaign naming must include program identifier

**Campaign Naming Convention:** Same as Google Ads

### 4.4 Other Channels

For channels without API access:
- Manual CSV upload interface
- Required columns: date, program_id, channel, spend, impressions, clicks

---

## 5. Data Pipeline Architecture

### 5.1 ETL Process Flow

```
┌─────────────────┐
│   Data Sources  │
├─────────────────┤
│ HubSpot API     │──┐
│ Google Ads API  │  │
│ Meta Ads API    │  ├──► ┌──────────────┐
│ LinkedIn API    │  │    │ ETL Service  │
│ Google Analytics│──┘    │ (Airflow/    │
└─────────────────┘       │  n8n/Zapier) │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  PostgreSQL  │
                          │   Database   │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  REST API    │
                          │  (Backend)   │
                          └──────┬───────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  Dashboard   │
                          │  (Frontend)  │
                          └──────────────┘
```

### 5.2 Recommended ETL Schedule

| Data Type | Frequency | Timing |
|-----------|-----------|--------|
| HubSpot contacts | Hourly | Every hour |
| Marketing spend | Daily | 2 AM UTC |
| Conversion metrics | Daily | 3 AM UTC |
| ROI calculations | Daily | 4 AM UTC |
| Recommendations | Weekly | Monday 6 AM UTC |
| EOS metrics | Weekly | Monday 8 AM UTC |

### 5.3 Data Retention Policy

- **Raw data:** Retain indefinitely
- **Calculated metrics:** Retain 24 months
- **Recommendations:** Retain 12 months
- **Archived programs:** Retain 36 months

---

## 6. Database Technology Recommendations

### Option 1: PostgreSQL (Recommended)
- **Pros:** Open-source, robust, excellent for analytics, JSON support
- **Cons:** Requires server management
- **Best for:** Self-hosted or cloud-managed (AWS RDS, Google Cloud SQL)

### Option 2: Supabase (PostgreSQL + APIs)
- **Pros:** Managed PostgreSQL, built-in REST API, real-time subscriptions
- **Cons:** Vendor lock-in
- **Best for:** Rapid development, minimal DevOps

### Option 3: MySQL
- **Pros:** Widely supported, good performance
- **Cons:** Less robust for complex analytics
- **Best for:** Existing MySQL infrastructure

---

## 7. API Backend Requirements

### 7.1 Required Endpoints

**Program Performance:**
```
GET  /api/programs                    # List all programs
GET  /api/programs/:id                # Get program details
GET  /api/programs/:id/funnel         # Get funnel metrics
GET  /api/programs/:id/roi            # Get ROI metrics
GET  /api/programs/:id/trends         # Get historical trends
GET  /api/programs/:id/recommendation # Get latest recommendation
```

**EOS Scorecard:**
```
GET  /api/scorecard/metrics           # List all metrics
GET  /api/scorecard/metrics/:id       # Get metric details
GET  /api/scorecard/values            # Get weekly values (filtered by date/pipeline)
POST /api/scorecard/values            # Create/update weekly value
PUT  /api/scorecard/metrics/:id       # Update metric definition
POST /api/scorecard/metrics           # Create new metric
DELETE /api/scorecard/metrics/:id     # Delete metric

GET  /api/scorecard/summary           # Get executive summary
GET  /api/scorecard/trends            # Get 8-week trend data
GET  /api/scorecard/ids               # Get IDS flagged items
POST /api/scorecard/ids               # Create IDS action
PUT  /api/scorecard/ids/:id           # Update IDS action
```

### 7.2 Authentication

- **Recommended:** OAuth 2.0 with JWT tokens
- **Roles:** Admin, Manager, Viewer
- **Permissions:** CRUD operations based on role

---

## 8. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up PostgreSQL database
- [ ] Create core tables (programs, funnel_metrics, marketing_spend)
- [ ] Build basic REST API
- [ ] Implement HubSpot contact sync

### Phase 2: Marketing Integration (Weeks 3-4)
- [ ] Integrate Google Ads API
- [ ] Integrate Meta Ads API
- [ ] Integrate LinkedIn Ads API
- [ ] Build spend aggregation pipeline

### Phase 3: Calculations (Week 5)
- [ ] Implement conversion rate calculations
- [ ] Implement ROI calculations
- [ ] Build recommendation algorithm
- [ ] Create daily batch jobs

### Phase 4: EOS Scorecard (Weeks 6-7)
- [ ] Create EOS metric tables
- [ ] Build weekly value sync
- [ ] Implement status calculations
- [ ] Build IDS tracking

### Phase 5: Dashboard Integration (Week 8)
- [ ] Connect frontend to API
- [ ] Replace mock data with real data
- [ ] Test end-to-end data flow
- [ ] User acceptance testing

---

## 9. Data Quality & Validation

### 9.1 Required Validations

1. **Program Mapping:**
   - Every HubSpot contact must have valid `program_id`
   - Every marketing campaign must map to a program

2. **Funnel Logic:**
   - Enrollments ≤ Applications ≤ Opportunities ≤ Inquiries
   - Dates must be sequential (inquiry → opportunity → application → enrollment)

3. **Spend Data:**
   - No negative spend values
   - Daily spend must match platform totals
   - Missing days should be flagged

4. **Conversion Rates:**
   - All rates must be between 0-100%
   - Rates > 100% indicate data quality issue

### 9.2 Data Quality Monitoring

Create alerts for:
- Missing program mappings (>5% of contacts)
- Spend data gaps (>1 day missing)
- Funnel logic violations
- Conversion rate anomalies (>50% change week-over-week)

---

## 10. Security & Compliance

### 10.1 Data Privacy
- **PII Handling:** Do not store contact names, emails, or phone numbers in analytics database
- **Anonymization:** Use contact IDs only, not personal identifiers
- **GDPR/CCPA:** Implement data deletion workflows

### 10.2 API Security
- All API endpoints must require authentication
- Use HTTPS only
- Implement rate limiting
- Log all data access

### 10.3 HubSpot API Security
- Store API keys in environment variables or secrets manager
- Use OAuth 2.0 for HubSpot authentication
- Rotate API keys quarterly

---

## 11. Cost Estimates

### Database Hosting (PostgreSQL)
- **AWS RDS (db.t3.medium):** ~$100/month
- **Google Cloud SQL:** ~$120/month
- **Supabase Pro:** $25/month (up to 8GB)

### API Hosting
- **AWS Lambda + API Gateway:** ~$50-100/month
- **Heroku Standard:** ~$25/month
- **DigitalOcean App Platform:** ~$12/month

### ETL/Orchestration
- **Apache Airflow (self-hosted):** Server costs only
- **n8n Cloud:** $20/month
- **Zapier:** $20-50/month

**Total Estimated Monthly Cost:** $100-300/month

---

## 12. Next Steps

### Immediate Actions:
1. **Review & Approve Schema** - Validate with stakeholders
2. **Set Up HubSpot Custom Properties** - Create program_id, program_name fields
3. **Standardize Campaign Naming** - Implement naming convention across all channels
4. **Choose Database Platform** - PostgreSQL vs. Supabase vs. MySQL
5. **Assign Development Resources** - Internal team vs. external contractor

### Technical Prerequisites:
- [ ] HubSpot API access (Professional or Enterprise tier)
- [ ] Google Ads API access (Manager account)
- [ ] Meta Ads API access (Business Manager)
- [ ] LinkedIn Ads API access (Campaign Manager)
- [ ] Google Analytics 4 API access

### Documentation Needed:
- [ ] HubSpot property mapping guide
- [ ] Campaign naming convention guide
- [ ] API authentication setup guide
- [ ] ETL job monitoring procedures

---

## Appendix A: Sample SQL Queries

### Get Program Funnel Metrics for Date Range
```sql
SELECT 
  p.program_name,
  p.school_id,
  SUM(f.inquiries) as total_inquiries,
  SUM(f.opportunities) as total_opportunities,
  SUM(f.applications) as total_applications,
  SUM(f.enrollments) as total_enrollments,
  ROUND(SUM(f.enrollments)::numeric / NULLIF(SUM(f.inquiries), 0) * 100, 2) as lead_to_enrollment_rate
FROM programs p
JOIN program_funnel_metrics f ON p.id = f.program_id
WHERE f.date BETWEEN '2025-01-01' AND '2025-12-31'
  AND f.period_type = 'weekly'
GROUP BY p.id, p.program_name, p.school_id
ORDER BY total_enrollments DESC;
```

### Get Program ROI Metrics
```sql
SELECT 
  p.program_name,
  r.cost_per_lead,
  r.cost_per_enrollment,
  r.total_spend,
  f.enrollments,
  ROUND(r.total_spend / NULLIF(f.enrollments, 0), 2) as actual_cost_per_enrollment
FROM programs p
JOIN program_roi_metrics r ON p.id = r.program_id
JOIN program_funnel_metrics f ON p.id = f.program_id AND r.date = f.date
WHERE r.date = CURRENT_DATE - INTERVAL '1 day'
  AND r.period_type = 'daily'
ORDER BY r.cost_per_enrollment ASC;
```

### Get EOS Scorecard Weekly Summary
```sql
SELECT 
  m.name as metric_name,
  m.category,
  m.pipeline,
  m.owner,
  v.current_value,
  v.target,
  v.status,
  v.wow_delta,
  v.green_streak,
  v.red_streak,
  v.ids_flagged
FROM eos_metrics m
JOIN eos_metric_values v ON m.id = v.metric_id
WHERE v.week_start_date = date_trunc('week', CURRENT_DATE)
  AND m.is_active = true
ORDER BY m.sort_order;
```

---

## Appendix B: HubSpot API Example Queries

### Get Contacts by Lifecycle Stage and Program
```javascript
// Using HubSpot Node.js Client
const hubspot = require('@hubspot/api-client');
const hubspotClient = new hubspot.Client({ accessToken: 'YOUR_ACCESS_TOKEN' });

const getInquiriesByProgram = async (programId, startDate, endDate) => {
  const filter = {
    filters: [
      {
        propertyName: 'program_id',
        operator: 'EQ',
        value: programId
      },
      {
        propertyName: 'lifecyclestage',
        operator: 'IN',
        values: ['lead', 'marketingqualifiedlead']
      },
      {
        propertyName: 'createdate',
        operator: 'BETWEEN',
        value: startDate,
        highValue: endDate
      }
    ]
  };
  
  const response = await hubspotClient.crm.contacts.searchApi.doSearch({
    filterGroups: [filter],
    properties: ['program_id', 'lifecyclestage', 'createdate'],
    limit: 100
  });
  
  return response.total;
};
```

---

## Appendix C: Marketing API Integration Examples

### Google Ads API Query
```python
# Using Google Ads Python Client
from google.ads.googleads.client import GoogleAdsClient

def get_campaign_spend(client, customer_id, campaign_name_pattern, start_date, end_date):
    ga_service = client.get_service("GoogleAdsService")
    
    query = f"""
        SELECT
            campaign.name,
            metrics.cost_micros,
            metrics.impressions,
            metrics.clicks,
            segments.date
        FROM campaign
        WHERE campaign.name LIKE '%{campaign_name_pattern}%'
            AND segments.date BETWEEN '{start_date}' AND '{end_date}'
        ORDER BY segments.date
    """
    
    response = ga_service.search(customer_id=customer_id, query=query)
    
    results = []
    for row in response:
        results.append({
            'date': row.segments.date,
            'campaign': row.campaign.name,
            'spend': row.metrics.cost_micros / 1_000_000,  # Convert to dollars
            'impressions': row.metrics.impressions,
            'clicks': row.metrics.clicks
        })
    
    return results
```

---

## Contact & Support

**Questions about this brief?**
- Technical questions: Contact your development team lead
- Business questions: Contact product owner
- HubSpot setup: Contact HubSpot administrator

**Document Version Control:**
- Version 1.0: Initial release (February 25, 2026)
- Next review: March 25, 2026

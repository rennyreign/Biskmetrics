/**
 * EOS Scorecard Types
 */

export type MetricCategory = 'leading' | 'lagging';
export type MetricStatus = 'on-track' | 'off-track' | 'flagged';
export type PipelineType = 'degree' | 'certificate';

export interface ScorecardMetric {
  id: string;
  name: string;
  category: MetricCategory;
  owner: string;
  currentValue: number;
  lastWeekValue: number;
  fourWeekAvg: number;
  target: number;
  status: MetricStatus;
  streak: number; // Consecutive weeks on/off track (positive = on track, negative = off track)
  unit: 'currency' | 'percentage' | 'count';
  pipeline?: PipelineType;

  // IDS (Issues Discussion Solving) tracking
  idsDiscussion?: {
    hypothesis: string;
    actionPlan: string;
    flaggedDate: Date;
  };
}

export interface ScorecardWeek {
  weekOf: Date;
  metrics: ScorecardMetric[];
}

export interface ScorecardSummary {
  weekOf: Date;
  metricsOnTrack: number;
  metricsOffTrack: number;
  metricsFlagged: number;
  leadingIndicatorsOnTrack: number;
  leadingIndicatorsTotal: number;
  laggingIndicatorsOnTrack: number;
  laggingIndicatorsTotal: number;
}

export interface TrendDataPoint {
  week: string; // e.g., "Wk 1", "Wk 2"
  date: Date;
  value: number;
}

export interface ScorecardTrends {
  metricId: string;
  metricName: string;
  data: TrendDataPoint[];
}

export interface FunnelSnapshot {
  weekOf: Date;
  visitors: number;
  inquiries: number;
  opportunities: number;
  applications: number;
  enrollments?: number;
}

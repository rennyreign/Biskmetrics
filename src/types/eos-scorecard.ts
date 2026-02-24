export type Pipeline = 'degree' | 'certificate';
export type MetricCategory = 'leading' | 'lagging';
export type MetricStatus = 'green' | 'red';

export interface EOSMetric {
  id: string;
  name: string;
  category: MetricCategory;
  pipeline: Pipeline;
  owner: string;
  unit: string;
  target: number;
  isCostMetric: boolean;
  sortOrder: number;

  // Current week data
  currentValue: number;
  lastWeekValue: number;
  fourWeekAvg: number;

  // Calculated fields
  wowDelta: number;
  status: MetricStatus;
  greenStreak: number;
  redStreak: number;
  idsFlagged: boolean;

  // IDS fields (only if flagged)
  idsHypothesis?: string;
  idsAction?: string;
}

export interface ScorecardSummary {
  metricsOnTrack: number;
  metricsOffTrack: number;
  metricsFlagged: number;

  leadingOnTrack: number;
  leadingTotal: number;
  leadingPacingPercent: number;

  laggingOnTrack: number;
  laggingTotal: number;
  laggingPacingPercent: number;
}

export interface TrendData {
  weeks: string[];
  costPerLead: number[];
  visitorToInquiry: number[];
  funnelData: {
    visitors: number;
    inquiries: number;
    opportunities: number;
    applications: number;
  };
}

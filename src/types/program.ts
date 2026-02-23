import type {
  ROIMetrics,
  ConversionMetrics,
  FunnelStageCount,
  BudgetRecommendation,
  DataCompletenessScore,
  SpendData,
} from './metrics';

export type ProgramLevel = 'Certificate' | 'Degree';

export type SchoolId = 'MSU' | 'SMU' | 'USF' | 'Emory ECE' | 'Emory GBS' | 'ECSU' | 'KEEP';

export interface Program {
  id: string;
  school: SchoolId;
  level: ProgramLevel;
  programName: string;
  leads: number;

  // Funnel counts
  funnel: FunnelStageCount;

  // Conversion rates
  conversions: ConversionMetrics;

  // ROI metrics (calculated)
  roi?: ROIMetrics;

  // Spend data
  spend?: SpendData;

  // Recommendation
  recommendation?: BudgetRecommendation;

  // Data quality
  dataCompleteness?: DataCompletenessScore;
}

export interface ProgramDetail extends Program {
  // Historical trend data
  trends?: {
    leads: Array<{ date: Date; value: number }>;
    conversions: Array<{ date: Date; metric: string; value: number }>;
    costs: Array<{ date: Date; metric: string; value: number }>;
  };

  // Drop-off analysis
  dropOffInsights?: {
    stage: string;
    dropOffRate: number;
    suggestion: string;
  }[];
}

export interface ProgramFilters {
  school?: SchoolId | 'All Schools';
  level?: ProgramLevel | 'All Program Types';
  minLeads?: number;
  maxCostPerLead?: number;
  recommendationAction?: string;
}

/**
 * ROI and Cost Metrics Types
 */

export interface ROIMetrics {
  costPerLead: number | null;
  costPerOpportunity: number | null;
  costPerApplication: number | null;
  costPerEnrollment: number | null;
}

export interface SpendData {
  programId: string;
  totalSpend: number;
  spendByChannel?: Record<string, number>;
  spendPeriod: {
    startDate: Date;
    endDate: Date;
  };
}

export interface ConversionMetrics {
  inquiryToOpportunityRate: number | null;
  opportunityToApplicationRate: number | null;
  applicationToEnrollmentRate: number | null;
  contactToApplicationRate: number | null;
  contactToEnrollmentRate: number | null;
  leadToEnrollmentRate: number | null;
}

export interface FunnelStageCount {
  visitors?: number;
  inquiries: number;
  opportunities: number;
  applications: number;
  enrollments: number;
}

export type RecommendationAction = 'increase' | 'hold' | 'reduce' | 'pause';

export interface BudgetRecommendation {
  action: RecommendationAction;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  suggestedSpendChange?: number; // Percentage change
}

export interface DataCompletenessScore {
  overall: number; // 0-100
  missingFields: string[];
  status: 'complete' | 'partial' | 'unreliable';
}

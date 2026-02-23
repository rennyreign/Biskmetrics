import type { BudgetRecommendation, RecommendationAction } from '@/types/metrics';
import type { Program } from '@/types/program';

/**
 * Budget Recommendation Engine
 *
 * Generates investment recommendations based on program performance.
 * Uses simple heuristics in Phase 1, can be enhanced with ML in future.
 */

interface RecommendationCriteria {
  minLeads: number;
  minConversionRate: number;
  maxCostPerEnrollment: number;
  excellentConversionRate: number;
  excellentCostPerEnrollment: number;
}

const DEFAULT_CRITERIA: RecommendationCriteria = {
  minLeads: 50, // Minimum lead volume for reliable data
  minConversionRate: 5, // Minimum lead to enrollment rate (%)
  maxCostPerEnrollment: 5000, // Maximum acceptable CPE
  excellentConversionRate: 15, // Excellent lead to enrollment rate (%)
  excellentCostPerEnrollment: 2000, // Excellent CPE
};

/**
 * Generate budget recommendation for a program
 */
export function generateRecommendation(
  program: Program,
  criteria: RecommendationCriteria = DEFAULT_CRITERIA
): BudgetRecommendation {
  // Check data completeness
  if (program.dataCompleteness?.status === 'unreliable') {
    return {
      action: 'pause',
      confidence: 'low',
      reasoning:
        'Insufficient data quality. Complete data migration before making investment decisions.',
    };
  }

  // Check minimum lead volume
  if (program.leads < criteria.minLeads) {
    return {
      action: 'hold',
      confidence: 'low',
      reasoning: `Insufficient lead volume (${program.leads} leads). Need at least ${criteria.minLeads} leads for reliable analysis.`,
    };
  }

  const conversionRate = program.conversions.leadToEnrollmentRate;
  const costPerEnrollment = program.roi?.costPerEnrollment ?? null;

  // Missing critical metrics
  if (conversionRate === null || costPerEnrollment === null) {
    return {
      action: 'hold',
      confidence: 'low',
      reasoning: 'Missing conversion rate or cost data. Cannot assess ROI.',
    };
  }

  // At this point, TypeScript knows both are non-null
  // Excellent performance - increase spend
  if (
    conversionRate >= criteria.excellentConversionRate &&
    costPerEnrollment <= criteria.excellentCostPerEnrollment
  ) {
    return {
      action: 'increase',
      confidence: 'high',
      reasoning: `Strong performance: ${conversionRate.toFixed(1)}% conversion rate and $${costPerEnrollment.toLocaleString()} cost per enrollment. Scale investment.`,
      suggestedSpendChange: 25,
    };
  }

  // Good performance - hold or slight increase
  if (
    conversionRate >= criteria.minConversionRate &&
    costPerEnrollment <= criteria.maxCostPerEnrollment
  ) {
    return {
      action: 'hold',
      confidence: 'high',
      reasoning: `Solid performance: ${conversionRate.toFixed(1)}% conversion rate and $${costPerEnrollment.toLocaleString()} cost per enrollment. Maintain current investment.`,
    };
  }

  // High cost but good conversion - optimize spend
  if (
    conversionRate >= criteria.minConversionRate &&
    costPerEnrollment > criteria.maxCostPerEnrollment
  ) {
    return {
      action: 'hold',
      confidence: 'medium',
      reasoning: `Good conversion (${conversionRate.toFixed(1)}%) but high cost per enrollment ($${costPerEnrollment.toLocaleString()}). Optimize spend efficiency before scaling.`,
    };
  }

  // Low conversion but acceptable cost - investigate
  if (
    conversionRate < criteria.minConversionRate &&
    costPerEnrollment <= criteria.maxCostPerEnrollment
  ) {
    return {
      action: 'reduce',
      confidence: 'medium',
      reasoning: `Low conversion rate (${conversionRate.toFixed(1)}%). Investigate funnel drop-off points before increasing investment.`,
      suggestedSpendChange: -15,
    };
  }

  // Poor performance - reduce or pause
  if (
    conversionRate < criteria.minConversionRate &&
    costPerEnrollment > criteria.maxCostPerEnrollment
  ) {
    return {
      action: 'reduce',
      confidence: 'high',
      reasoning: `Underperforming: ${conversionRate.toFixed(1)}% conversion rate and $${costPerEnrollment.toLocaleString()} cost per enrollment. Reduce spend until performance improves.`,
      suggestedSpendChange: -30,
    };
  }

  // Default fallback
  return {
    action: 'hold',
    confidence: 'low',
    reasoning: 'Unable to determine clear recommendation. Monitor performance.',
  };
}

/**
 * Get recommendation badge color
 */
export function getRecommendationColor(action: RecommendationAction): string {
  switch (action) {
    case 'increase':
      return '#10b981'; // green
    case 'hold':
      return '#3b82f6'; // blue
    case 'reduce':
      return '#f59e0b'; // amber
    case 'pause':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Get recommendation display text
 */
export function getRecommendationText(action: RecommendationAction): string {
  switch (action) {
    case 'increase':
      return 'Increase Spend';
    case 'hold':
      return 'Hold Spend';
    case 'reduce':
      return 'Reduce Spend';
    case 'pause':
      return 'Pause / Investigate';
    default:
      return 'Unknown';
  }
}

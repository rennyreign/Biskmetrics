import type { ROIMetrics, ConversionMetrics, FunnelStageCount } from '@/types/metrics';

/**
 * Metrics Engine
 *
 * Centralized calculation logic for all ROI and conversion metrics.
 * Uses defensive programming to handle null/0 values gracefully.
 */

/**
 * Calculate ROI metrics from spend and funnel data
 */
export function calculateROIMetrics(totalSpend: number, funnel: FunnelStageCount): ROIMetrics {
  return {
    costPerLead: safeDivide(totalSpend, funnel.inquiries),
    costPerOpportunity: safeDivide(totalSpend, funnel.opportunities),
    costPerApplication: safeDivide(totalSpend, funnel.applications),
    costPerEnrollment: safeDivide(totalSpend, funnel.enrollments),
  };
}

/**
 * Calculate conversion rates from funnel data
 */
export function calculateConversionMetrics(funnel: FunnelStageCount): ConversionMetrics {
  return {
    inquiryToOpportunityRate: safePercentage(funnel.opportunities, funnel.inquiries),
    opportunityToApplicationRate: safePercentage(funnel.applications, funnel.opportunities),
    applicationToEnrollmentRate: safePercentage(funnel.enrollments, funnel.applications),
    contactToApplicationRate: safePercentage(funnel.applications, funnel.inquiries),
    contactToEnrollmentRate: safePercentage(funnel.enrollments, funnel.inquiries),
    leadToEnrollmentRate: safePercentage(funnel.enrollments, funnel.inquiries),
  };
}

/**
 * Safe division that returns null for invalid operations
 */
export function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0 || denominator == null || numerator == null) {
    return null;
  }
  if (!isFinite(numerator) || !isFinite(denominator)) {
    return null;
  }
  return numerator / denominator;
}

/**
 * Safe percentage calculation (returns value as percentage, not decimal)
 */
export function safePercentage(numerator: number, denominator: number): number | null {
  const result = safeDivide(numerator, denominator);
  return result !== null ? result * 100 : null;
}

/**
 * Format currency value
 */
export function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number | null, decimals: number = 1): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number | null): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return value.toLocaleString('en-US');
}

/**
 * Calculate week-over-week delta
 */
export function calculateWoWDelta(current: number, lastWeek: number): number | null {
  if (lastWeek === 0 || lastWeek == null || current == null) {
    return null;
  }
  return ((current - lastWeek) / lastWeek) * 100;
}

/**
 * Calculate 4-week average
 */
export function calculateFourWeekAvg(values: number[]): number | null {
  const validValues = values.filter(v => v != null && isFinite(v));
  if (validValues.length === 0) {
    return null;
  }
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
}

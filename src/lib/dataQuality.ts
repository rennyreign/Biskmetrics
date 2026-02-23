import type { DataCompletenessScore } from '@/types/metrics';
import type { Program } from '@/types/program';

/**
 * Data Quality Engine
 *
 * Calculates data completeness scores and identifies missing fields.
 * Helps expose gaps during Salesforce → HubSpot migration.
 */

const REQUIRED_FIELDS = [
  'funnel.inquiries',
  'funnel.opportunities',
  'funnel.applications',
  'funnel.enrollments',
];

const OPTIONAL_FIELDS = [
  'funnel.visitors',
  'spend.totalSpend',
  'conversions.inquiryToOpportunityRate',
  'conversions.opportunityToApplicationRate',
  'conversions.applicationToEnrollmentRate',
];

/**
 * Calculate data completeness score for a program
 */
export function calculateCompletenessScore(program: Program): DataCompletenessScore {
  const missingFields: string[] = [];
  let requiredFieldsPresent = 0;
  let optionalFieldsPresent = 0;

  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!hasValue(program, field)) {
      missingFields.push(field);
    } else {
      requiredFieldsPresent++;
    }
  });

  // Check optional fields
  OPTIONAL_FIELDS.forEach(field => {
    if (hasValue(program, field)) {
      optionalFieldsPresent++;
    }
  });

  // Calculate overall score (0-100)
  const requiredScore = (requiredFieldsPresent / REQUIRED_FIELDS.length) * 70; // 70% weight
  const optionalScore = (optionalFieldsPresent / OPTIONAL_FIELDS.length) * 30; // 30% weight
  const overall = Math.round(requiredScore + optionalScore);

  // Determine status
  let status: 'complete' | 'partial' | 'unreliable';
  if (overall >= 90) {
    status = 'complete';
  } else if (overall >= 50) {
    status = 'partial';
  } else {
    status = 'unreliable';
  }

  return {
    overall,
    missingFields,
    status,
  };
}

/**
 * Check if a nested field has a valid value
 */
function hasValue(obj: any, path: string): boolean {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null || current[key] == null) {
      return false;
    }
    current = current[key];
  }

  // Check if the value is valid (not null, not NaN, not empty string)
  if (typeof current === 'number') {
    return isFinite(current);
  }
  if (typeof current === 'string') {
    return current.trim().length > 0;
  }
  return current != null;
}

/**
 * Get human-readable field name
 */
export function getFieldDisplayName(fieldPath: string): string {
  const fieldNames: Record<string, string> = {
    'funnel.inquiries': 'Inquiries',
    'funnel.opportunities': 'Opportunities',
    'funnel.applications': 'Applications',
    'funnel.enrollments': 'Enrollments',
    'funnel.visitors': 'Visitors',
    'spend.totalSpend': 'Marketing Spend',
    'conversions.inquiryToOpportunityRate': 'Inquiry to Opportunity Rate',
    'conversions.opportunityToApplicationRate': 'Opportunity to Application Rate',
    'conversions.applicationToEnrollmentRate': 'Application to Enrollment Rate',
  };

  return fieldNames[fieldPath] || fieldPath;
}

/**
 * Filter programs by completeness status
 */
export function filterByCompleteness(
  programs: Program[],
  status: 'complete' | 'partial' | 'unreliable'
): Program[] {
  return programs.filter(program => {
    if (!program.dataCompleteness) {
      return false;
    }
    return program.dataCompleteness.status === status;
  });
}

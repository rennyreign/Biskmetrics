import { describe, it, expect } from 'vitest';
import {
  calculateROIMetrics,
  calculateConversionMetrics,
  safeDivide,
  safePercentage,
  formatCurrency,
  formatPercentage,
  calculateWoWDelta,
  calculateFourWeekAvg,
} from '@/lib/metricsEngine';

describe('metricsEngine', () => {
  describe('safeDivide', () => {
    it('should divide numbers correctly', () => {
      expect(safeDivide(100, 10)).toBe(10);
      expect(safeDivide(50, 2)).toBe(25);
    });

    it('should return null for division by zero', () => {
      expect(safeDivide(100, 0)).toBeNull();
    });

    it('should return null for null inputs', () => {
      expect(safeDivide(null as any, 10)).toBeNull();
      expect(safeDivide(10, null as any)).toBeNull();
    });

    it('should return null for infinite values', () => {
      expect(safeDivide(Infinity, 10)).toBeNull();
      expect(safeDivide(10, Infinity)).toBeNull();
    });
  });

  describe('safePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(safePercentage(50, 100)).toBe(50);
      expect(safePercentage(1, 4)).toBe(25);
    });

    it('should return null for division by zero', () => {
      expect(safePercentage(50, 0)).toBeNull();
    });
  });

  describe('calculateROIMetrics', () => {
    it('should calculate all ROI metrics correctly', () => {
      const funnel = {
        inquiries: 1000,
        opportunities: 500,
        applications: 250,
        enrollments: 100,
      };
      const totalSpend = 10000;

      const roi = calculateROIMetrics(totalSpend, funnel);

      expect(roi.costPerLead).toBe(10);
      expect(roi.costPerOpportunity).toBe(20);
      expect(roi.costPerApplication).toBe(40);
      expect(roi.costPerEnrollment).toBe(100);
    });

    it('should handle zero funnel values gracefully', () => {
      const funnel = {
        inquiries: 0,
        opportunities: 0,
        applications: 0,
        enrollments: 0,
      };
      const totalSpend = 10000;

      const roi = calculateROIMetrics(totalSpend, funnel);

      expect(roi.costPerLead).toBeNull();
      expect(roi.costPerOpportunity).toBeNull();
      expect(roi.costPerApplication).toBeNull();
      expect(roi.costPerEnrollment).toBeNull();
    });
  });

  describe('calculateConversionMetrics', () => {
    it('should calculate all conversion rates correctly', () => {
      const funnel = {
        inquiries: 1000,
        opportunities: 500,
        applications: 250,
        enrollments: 100,
      };

      const conversions = calculateConversionMetrics(funnel);

      expect(conversions.inquiryToOpportunityRate).toBe(50);
      expect(conversions.opportunityToApplicationRate).toBe(50);
      expect(conversions.applicationToEnrollmentRate).toBe(40);
      expect(conversions.contactToApplicationRate).toBe(25);
      expect(conversions.contactToEnrollmentRate).toBe(10);
      expect(conversions.leadToEnrollmentRate).toBe(10);
    });

    it('should handle zero values gracefully', () => {
      const funnel = {
        inquiries: 0,
        opportunities: 0,
        applications: 0,
        enrollments: 0,
      };

      const conversions = calculateConversionMetrics(funnel);

      expect(conversions.inquiryToOpportunityRate).toBeNull();
      expect(conversions.opportunityToApplicationRate).toBeNull();
      expect(conversions.applicationToEnrollmentRate).toBeNull();
    });
  });

  describe('formatCurrency', () => {
    it('should format currency values correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1234567)).toBe('$1,234,567');
      expect(formatCurrency(100)).toBe('$100');
    });

    it('should return dash for null values', () => {
      expect(formatCurrency(null)).toBe('—');
      expect(formatCurrency(undefined as any)).toBe('—');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage values correctly', () => {
      expect(formatPercentage(50.5)).toBe('50.5%');
      expect(formatPercentage(10.123, 2)).toBe('10.12%');
      expect(formatPercentage(100)).toBe('100.0%');
    });

    it('should return dash for null values', () => {
      expect(formatPercentage(null)).toBe('—');
      expect(formatPercentage(undefined as any)).toBe('—');
    });
  });

  describe('calculateWoWDelta', () => {
    it('should calculate week-over-week delta correctly', () => {
      expect(calculateWoWDelta(110, 100)).toBe(10);
      expect(calculateWoWDelta(90, 100)).toBe(-10);
      expect(calculateWoWDelta(100, 100)).toBe(0);
    });

    it('should return null for zero last week value', () => {
      expect(calculateWoWDelta(100, 0)).toBeNull();
    });

    it('should return null for null inputs', () => {
      expect(calculateWoWDelta(null as any, 100)).toBeNull();
      expect(calculateWoWDelta(100, null as any)).toBeNull();
    });
  });

  describe('calculateFourWeekAvg', () => {
    it('should calculate average correctly', () => {
      expect(calculateFourWeekAvg([100, 200, 300, 400])).toBe(250);
      expect(calculateFourWeekAvg([10, 20, 30])).toBe(20);
    });

    it('should handle empty array', () => {
      expect(calculateFourWeekAvg([])).toBeNull();
    });

    it('should filter out null values', () => {
      expect(calculateFourWeekAvg([100, null as any, 200, 300])).toBe(200);
    });

    it('should filter out infinite values', () => {
      expect(calculateFourWeekAvg([100, Infinity, 200, 300])).toBe(200);
    });
  });
});

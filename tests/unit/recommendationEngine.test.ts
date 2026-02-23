import { describe, it, expect } from 'vitest';
import {
  generateRecommendation,
  getRecommendationColor,
  getRecommendationText,
} from '@/lib/recommendationEngine';
import type { Program } from '@/types/program';

describe('recommendationEngine', () => {
  const createMockProgram = (overrides: Partial<Program> = {}): Program => ({
    id: 'test-1',
    school: 'MSU',
    level: 'Certificate',
    programName: 'Test Program',
    leads: 100,
    funnel: {
      inquiries: 100,
      opportunities: 50,
      applications: 25,
      enrollments: 10,
    },
    conversions: {
      inquiryToOpportunityRate: 50,
      opportunityToApplicationRate: 50,
      applicationToEnrollmentRate: 40,
      contactToApplicationRate: 25,
      contactToEnrollmentRate: 10,
      leadToEnrollmentRate: 10,
    },
    roi: {
      costPerLead: 100,
      costPerOpportunity: 200,
      costPerApplication: 400,
      costPerEnrollment: 1000,
    },
    dataCompleteness: {
      overall: 95,
      missingFields: [],
      status: 'complete',
    },
    ...overrides,
  });

  describe('generateRecommendation', () => {
    it('should recommend increase for excellent performance', () => {
      const program = createMockProgram({
        conversions: {
          inquiryToOpportunityRate: 50,
          opportunityToApplicationRate: 50,
          applicationToEnrollmentRate: 40,
          contactToApplicationRate: 30,
          contactToEnrollmentRate: 20,
          leadToEnrollmentRate: 20, // Excellent: >= 15%
        },
        roi: {
          costPerLead: 50,
          costPerOpportunity: 100,
          costPerApplication: 200,
          costPerEnrollment: 1500, // Excellent: <= 2000
        },
      });

      const recommendation = generateRecommendation(program);

      expect(recommendation.action).toBe('increase');
      expect(recommendation.confidence).toBe('high');
      expect(recommendation.suggestedSpendChange).toBe(25);
    });

    it('should recommend hold for solid performance', () => {
      const program = createMockProgram({
        conversions: {
          inquiryToOpportunityRate: 50,
          opportunityToApplicationRate: 50,
          applicationToEnrollmentRate: 40,
          contactToApplicationRate: 25,
          contactToEnrollmentRate: 10,
          leadToEnrollmentRate: 10, // Good: >= 5%
        },
        roi: {
          costPerLead: 100,
          costPerOpportunity: 200,
          costPerApplication: 400,
          costPerEnrollment: 3000, // Acceptable: <= 5000
        },
      });

      const recommendation = generateRecommendation(program);

      expect(recommendation.action).toBe('hold');
      expect(recommendation.confidence).toBe('high');
    });

    it('should recommend reduce for low conversion', () => {
      const program = createMockProgram({
        conversions: {
          inquiryToOpportunityRate: 20,
          opportunityToApplicationRate: 20,
          applicationToEnrollmentRate: 20,
          contactToApplicationRate: 10,
          contactToEnrollmentRate: 3,
          leadToEnrollmentRate: 3, // Low: < 5%
        },
        roi: {
          costPerLead: 100,
          costPerOpportunity: 500,
          costPerApplication: 2500,
          costPerEnrollment: 6000, // High: > 5000
        },
      });

      const recommendation = generateRecommendation(program);

      expect(recommendation.action).toBe('reduce');
      expect(recommendation.confidence).toBe('high');
      expect(recommendation.suggestedSpendChange).toBe(-30);
    });

    it('should recommend pause for unreliable data', () => {
      const program = createMockProgram({
        dataCompleteness: {
          overall: 30,
          missingFields: ['funnel.enrollments', 'spend.totalSpend'],
          status: 'unreliable',
        },
      });

      const recommendation = generateRecommendation(program);

      expect(recommendation.action).toBe('pause');
      expect(recommendation.confidence).toBe('low');
    });

    it('should recommend hold for insufficient lead volume', () => {
      const program = createMockProgram({
        leads: 30, // Below minimum of 50
      });

      const recommendation = generateRecommendation(program);

      expect(recommendation.action).toBe('hold');
      expect(recommendation.confidence).toBe('low');
      expect(recommendation.reasoning).toContain('Insufficient lead volume');
    });

    it('should recommend hold for missing metrics', () => {
      const program = createMockProgram({
        conversions: {
          inquiryToOpportunityRate: 50,
          opportunityToApplicationRate: 50,
          applicationToEnrollmentRate: 40,
          contactToApplicationRate: 25,
          contactToEnrollmentRate: 10,
          leadToEnrollmentRate: null, // Missing
        },
      });

      const recommendation = generateRecommendation(program);

      expect(recommendation.action).toBe('hold');
      expect(recommendation.confidence).toBe('low');
      expect(recommendation.reasoning).toContain('Missing conversion rate');
    });
  });

  describe('getRecommendationColor', () => {
    it('should return correct colors for each action', () => {
      expect(getRecommendationColor('increase')).toBe('#10b981');
      expect(getRecommendationColor('hold')).toBe('#3b82f6');
      expect(getRecommendationColor('reduce')).toBe('#f59e0b');
      expect(getRecommendationColor('pause')).toBe('#ef4444');
    });
  });

  describe('getRecommendationText', () => {
    it('should return correct text for each action', () => {
      expect(getRecommendationText('increase')).toBe('Increase Spend');
      expect(getRecommendationText('hold')).toBe('Hold Spend');
      expect(getRecommendationText('reduce')).toBe('Reduce Spend');
      expect(getRecommendationText('pause')).toBe('Pause / Investigate');
    });
  });
});

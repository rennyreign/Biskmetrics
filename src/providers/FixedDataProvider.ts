import type { DataProvider } from './DataProvider.interface';
import type { Program, ProgramFilters } from '@/types/program';
import type { ScorecardWeek } from '@/types/scorecard';
import { programs as rawPrograms } from '@/data/programs';
import { calculateROIMetrics } from '@/lib/metricsEngine';
import { generateRecommendation } from '@/lib/recommendationEngine';
import { calculateCompletenessScore } from '@/lib/dataQuality';

/**
 * FixedDataProvider - Phase 1 Implementation
 *
 * Provides program data from static source with calculated ROI metrics,
 * recommendations, and data quality scoring.
 *
 * This provider:
 * - Loads data from static programs.ts file
 * - Calculates ROI metrics using metricsEngine
 * - Generates budget recommendations using recommendationEngine
 * - Scores data completeness using dataQuality
 * - Supports filtering by school and level
 */
export class FixedDataProvider implements DataProvider {
  private enrichedPrograms: Program[] = [];

  constructor() {
    this.enrichPrograms();
  }

  /**
   * Enrich raw program data with ROI metrics, recommendations, and quality scores
   */
  private enrichPrograms(): void {
    this.enrichedPrograms = rawPrograms.map(program => {
      // Calculate ROI metrics if spend data exists
      const roi = program.spend
        ? calculateROIMetrics(program.spend.totalSpend, program.funnel)
        : undefined;

      // Generate budget recommendation
      const recommendation = generateRecommendation(
        {
          ...program,
          roi,
        } as Program,
        {
          minLeads: 500,
          minConversionRate: 3.0,
          excellentConversionRate: 7.0,
          maxCostPerEnrollment: 5000,
          excellentCostPerEnrollment: 3000,
        }
      );

      // Score data completeness
      const dataCompleteness = calculateCompletenessScore(program);

      return {
        ...program,
        roi,
        recommendation,
        dataCompleteness,
      };
    });
  }

  /**
   * Get all programs with optional filtering
   */
  async getPrograms(filters?: ProgramFilters): Promise<Program[]> {
    let filtered = [...this.enrichedPrograms];

    if (filters?.school && filters.school !== 'All Schools') {
      filtered = filtered.filter(p => p.school === filters.school);
    }

    if (filters?.level && filters.level !== 'All Program Types') {
      filtered = filtered.filter(p => p.level === filters.level);
    }

    if (filters?.minLeads !== undefined) {
      filtered = filtered.filter(p => p.leads >= filters.minLeads!);
    }

    return filtered;
  }

  /**
   * Get a single program by ID
   */
  async getProgramById(id: string): Promise<Program | null> {
    const program = this.enrichedPrograms.find(p => p.id === id);
    return program || null;
  }

  /**
   * Get scorecard metrics (placeholder for Phase 1)
   * Returns empty scorecard week - will be populated when scorecard data is available
   */
  async getScorecardMetrics(weekOf?: Date): Promise<ScorecardWeek> {
    // Phase 1: Return empty scorecard week
    // Phase 2: Integrate with actual scorecard data source
    return {
      weekOf: weekOf || new Date(),
      metrics: [],
    };
  }

  /**
   * Get available schools for filtering
   */
  async getSchools(): Promise<string[]> {
    const schools = new Set(this.enrichedPrograms.map(p => p.school));
    return ['All Schools', ...Array.from(schools).sort()];
  }

  /**
   * Get available program levels for filtering
   */
  async getLevels(): Promise<string[]> {
    const levels = new Set(this.enrichedPrograms.map(p => p.level));
    return ['All Program Types', ...Array.from(levels).sort()];
  }

  /**
   * Refresh data (no-op for fixed provider, but required by interface)
   */
  async refresh(): Promise<void> {
    // For FixedDataProvider, data is static so refresh is a no-op
    // In HubSpotDataProvider, this would fetch fresh data from API
    this.enrichPrograms();
  }
}

// Export singleton instance
export const dataProvider = new FixedDataProvider();

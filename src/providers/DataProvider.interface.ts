import type { Program, ProgramDetail, ProgramFilters } from '@/types/program';
import type { ScorecardWeek, ScorecardSummary, FunnelSnapshot } from '@/types/scorecard';
import type { SpendData } from '@/types/metrics';

/**
 * Data Provider Interface
 *
 * Abstraction layer for data sources. Allows swapping between:
 * - Phase 1: FixedDataProvider (static data)
 * - Phase 2: HubSpotDataProvider (live API)
 */
export interface DataProvider {
  /**
   * Get all programs with optional filtering
   */
  getPrograms(filters?: ProgramFilters): Promise<Program[]>;

  /**
   * Get detailed information for a specific program
   */
  getProgramDetail(programId: string): Promise<ProgramDetail>;

  /**
   * Get spend data for a program
   */
  getSpendData(programId: string): Promise<SpendData | null>;

  /**
   * Get scorecard metrics for a specific week
   */
  getScorecardMetrics(weekOf?: Date): Promise<ScorecardWeek>;

  /**
   * Get scorecard summary for a specific week
   */
  getScorecardSummary(weekOf?: Date): Promise<ScorecardSummary>;

  /**
   * Get funnel snapshot for a specific week
   */
  getFunnelSnapshot(weekOf?: Date): Promise<FunnelSnapshot>;
}

/**
 * Data Provider Error
 */
export class DataProviderError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DataProviderError';
  }
}

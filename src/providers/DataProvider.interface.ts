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
   * Get a single program by ID
   */
  getProgramById(id: string): Promise<Program | null>;

  /**
   * Get scorecard metrics for a specific week
   */
  getScorecardMetrics(weekOf?: Date): Promise<ScorecardWeek>;

  /**
   * Get available schools for filtering
   */
  getSchools(): Promise<string[]>;

  /**
   * Get available program levels for filtering
   */
  getLevels(): Promise<string[]>;

  /**
   * Refresh data from source
   */
  refresh(): Promise<void>;
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

import { describe, it, expect, beforeEach } from 'vitest';
import { FixedDataProvider } from '@/providers/FixedDataProvider';

describe('FixedDataProvider', () => {
  let provider: FixedDataProvider;

  beforeEach(() => {
    provider = new FixedDataProvider();
  });

  describe('getPrograms', () => {
    it('should return all programs without filters', async () => {
      const programs = await provider.getPrograms();
      expect(programs.length).toBeGreaterThan(0);
      expect(programs[0]).toHaveProperty('id');
      expect(programs[0]).toHaveProperty('school');
      expect(programs[0]).toHaveProperty('programName');
    });

    it('should enrich programs with ROI metrics when spend data exists', async () => {
      const programs = await provider.getPrograms();
      const programWithSpend = programs.find((p) => p.spend);
      
      if (programWithSpend) {
        expect(programWithSpend.roi).toBeDefined();
        expect(programWithSpend.roi).toHaveProperty('costPerLead');
        expect(programWithSpend.roi).toHaveProperty('costPerEnrollment');
      }
    });

    it('should enrich programs with recommendations', async () => {
      const programs = await provider.getPrograms();
      expect(programs[0].recommendation).toBeDefined();
      expect(programs[0].recommendation).toHaveProperty('action');
      expect(programs[0].recommendation).toHaveProperty('confidence');
      expect(programs[0].recommendation).toHaveProperty('reasoning');
    });

    it('should enrich programs with data completeness scores', async () => {
      const programs = await provider.getPrograms();
      expect(programs[0].dataCompleteness).toBeDefined();
      expect(programs[0].dataCompleteness).toHaveProperty('overall');
      expect(programs[0].dataCompleteness).toHaveProperty('status');
      expect(programs[0].dataCompleteness).toHaveProperty('missingFields');
    });

    it('should filter by school', async () => {
      const allPrograms = await provider.getPrograms();
      const schools = [...new Set(allPrograms.map((p) => p.school))];
      const targetSchool = schools[0];

      const filtered = await provider.getPrograms({ school: targetSchool });
      expect(filtered.every((p) => p.school === targetSchool)).toBe(true);
    });

    it('should filter by level', async () => {
      const filtered = await provider.getPrograms({ level: 'Certificate' });
      expect(filtered.every((p) => p.level === 'Certificate')).toBe(true);
    });

    it('should filter by minimum leads', async () => {
      const minLeads = 1000;
      const filtered = await provider.getPrograms({ minLeads });
      expect(filtered.every((p) => p.leads >= minLeads)).toBe(true);
    });
  });

  describe('getProgramById', () => {
    it('should return a program by ID', async () => {
      const allPrograms = await provider.getPrograms();
      const targetId = allPrograms[0].id;

      const program = await provider.getProgramById(targetId);
      expect(program).toBeDefined();
      expect(program?.id).toBe(targetId);
    });

    it('should return null for non-existent ID', async () => {
      const program = await provider.getProgramById('non-existent-id');
      expect(program).toBeNull();
    });
  });

  describe('getSchools', () => {
    it('should return list of schools with "All Schools" option', async () => {
      const schools = await provider.getSchools();
      expect(schools).toContain('All Schools');
      expect(schools.length).toBeGreaterThan(1);
    });
  });

  describe('getLevels', () => {
    it('should return list of levels with "All Program Types" option', async () => {
      const levels = await provider.getLevels();
      expect(levels).toContain('All Program Types');
      expect(levels).toContain('Certificate');
      expect(levels).toContain('Degree');
    });
  });

  describe('getScorecardMetrics', () => {
    it('should return empty scorecard week for Phase 1', async () => {
      const scorecard = await provider.getScorecardMetrics();
      expect(scorecard).toHaveProperty('weekOf');
      expect(scorecard).toHaveProperty('metrics');
      expect(scorecard.metrics).toEqual([]);
    });
  });

  describe('refresh', () => {
    it('should refresh data without errors', async () => {
      await expect(provider.refresh()).resolves.not.toThrow();
    });
  });
});

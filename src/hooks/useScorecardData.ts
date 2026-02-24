import { useMemo, useState, useCallback } from 'react';
import type { Pipeline, EOSMetric, ScorecardSummary, TrendData } from '@/types/eos-scorecard';

// Mock data matching the brief specifications
const DEGREE_METRICS: Omit<
  EOSMetric,
  | 'currentValue'
  | 'lastWeekValue'
  | 'fourWeekAvg'
  | 'wowDelta'
  | 'status'
  | 'greenStreak'
  | 'redStreak'
  | 'idsFlagged'
>[] = [
  // Leading Indicators
  {
    id: '1',
    name: 'Cost per Lead',
    category: 'leading',
    pipeline: 'degree',
    owner: 'Marketing Manager',
    unit: '$',
    target: 145,
    isCostMetric: true,
    sortOrder: 1,
  },
  {
    id: '2',
    name: 'Cost per MQL',
    category: 'leading',
    pipeline: 'degree',
    owner: 'Marketing Manager',
    unit: '$',
    target: 290,
    isCostMetric: true,
    sortOrder: 2,
  },
  {
    id: '3',
    name: 'Cost per Visit',
    category: 'leading',
    pipeline: 'degree',
    owner: 'Marketing Director',
    unit: '$',
    target: 50,
    isCostMetric: true,
    sortOrder: 3,
  },
  {
    id: '4',
    name: 'Visitor to Inquiry',
    category: 'leading',
    pipeline: 'degree',
    owner: 'Marketing Director',
    unit: '%',
    target: 15,
    isCostMetric: false,
    sortOrder: 4,
  },
  // Lagging Indicators
  {
    id: '5',
    name: 'Cost per Application',
    category: 'lagging',
    pipeline: 'degree',
    owner: 'CFO',
    unit: '$',
    target: 1500,
    isCostMetric: true,
    sortOrder: 1,
  },
  {
    id: '6',
    name: 'Cost per Opportunity',
    category: 'lagging',
    pipeline: 'degree',
    owner: 'Enrollment Director',
    unit: '$',
    target: 600,
    isCostMetric: true,
    sortOrder: 2,
  },
  {
    id: '7',
    name: 'Inquiry to Opportunity Rate',
    category: 'lagging',
    pipeline: 'degree',
    owner: 'Enrollment Director',
    unit: '%',
    target: 25,
    isCostMetric: false,
    sortOrder: 3,
  },
  {
    id: '8',
    name: 'Opportunity to Application Rate',
    category: 'lagging',
    pipeline: 'degree',
    owner: 'Enrollment Director',
    unit: '%',
    target: 40,
    isCostMetric: false,
    sortOrder: 4,
  },
];

const CERTIFICATE_METRICS: Omit<
  EOSMetric,
  | 'currentValue'
  | 'lastWeekValue'
  | 'fourWeekAvg'
  | 'wowDelta'
  | 'status'
  | 'greenStreak'
  | 'redStreak'
  | 'idsFlagged'
>[] = [
  // Leading Indicators
  {
    id: '9',
    name: 'Cost per Lead',
    category: 'leading',
    pipeline: 'certificate',
    owner: 'Marketing Manager',
    unit: '$',
    target: 150,
    isCostMetric: true,
    sortOrder: 1,
  },
  {
    id: '10',
    name: 'Cost per MQL',
    category: 'leading',
    pipeline: 'certificate',
    owner: 'Marketing Manager',
    unit: '$',
    target: 300,
    isCostMetric: true,
    sortOrder: 2,
  },
  {
    id: '11',
    name: 'Cost per Visit',
    category: 'leading',
    pipeline: 'certificate',
    owner: 'Marketing Director',
    unit: '$',
    target: 40,
    isCostMetric: true,
    sortOrder: 3,
  },
  {
    id: '12',
    name: 'Visitor to Inquiry',
    category: 'leading',
    pipeline: 'certificate',
    owner: 'Marketing Director',
    unit: '%',
    target: 20,
    isCostMetric: false,
    sortOrder: 4,
  },
  // Lagging Indicators
  {
    id: '13',
    name: 'Cost per Application',
    category: 'lagging',
    pipeline: 'certificate',
    owner: 'CFO',
    unit: '$',
    target: 1500,
    isCostMetric: true,
    sortOrder: 1,
  },
  {
    id: '14',
    name: 'Cost per Opportunity',
    category: 'lagging',
    pipeline: 'certificate',
    owner: 'Enrollment Director',
    unit: '$',
    target: 600,
    isCostMetric: true,
    sortOrder: 2,
  },
  {
    id: '15',
    name: 'Inquiry to Opportunity Rate',
    category: 'lagging',
    pipeline: 'certificate',
    owner: 'Enrollment Director',
    unit: '%',
    target: 20,
    isCostMetric: false,
    sortOrder: 3,
  },
  {
    id: '16',
    name: 'Opportunity to Enrollment Rate',
    category: 'lagging',
    pipeline: 'certificate',
    owner: 'Enrollment Director',
    unit: '%',
    target: 35,
    isCostMetric: false,
    sortOrder: 4,
  },
];

// Mock weekly values (matching screenshot data)
const MOCK_VALUES: Record<string, { current: number; lastWeek: number; fourWeek: number }> = {
  '1': { current: 145, lastWeek: 151, fourWeek: 147 },
  '2': { current: 185, lastWeek: 191, fourWeek: 208 },
  '3': { current: 47, lastWeek: 49, fourWeek: 51 },
  '4': { current: 21, lastWeek: 20, fourWeek: 16 },
  '5': { current: 1134, lastWeek: 1131, fourWeek: 1189 },
  '6': { current: 755, lastWeek: 816, fourWeek: 911 },
  '7': { current: 4, lastWeek: 3, fourWeek: 2 },
  '8': { current: 2.6, lastWeek: 2.2, fourWeek: 1.4 },
  '9': { current: 155, lastWeek: 160, fourWeek: 157 },
  '10': { current: 201, lastWeek: 195, fourWeek: 217 },
  '11': { current: 47, lastWeek: 49, fourWeek: 53 },
  '12': { current: 16, lastWeek: 15, fourWeek: 15 },
  '13': { current: 1040, lastWeek: 2400, fourWeek: 2250 },
  '14': { current: 786, lastWeek: 803, fourWeek: 911 },
  '15': { current: 3.5, lastWeek: 3.2, fourWeek: 2 },
  '16': { current: 3, lastWeek: 1.8, fourWeek: 1 },
};

function calculateMetricData(
  base: Omit<
    EOSMetric,
    | 'currentValue'
    | 'lastWeekValue'
    | 'fourWeekAvg'
    | 'wowDelta'
    | 'status'
    | 'greenStreak'
    | 'redStreak'
    | 'idsFlagged'
  >,
  weekKey: Date
): EOSMetric {
  const baseValues = MOCK_VALUES[base.id] || { current: 0, lastWeek: 0, fourWeek: 0 };

  // Generate week-based variation using week offset from current date
  const currentDate = new Date();
  const weekOffset = Math.floor(
    (currentDate.getTime() - weekKey.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  // Use metric ID hash + week offset for deterministic but varied values
  const idHash = base.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = (idHash + weekOffset) % 100;

  // Vary values by ±25% based on week (larger range to show status changes)
  const variation = 1 + ((seed - 50) / 100) * 0.5; // -25% to +25%
  const values = {
    current: Math.round(baseValues.current * variation * 100) / 100,
    lastWeek: Math.round(baseValues.lastWeek * variation * 100) / 100,
    fourWeek: Math.round(baseValues.fourWeek * variation * 100) / 100,
  };

  const wowDelta =
    values.lastWeek !== 0 ? ((values.current - values.lastWeek) / values.lastWeek) * 100 : 0;

  // Status calculation
  let status: 'green' | 'red';
  if (base.isCostMetric) {
    status = values.current <= base.target ? 'green' : 'red';
  } else {
    const performance = values.current / base.target;
    status = performance >= 0.9 ? 'green' : 'red';
  }

  // Deterministic streaks based on metric ID (in real app, calculated from history)
  // Use simple hash of ID to generate consistent but varied streaks
  const streakIdHash = base.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const greenStreak = status === 'green' ? (streakIdHash % 5) + 1 : 0;
  const redStreak = status === 'red' ? (streakIdHash % 3) + 1 : 0;
  const idsFlagged = redStreak >= 2;

  return {
    ...base,
    currentValue: values.current,
    lastWeekValue: values.lastWeek,
    fourWeekAvg: values.fourWeek,
    wowDelta,
    status,
    greenStreak,
    redStreak,
    idsFlagged,
  };
}

export function useScorecardData(pipeline: Pipeline, weekKey: Date) {
  const [metricsState, setMetricsState] = useState<Record<string, Partial<EOSMetric>>>({});

  const metrics = useMemo(() => {
    const baseMetrics = pipeline === 'degree' ? DEGREE_METRICS : CERTIFICATE_METRICS;
    const baseMetricIds = new Set(baseMetrics.map(m => m.id));

    // Process base metrics with any updates
    const processedBaseMetrics = baseMetrics.map(base => {
      const calculated = calculateMetricData(base, weekKey);
      const updates = metricsState[calculated.id];
      const merged = updates ? { ...calculated, ...updates } : calculated;

      // Recalculate status and derived fields if target was updated
      if (updates?.target !== undefined) {
        const isCostMetric = merged.isCostMetric ?? false;
        if (isCostMetric) {
          merged.status = merged.currentValue <= merged.target ? 'green' : 'red';
        } else {
          const performance = merged.currentValue / merged.target;
          merged.status = performance >= 0.9 ? 'green' : 'red';
        }

        // Recalculate streaks and IDS flag based on new status
        const idHash = merged.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        merged.greenStreak = merged.status === 'green' ? (idHash % 5) + 1 : 0;
        merged.redStreak = merged.status === 'red' ? (idHash % 3) + 1 : 0;
        merged.idsFlagged = merged.redStreak >= 2;
      }

      return merged;
    });

    // Add custom metrics that aren't in base metrics
    const customMetrics = Object.entries(metricsState)
      .filter(([id]) => !baseMetricIds.has(id))
      .map(([_, metric]) => metric as EOSMetric)
      .filter(m => m.pipeline === pipeline);

    // Combine and sort by sortOrder
    const allMetrics = [...processedBaseMetrics, ...customMetrics];
    return allMetrics.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [pipeline, metricsState, weekKey]);

  const updateMetric = useCallback((metricId: string, updates: Partial<EOSMetric>) => {
    setMetricsState(prev => ({
      ...prev,
      [metricId]: { ...prev[metricId], ...updates },
    }));
  }, []);

  const deleteMetric = useCallback((metricId: string) => {
    setMetricsState(prev => {
      const newState = { ...prev };
      delete newState[metricId];
      return newState;
    });
  }, []);

  const addMetric = useCallback(
    (
      newMetric: Omit<
        EOSMetric,
        | 'currentValue'
        | 'lastWeekValue'
        | 'fourWeekAvg'
        | 'wowDelta'
        | 'status'
        | 'greenStreak'
        | 'redStreak'
        | 'idsFlagged'
      >
    ) => {
      const calculated = calculateMetricData(newMetric, weekKey);
      setMetricsState(prev => ({
        ...prev,
        [calculated.id]: calculated,
      }));
    },
    [weekKey]
  );

  const summary = useMemo((): ScorecardSummary => {
    const onTrack = metrics.filter(m => m.status === 'green').length;
    const offTrack = metrics.filter(m => m.status === 'red').length;
    const flagged = metrics.filter(m => m.idsFlagged).length;

    const leading = metrics.filter(m => m.category === 'leading');
    const lagging = metrics.filter(m => m.category === 'lagging');

    const leadingOnTrack = leading.filter(m => m.status === 'green').length;
    const laggingOnTrack = lagging.filter(m => m.status === 'green').length;

    return {
      metricsOnTrack: onTrack,
      metricsOffTrack: offTrack,
      metricsFlagged: flagged,
      leadingOnTrack,
      leadingTotal: leading.length,
      leadingPacingPercent: leading.length > 0 ? (leadingOnTrack / leading.length) * 100 : 0,
      laggingOnTrack,
      laggingTotal: lagging.length,
      laggingPacingPercent: lagging.length > 0 ? (laggingOnTrack / lagging.length) * 100 : 0,
    };
  }, [metrics]);

  const trends = useMemo((): TrendData => {
    // Generate week-based trend data using weekKey
    const currentDate = new Date();
    const weekOffset = Math.floor(
      (currentDate.getTime() - weekKey.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    // Base trend values
    const baseCostPerLead = [160, 155, 150, 148, 145, 143, 142, 145];
    const baseVisitorToInquiry = [15, 16, 17, 18, 19, 20, 21, 21];

    // Vary trend data by week using similar approach to metrics
    const seed = (weekOffset * 37) % 100; // Different seed for trends
    const variation = 1 + ((seed - 50) / 100) * 0.3; // ±15% for trends

    return {
      weeks: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8'],
      costPerLead: baseCostPerLead.map(v => Math.round(v * variation)),
      visitorToInquiry: baseVisitorToInquiry.map(v => Math.round(v * variation * 10) / 10),
      funnelData: {
        visitors: Math.round(1800 * variation),
        inquiries: Math.round(378 * variation),
        opportunities: Math.round(15 * variation),
        applications: Math.round(0 * variation),
      },
    };
  }, [weekKey]);

  return { metrics, summary, trends, updateMetric, addMetric, deleteMetric };
}

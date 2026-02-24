import { Box, Typography, Card, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Flag } from 'lucide-react';
import { useState } from 'react';
import type { ScorecardMetric, MetricStatus } from '@/types/scorecard';

// Mock data for now - will be replaced with real data from provider
const WEEKLY_HISTORY: Record<string, number[]> = {
  '1': [2456, 2589, 2701, 2798, 2834, 2891, 2847, 2847],
  '2': [7.2, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.8],
  '3': [16.2, 16.8, 17.1, 17.5, 17.9, 18.2, 18.7, 18.5],
  '4': [10, 11, 11, 12, 12, 13, 12, 12],
  '5': [128, 132, 135, 138, 140, 143, 145, 142],
  '6': [3200, 3100, 3050, 2980, 2920, 2880, 2850, 2847],
  '7': [4.8, 4.9, 5.0, 5.1, 5.1, 5.2, 5.3, 5.2],
  '8': [17200, 17500, 17800, 18000, 18200, 18400, 18600, 18500],
};

const MOCK_METRICS: ScorecardMetric[] = [
  // Leading Indicators
  {
    id: '1',
    name: 'Total Leads',
    category: 'leading',
    currentValue: 2847,
    lastWeekValue: 2847,
    fourWeekAvg: 2843,
    target: 3000,
    status: 'on-track',
    streak: 3,
    unit: 'count',
    owner: 'Marketing',
  },
  {
    id: '2',
    name: 'Lead Quality Score',
    category: 'leading',
    currentValue: 7.8,
    lastWeekValue: 7.9,
    fourWeekAvg: 7.75,
    target: 8.0,
    status: 'on-track',
    streak: 2,
    unit: 'count',
    owner: 'Marketing',
  },
  {
    id: '3',
    name: 'Inquiry-to-Opportunity Rate',
    category: 'leading',
    currentValue: 18.5,
    lastWeekValue: 18.7,
    fourWeekAvg: 18.3,
    target: 20.0,
    status: 'flagged',
    streak: -1,
    unit: 'percentage',
    owner: 'Sales',
  },
  {
    id: '4',
    name: 'Active Campaigns',
    category: 'leading',
    currentValue: 12,
    lastWeekValue: 12,
    fourWeekAvg: 12.25,
    target: 15,
    status: 'off-track',
    streak: -2,
    unit: 'count',
    owner: 'Marketing',
  },
  // Lagging Indicators
  {
    id: '5',
    name: 'Total Enrollments',
    category: 'lagging',
    currentValue: 142,
    lastWeekValue: 145,
    fourWeekAvg: 142.5,
    target: 150,
    status: 'on-track',
    streak: 4,
    unit: 'count',
    owner: 'Enrollment',
  },
  {
    id: '6',
    name: 'Average Cost Per Enrollment',
    category: 'lagging',
    currentValue: 2847,
    lastWeekValue: 2850,
    fourWeekAvg: 2899,
    target: 2500,
    status: 'flagged',
    streak: 5,
    unit: 'currency',
    owner: 'Finance',
  },
  {
    id: '7',
    name: 'Lead-to-Enrollment Rate',
    category: 'lagging',
    currentValue: 5.2,
    lastWeekValue: 5.3,
    fourWeekAvg: 5.2,
    target: 6.0,
    status: 'on-track',
    streak: 3,
    unit: 'percentage',
    owner: 'Operations',
  },
  {
    id: '8',
    name: 'Revenue Per Enrollment',
    category: 'lagging',
    currentValue: 18500,
    lastWeekValue: 18600,
    fourWeekAvg: 18375,
    target: 20000,
    status: 'on-track',
    streak: 4,
    unit: 'currency',
    owner: 'Finance',
  },
];

export function ScorecardView() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'leading' | 'lagging'>('all');

  const filteredMetrics =
    selectedCategory === 'all'
      ? MOCK_METRICS
      : MOCK_METRICS.filter(m => m.category === selectedCategory);

  const getStatusIcon = (status: MetricStatus) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle size={18} color="#10b981" />;
      case 'off-track':
        return <AlertCircle size={18} color="#ef4444" />;
      case 'flagged':
        return <Flag size={18} color="#f59e0b" />;
    }
  };

  const getStatusColor = (status: MetricStatus) => {
    switch (status) {
      case 'on-track':
        return { bg: '#f0fdf4', border: '#86efac', text: '#15803d' };
      case 'off-track':
        return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' };
      case 'flagged':
        return { bg: '#fef3c7', border: '#fde68a', text: '#d97706' };
    }
  };

  const calculateWoWChange = (metric: ScorecardMetric) => {
    if (metric.lastWeekValue === 0) return 0;
    return ((metric.currentValue - metric.lastWeekValue) / metric.lastWeekValue) * 100;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Marketing Scorecard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="All Metrics"
            onClick={() => setSelectedCategory('all')}
            sx={{
              backgroundColor: selectedCategory === 'all' ? '#e91e63' : '#f1f5f9',
              color: selectedCategory === 'all' ? 'white' : '#64748b',
              cursor: 'pointer',
              '&:hover': { backgroundColor: selectedCategory === 'all' ? '#c2185b' : '#e2e8f0' },
            }}
          />
          <Chip
            label="Leading"
            onClick={() => setSelectedCategory('leading')}
            sx={{
              backgroundColor: selectedCategory === 'leading' ? '#e91e63' : '#f1f5f9',
              color: selectedCategory === 'leading' ? 'white' : '#64748b',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: selectedCategory === 'leading' ? '#c2185b' : '#e2e8f0',
              },
            }}
          />
          <Chip
            label="Lagging"
            onClick={() => setSelectedCategory('lagging')}
            sx={{
              backgroundColor: selectedCategory === 'lagging' ? '#e91e63' : '#f1f5f9',
              color: selectedCategory === 'lagging' ? 'white' : '#64748b',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: selectedCategory === 'lagging' ? '#c2185b' : '#e2e8f0',
              },
            }}
          />
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2,
          mb: 3,
        }}
      >
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            On Track
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#10b981' }}>
            {MOCK_METRICS.filter(m => m.status === 'on-track').length}
          </Typography>
        </Card>
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            Flagged
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#f59e0b' }}>
            {MOCK_METRICS.filter(m => m.status === 'flagged').length}
          </Typography>
        </Card>
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            Off Track
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#ef4444' }}>
            {MOCK_METRICS.filter(m => m.status === 'off-track').length}
          </Typography>
        </Card>
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
            Total Metrics
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {MOCK_METRICS.length}
          </Typography>
        </Card>
      </Box>

      {/* Metrics Table */}
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th
                  style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}
                >
                  Metric
                </th>
                <th
                  style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}
                >
                  Owner
                </th>
                <th
                  style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#475569' }}
                >
                  Current
                </th>
                <th
                  style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#475569' }}
                >
                  Target
                </th>
                <th
                  style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#475569' }}
                >
                  WoW
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#475569',
                  }}
                >
                  Trend
                </th>
                <th
                  style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#475569',
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.map(metric => {
                const wowChange = calculateWoWChange(metric);
                const streak = metric.streak;
                const weeklyHistory = WEEKLY_HISTORY[metric.id] || [];
                const colors = getStatusColor(metric.status);

                return (
                  <tr
                    key={metric.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: 'white',
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {metric.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {metric.category === 'leading' ? 'Leading' : 'Lagging'}
                        </Typography>
                      </Box>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {metric.owner}
                      </Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {metric.currentValue.toLocaleString()}
                      </Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {metric.target.toLocaleString()}
                      </Typography>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: 0.5,
                        }}
                      >
                        {wowChange > 0 ? (
                          <TrendingUp size={16} color="#10b981" />
                        ) : wowChange < 0 ? (
                          <TrendingDown size={16} color="#ef4444" />
                        ) : null}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color:
                              wowChange > 0 ? '#10b981' : wowChange < 0 ? '#ef4444' : '#64748b',
                          }}
                        >
                          {wowChange > 0 ? '+' : ''}
                          {wowChange.toFixed(1)}%
                        </Typography>
                      </Box>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {weeklyHistory.slice(-8).map((value: number, index: number) => {
                          const maxValue = Math.max(...weeklyHistory);
                          const height = (value / maxValue) * 24;
                          return (
                            <Box
                              key={index}
                              sx={{
                                width: 4,
                                height: `${height}px`,
                                backgroundColor:
                                  index === weeklyHistory.length - 1 ? '#e91e63' : '#cbd5e1',
                                borderRadius: 0.5,
                              }}
                            />
                          );
                        })}
                      </Box>
                      {streak !== 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: streak > 0 ? '#10b981' : '#ef4444',
                            fontWeight: 500,
                          }}
                        >
                          {streak > 0 ? '↑' : '↓'} {Math.abs(streak)}w
                        </Typography>
                      )}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          backgroundColor: colors.bg,
                          border: `1px solid ${colors.border}`,
                          borderRadius: 1,
                        }}
                      >
                        {getStatusIcon(metric.status)}
                        <Typography variant="caption" sx={{ color: colors.text, fontWeight: 500 }}>
                          {metric.status === 'on-track'
                            ? 'On Track'
                            : metric.status === 'off-track'
                              ? 'Off Track'
                              : 'Flagged'}
                        </Typography>
                      </Box>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  );
}

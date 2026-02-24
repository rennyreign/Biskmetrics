import { Box, Typography, Card } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import type { ScorecardSummary } from '@/types/eos-scorecard';

interface ExecutiveSnapshotProps {
  summary: ScorecardSummary;
}

export function ExecutiveSnapshot({ summary }: ExecutiveSnapshotProps) {
  const getPacingBadge = (percent: number) => {
    if (percent >= 85) {
      return { label: 'Stable', color: '#10b981', bg: '#f0fdf4' };
    } else if (percent >= 70) {
      return { label: 'Watch', color: '#f59e0b', bg: '#fef3c7' };
    } else {
      return { label: 'At Risk', color: '#ef4444', bg: '#fef2f2' };
    }
  };

  const leadingBadge = getPacingBadge(summary.leadingPacingPercent);
  const laggingBadge = getPacingBadge(summary.laggingPacingPercent);

  return (
    <Card sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TrendingUp size={20} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Executive Snapshot
        </Typography>
      </Box>

      {/* Weekly Status Summary */}
      <Typography
        variant="caption"
        sx={{ color: '#64748b', textTransform: 'uppercase', mb: 2, display: 'block' }}
      >
        Weekly Status Summary
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
        <Box
          sx={{
            p: 3,
            bgcolor: '#f0fdf4',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#10b981', mb: 0.5 }}>
            {summary.metricsOnTrack}
          </Typography>
          <Typography variant="body2" sx={{ color: '#15803d' }}>
            Metrics On Track
          </Typography>
        </Box>
        <Box
          sx={{
            p: 3,
            bgcolor: '#fef2f2',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#ef4444', mb: 0.5 }}>
            {summary.metricsOffTrack}
          </Typography>
          <Typography variant="body2" sx={{ color: '#dc2626' }}>
            Metrics Off Track
          </Typography>
        </Box>
        <Box
          sx={{
            p: 3,
            bgcolor: '#fef3c7',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#f59e0b', mb: 0.5 }}>
            {summary.metricsFlagged}
          </Typography>
          <Typography variant="body2" sx={{ color: '#d97706' }}>
            Flagged for IDS
          </Typography>
        </Box>
      </Box>

      {/* Quarter Pacing Summary */}
      <Typography
        variant="caption"
        sx={{ color: '#64748b', textTransform: 'uppercase', mb: 2, display: 'block' }}
      >
        Quarter Pacing Summary
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Leading Indicators
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {summary.leadingOnTrack} of {summary.leadingTotal} on track
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {Math.round(summary.leadingPacingPercent)}%
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                bgcolor: leadingBadge.bg,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: leadingBadge.color,
                }}
              />
              <Typography variant="caption" sx={{ color: leadingBadge.color, fontWeight: 600 }}>
                {leadingBadge.label}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Lagging Indicators
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {summary.laggingOnTrack} of {summary.laggingTotal} on track
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {Math.round(summary.laggingPacingPercent)}%
            </Typography>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                bgcolor: laggingBadge.bg,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: laggingBadge.color,
                }}
              />
              <Typography variant="caption" sx={{ color: laggingBadge.color, fontWeight: 600 }}>
                {laggingBadge.label}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

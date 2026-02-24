import { Box, Typography, Card, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import type { Program } from '@/types/program';

interface FunnelViewProps {
  program: Program;
}

interface FunnelStage {
  name: string;
  count: number;
  rate?: number;
  color: string;
}

export function FunnelView({ program }: FunnelViewProps) {
  const stages: FunnelStage[] = [
    {
      name: 'Inquiries',
      count: program.funnel.inquiries,
      color: '#3b82f6',
    },
    {
      name: 'Opportunities',
      count: program.funnel.opportunities,
      rate: program.conversions.inquiryToOpportunityRate ?? undefined,
      color: '#8b5cf6',
    },
    {
      name: 'Applications',
      count: program.funnel.applications,
      rate: program.conversions.opportunityToApplicationRate ?? undefined,
      color: '#ec4899',
    },
    {
      name: 'Enrollments',
      count: program.funnel.enrollments,
      rate: program.conversions.applicationToEnrollmentRate ?? undefined,
      color: '#10b981',
    },
  ];

  const maxCount = program.funnel.inquiries;

  // Calculate drop-off percentages
  const dropoffs = [
    {
      from: 'Inquiries',
      to: 'Opportunities',
      lost: program.funnel.inquiries - program.funnel.opportunities,
      percentage:
        ((program.funnel.inquiries - program.funnel.opportunities) / program.funnel.inquiries) *
        100,
    },
    {
      from: 'Opportunities',
      to: 'Applications',
      lost: program.funnel.opportunities - program.funnel.applications,
      percentage:
        ((program.funnel.opportunities - program.funnel.applications) /
          program.funnel.opportunities) *
        100,
    },
    {
      from: 'Applications',
      to: 'Enrollments',
      lost: program.funnel.applications - program.funnel.enrollments,
      percentage:
        ((program.funnel.applications - program.funnel.enrollments) / program.funnel.applications) *
        100,
    },
  ];

  // Identify biggest drop-off
  const biggestDropoff = dropoffs.reduce((max, current) =>
    current.percentage > max.percentage ? current : max
  );

  return (
    <Box>
      {/* Funnel Visualization */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Conversion Funnel
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {stages.map((stage, index) => (
            <Box key={stage.name}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {stage.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {stage.count.toLocaleString()}
                  </Typography>
                  {stage.rate !== undefined && (
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      ({stage.rate.toFixed(1)}% conversion)
                    </Typography>
                  )}
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stage.count / maxCount) * 100}
                sx={{
                  height: 24,
                  borderRadius: 1,
                  backgroundColor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: stage.color,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </Card>

      {/* Conversion Rates Summary */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Conversion Rates
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Inquiry → Opportunity
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {program.conversions.inquiryToOpportunityRate?.toFixed(1) ?? 'N/A'}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Opportunity → Application
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {program.conversions.opportunityToApplicationRate?.toFixed(1) ?? 'N/A'}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Application → Enrollment
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {program.conversions.applicationToEnrollmentRate?.toFixed(1) ?? 'N/A'}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Lead → Enrollment
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#10b981' }}>
              {program.conversions.leadToEnrollmentRate?.toFixed(1) ?? 'N/A'}%
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Drop-off Analysis */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Drop-off Analysis
        </Typography>

        <Box
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 2,
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <AlertCircle size={20} color="#dc2626" />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626', mb: 0.5 }}>
              Largest Drop-off: {biggestDropoff.from} → {biggestDropoff.to}
            </Typography>
            <Typography variant="body2" sx={{ color: '#991b1b' }}>
              {biggestDropoff.lost.toLocaleString()} leads lost (
              {biggestDropoff.percentage.toFixed(1)}% drop-off)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dropoffs.map(dropoff => (
            <Box
              key={`${dropoff.from}-${dropoff.to}`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                backgroundColor: '#f8fafc',
                borderRadius: 1,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {dropoff.from} → {dropoff.to}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {dropoff.lost.toLocaleString()} leads lost
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {dropoff.percentage > 70 ? (
                  <TrendingDown size={18} color="#dc2626" />
                ) : (
                  <TrendingUp size={18} color="#10b981" />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: dropoff.percentage > 70 ? '#dc2626' : '#64748b',
                  }}
                >
                  {dropoff.percentage.toFixed(1)}% drop-off
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

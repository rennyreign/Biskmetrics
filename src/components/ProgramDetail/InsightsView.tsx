import { Box, Typography, Card, Chip } from '@mui/material';
import { AlertCircle, TrendingUp, TrendingDown, Target, DollarSign, Users } from 'lucide-react';
import type { Program } from '@/types/program';
import { generateRecommendation } from '@/lib/recommendationEngine';
import { calculateCompletenessScore } from '@/lib/dataQuality';

interface InsightsViewProps {
  program: Program;
}

export function InsightsView({ program }: InsightsViewProps) {
  const recommendation = generateRecommendation(program);
  const dataQuality = calculateCompletenessScore(program);

  // Generate insights based on program data
  const insights: Array<{
    type: 'positive' | 'negative' | 'neutral' | 'warning';
    icon: React.ReactNode;
    title: string;
    description: string;
  }> = [];

  // Enrollment rate insights
  const enrollmentRate = program.conversions.leadToEnrollmentRate ?? 0;
  if (enrollmentRate > 10) {
    insights.push({
      type: 'positive',
      icon: <TrendingUp size={20} />,
      title: 'Strong Conversion Performance',
      description: `${enrollmentRate.toFixed(1)}% lead-to-enrollment rate is above average. This program converts leads efficiently.`,
    });
  } else if (enrollmentRate < 3) {
    insights.push({
      type: 'negative',
      icon: <TrendingDown size={20} />,
      title: 'Low Conversion Rate',
      description: `${enrollmentRate.toFixed(1)}% lead-to-enrollment rate suggests conversion challenges. Review lead quality and nurture process.`,
    });
  }

  // Volume insights
  if (program.leads > 500) {
    insights.push({
      type: 'positive',
      icon: <Users size={20} />,
      title: 'High Lead Volume',
      description: `${program.leads.toLocaleString()} leads provides strong statistical significance for decision-making.`,
    });
  } else if (program.leads < 50) {
    insights.push({
      type: 'warning',
      icon: <AlertCircle size={20} />,
      title: 'Limited Data Volume',
      description: `Only ${program.leads} leads. Metrics may not be statistically reliable. Consider longer time window.`,
    });
  }

  // Funnel drop-off insights
  const inquiryToOpp = program.funnel.opportunities / program.funnel.inquiries;
  const oppToApp = program.funnel.applications / program.funnel.opportunities;
  const appToEnroll = program.funnel.enrollments / program.funnel.applications;

  if (inquiryToOpp < 0.15) {
    insights.push({
      type: 'negative',
      icon: <Target size={20} />,
      title: 'High Early-Stage Drop-off',
      description: `${((1 - inquiryToOpp) * 100).toFixed(1)}% of inquiries don't convert to opportunities. Review lead qualification criteria.`,
    });
  }

  if (appToEnroll < 0.3) {
    insights.push({
      type: 'warning',
      icon: <AlertCircle size={20} />,
      title: 'Application-to-Enrollment Gap',
      description: `Only ${(appToEnroll * 100).toFixed(1)}% of applications convert to enrollments. Review enrollment barriers and financial aid process.`,
    });
  }

  // ROI insights
  const cpe = (program.spend?.totalSpend ?? 0) / program.funnel.enrollments;
  if (cpe > 5000) {
    insights.push({
      type: 'warning',
      icon: <DollarSign size={20} />,
      title: 'High Cost Per Enrollment',
      description: `$${cpe.toFixed(2)} CPE is elevated. Consider optimizing spend allocation or improving conversion rates.`,
    });
  } else if (cpe < 1000) {
    insights.push({
      type: 'positive',
      icon: <DollarSign size={20} />,
      title: 'Excellent ROI',
      description: `$${cpe.toFixed(2)} CPE indicates highly efficient spend. This program is a strong performer.`,
    });
  }

  // Data quality insight
  if (dataQuality.status === 'unreliable') {
    insights.push({
      type: 'warning',
      icon: <AlertCircle size={20} />,
      title: 'Data Completeness Issues',
      description: `Missing ${dataQuality.missingFields.length} key metrics: ${dataQuality.missingFields.join(', ')}. Insights may be incomplete.`,
    });
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return { bg: '#f0fdf4', border: '#86efac', text: '#15803d' };
      case 'negative':
        return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' };
      case 'warning':
        return { bg: '#fef3c7', border: '#fde68a', text: '#d97706' };
      default:
        return { bg: '#f8fafc', border: '#cbd5e1', text: '#475569' };
    }
  };

  return (
    <Box>
      {/* Recommendation Summary */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Investment Recommendation
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={recommendation.action.charAt(0).toUpperCase() + recommendation.action.slice(1)}
            sx={{
              backgroundColor:
                recommendation.action === 'increase'
                  ? '#10b981'
                  : recommendation.action === 'reduce'
                    ? '#ef4444'
                    : recommendation.action === 'pause'
                      ? '#dc2626'
                      : '#64748b',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Confidence: {recommendation.confidence}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#475569' }}>
          {recommendation.reasoning}
        </Typography>
      </Card>

      {/* Insights */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Key Insights
      </Typography>

      {insights.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            No significant insights detected. Program performance is within normal ranges.
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {insights.map((insight, index) => {
            const colors = getInsightColor(insight.type);
            return (
              <Card
                key={index}
                sx={{
                  p: 2,
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ color: colors.text, mt: 0.5 }}>{insight.icon}</Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: colors.text, mb: 0.5 }}
                    >
                      {insight.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      {insight.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

import { Chip, Tooltip, Box } from '@mui/material';
import { TrendingUp, Minus, TrendingDown, Pause } from 'lucide-react';
import type { BudgetRecommendation } from '@/types/metrics';

interface BudgetRecommendationBadgeProps {
  recommendation: BudgetRecommendation;
  size?: 'small' | 'medium';
}

export function BudgetRecommendationBadge({
  recommendation,
  size = 'small',
}: BudgetRecommendationBadgeProps) {
  const getActionConfig = (action: BudgetRecommendation['action']) => {
    switch (action) {
      case 'increase':
        return {
          icon: <TrendingUp size={14} />,
          label: 'Increase',
          bgcolor: '#d1fae5',
          color: '#065f46',
        };
      case 'hold':
        return {
          icon: <Minus size={14} />,
          label: 'Hold',
          bgcolor: '#dbeafe',
          color: '#1e40af',
        };
      case 'reduce':
        return {
          icon: <TrendingDown size={14} />,
          label: 'Reduce',
          bgcolor: '#fef3c7',
          color: '#92400e',
        };
      case 'pause':
        return {
          icon: <Pause size={14} />,
          label: 'Pause',
          bgcolor: '#fee2e2',
          color: '#991b1b',
        };
    }
  };

  const getConfidenceBadge = (confidence: BudgetRecommendation['confidence']) => {
    const colors = {
      high: '#065f46',
      medium: '#92400e',
      low: '#64748b',
    };
    return (
      <Box
        component="span"
        sx={{
          fontSize: '10px',
          fontWeight: 600,
          color: colors[confidence],
          textTransform: 'uppercase',
          ml: 0.5,
        }}
      >
        ({confidence})
      </Box>
    );
  };

  const config = getActionConfig(recommendation.action);

  const tooltipContent = (
    <Box sx={{ p: 0.5, maxWidth: 300 }}>
      <Box sx={{ fontWeight: 600, mb: 1 }}>Budget Recommendation: {config.label}</Box>
      <Box sx={{ fontSize: '12px', mb: 0.5 }}>
        <strong>Confidence:</strong> {recommendation.confidence}
      </Box>
      <Box sx={{ fontSize: '12px', opacity: 0.9 }}>{recommendation.reasoning}</Box>
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Chip
        icon={config.icon}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {config.label}
            {getConfidenceBadge(recommendation.confidence)}
          </Box>
        }
        size={size}
        sx={{
          bgcolor: config.bgcolor,
          color: config.color,
          height: size === 'small' ? '20px' : '24px',
          fontSize: size === 'small' ? '11px' : '12px',
          fontWeight: 500,
          '& .MuiChip-icon': {
            color: config.color,
            marginLeft: '6px',
          },
        }}
      />
    </Tooltip>
  );
}

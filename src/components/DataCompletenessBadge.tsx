import { Chip, Tooltip, Box } from '@mui/material';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import type { DataCompletenessScore } from '@/types/metrics';

interface DataCompletenessBadgeProps {
  completeness: DataCompletenessScore;
  size?: 'small' | 'medium';
}

export function DataCompletenessBadge({
  completeness,
  size = 'small',
}: DataCompletenessBadgeProps) {
  const getStatusConfig = (status: DataCompletenessScore['status']) => {
    switch (status) {
      case 'complete':
        return {
          icon: <CheckCircle2 size={14} />,
          label: 'Complete',
          bgcolor: '#d1fae5',
          color: '#065f46',
        };
      case 'partial':
        return {
          icon: <AlertCircle size={14} />,
          label: 'Partial',
          bgcolor: '#fef3c7',
          color: '#92400e',
        };
      case 'unreliable':
        return {
          icon: <XCircle size={14} />,
          label: 'Unreliable',
          bgcolor: '#fee2e2',
          color: '#991b1b',
        };
    }
  };

  const config = getStatusConfig(completeness.status);

  const tooltipContent = (
    <Box sx={{ p: 0.5 }}>
      <Box sx={{ fontWeight: 600, mb: 1 }}>Data Quality: {Math.round(completeness.overall)}%</Box>
      {completeness.missingFields.length > 0 && (
        <>
          <Box sx={{ fontSize: '12px', mb: 0.5, opacity: 0.9 }}>Missing fields:</Box>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '12px' }}>
            {completeness.missingFields.slice(0, 5).map((field: string) => (
              <li key={field}>{field}</li>
            ))}
            {completeness.missingFields.length > 5 && (
              <li>...and {completeness.missingFields.length - 5} more</li>
            )}
          </Box>
        </>
      )}
      {completeness.status === 'complete' && (
        <Box sx={{ fontSize: '12px', opacity: 0.9 }}>All required fields present</Box>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Chip
        icon={config.icon}
        label={config.label}
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

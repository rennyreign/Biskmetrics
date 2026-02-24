import { Box, Typography, Card } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import type { Program } from '@/types/program';

interface TrendsViewProps {
  program: Program;
}

export function TrendsView({ program }: TrendsViewProps) {
  return (
    <Box>
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <TrendingUp size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Trends View Coming Soon
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Historical performance trends and time-series analysis will be available once we integrate
          with HubSpot API for historical data.
        </Typography>
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8fafc',
            borderRadius: 1,
            textAlign: 'left',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Planned Features:
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
            • 8-week funnel performance trends
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
            • Cost efficiency over time
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
            • Conversion rate trends by stage
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
            • Seasonal patterns and anomaly detection
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            • Week-over-week delta indicators
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

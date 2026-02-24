import { Box, Typography, Card } from '@mui/material';
import { TrendingUp, BarChart3 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TrendData, Pipeline } from '@/types/eos-scorecard';

interface TrendChartsProps {
  trends: TrendData;
  pipeline: Pipeline;
}

export function TrendCharts({ trends }: TrendChartsProps) {
  // Prepare data for line chart
  const lineChartData = trends.weeks.map((week, index) => ({
    week,
    costPerLead: trends.costPerLead[index],
    visitorToInquiry: trends.visitorToInquiry[index],
  }));

  // Calculate 8-week change
  const costPerLeadChange =
    trends.costPerLead.length > 0
      ? ((trends.costPerLead[trends.costPerLead.length - 1] - trends.costPerLead[0]) /
          trends.costPerLead[0]) *
        100
      : 0;

  const visitorToInquiryChange =
    trends.visitorToInquiry.length > 0
      ? ((trends.visitorToInquiry[trends.visitorToInquiry.length - 1] -
          trends.visitorToInquiry[0]) /
          trends.visitorToInquiry[0]) *
        100
      : 0;

  // Prepare data for funnel chart
  const funnelData = [
    { stage: 'Visitors', value: trends.funnelData.visitors, conversion: 100 },
    {
      stage: 'Inquiries',
      value: trends.funnelData.inquiries,
      conversion: (trends.funnelData.inquiries / trends.funnelData.visitors) * 100,
    },
    {
      stage: 'Opportunities',
      value: trends.funnelData.opportunities,
      conversion: (trends.funnelData.opportunities / trends.funnelData.inquiries) * 100,
    },
    { stage: 'Applications', value: trends.funnelData.applications, conversion: 0 },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      {/* 8-Week Performance Trends */}
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TrendingUp size={20} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            8-Week Performance Trends
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#cbd5e1"
              label={{
                value: 'Cost per Lead ($)',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#cbd5e1"
              label={{
                value: 'Visitor to Inquiry (%)',
                angle: 90,
                position: 'insideRight',
                style: { fontSize: 12, fill: '#64748b' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="costPerLead"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Cost per Lead ($)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="visitorToInquiry"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Visitor to Inquiry (%)"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 3 }}>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600 }}>
              Cost per Lead
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', my: 0.5 }}>
              ${trends.costPerLead[trends.costPerLead.length - 1]}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: costPerLeadChange < 0 ? '#10b981' : '#ef4444' }}
            >
              {costPerLeadChange < 0 ? '↓' : '↑'} {Math.abs(costPerLeadChange).toFixed(1)}% (8
              weeks)
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
              Visitor to Inquiry
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', my: 0.5 }}>
              {trends.visitorToInquiry[trends.visitorToInquiry.length - 1].toFixed(1)}%
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: visitorToInquiryChange > 0 ? '#10b981' : '#ef4444' }}
            >
              {visitorToInquiryChange > 0 ? '↑' : '↓'} {Math.abs(visitorToInquiryChange).toFixed(1)}
              % (8 weeks)
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Marketing Funnel */}
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <BarChart3 size={20} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Marketing Funnel (Current Week)
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} stroke="#cbd5e1" />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 12, fill: '#64748b' }}
              stroke="#cbd5e1"
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Funnel Stats */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {funnelData.map((item, index) => (
            <Box
              key={item.stage}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                {item.stage}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.value.toLocaleString()}
                </Typography>
                {index > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748b', minWidth: 60, textAlign: 'right' }}
                  >
                    {item.conversion.toFixed(1)}% conv
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

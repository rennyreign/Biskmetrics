import { Box, Typography, Card, TextField, Slider, Button } from '@mui/material';
import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import type { Program } from '@/types/program';
import { calculateROIMetrics } from '@/lib/metricsEngine';

interface ROICalculatorProps {
  program: Program;
}

export function ROICalculator({ program }: ROICalculatorProps) {
  const currentROI = calculateROIMetrics(program.spend?.totalSpend ?? 0, program.funnel);

  // Scenario modeling state
  const [spendMultiplier, setSpendMultiplier] = useState(1);
  const [conversionBoost, setConversionBoost] = useState(0);

  // Calculate scenario metrics
  const scenarioSpend = (program.spend?.totalSpend ?? 0) * spendMultiplier;
  const scenarioEnrollmentRate = Math.min(
    (program.conversions.leadToEnrollmentRate ?? 5) * (1 + conversionBoost / 100),
    100
  );
  const scenarioEnrollments = Math.round(program.funnel.inquiries * (scenarioEnrollmentRate / 100));
  const scenarioCPE = scenarioEnrollments > 0 ? scenarioSpend / scenarioEnrollments : 0;

  const handleReset = () => {
    setSpendMultiplier(1);
    setConversionBoost(0);
  };

  return (
    <Box>
      {/* Current ROI Metrics */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Calculator size={24} color="#e91e63" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Current ROI Metrics
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Cost Per Lead
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#3b82f6' }}>
              ${(currentROI.costPerLead ?? 0).toFixed(2)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Cost Per Opportunity
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#8b5cf6' }}>
              ${(currentROI.costPerOpportunity ?? 0).toFixed(2)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Cost Per Application
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ec4899' }}>
              ${(currentROI.costPerApplication ?? 0).toFixed(2)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
              Cost Per Enrollment
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#10b981' }}>
              ${(currentROI.costPerEnrollment ?? 0).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            <strong>Total Spend:</strong> ${(program.spend?.totalSpend ?? 0).toLocaleString()} •{' '}
            <strong>Enrollments:</strong> {program.funnel.enrollments} •{' '}
            <strong>Conversion Rate:</strong>{' '}
            {(program.conversions.leadToEnrollmentRate ?? 0).toFixed(1)}%
          </Typography>
        </Box>
      </Card>

      {/* Scenario Modeling */}
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TrendingUp size={24} color="#e91e63" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Scenario Modeling
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Adjust spend and conversion assumptions to model different scenarios
        </Typography>

        {/* Spend Multiplier */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Spend Adjustment
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Slider
              value={spendMultiplier}
              onChange={(_, value) => setSpendMultiplier(value as number)}
              min={0.5}
              max={2}
              step={0.1}
              marks={[
                { value: 0.5, label: '-50%' },
                { value: 1, label: 'Current' },
                { value: 2, label: '+100%' },
              ]}
              sx={{
                flex: 1,
                '& .MuiSlider-thumb': { color: '#e91e63' },
                '& .MuiSlider-track': { color: '#e91e63' },
                '& .MuiSlider-rail': { color: '#cbd5e1' },
              }}
            />
            <TextField
              value={`$${scenarioSpend.toLocaleString()}`}
              InputProps={{ readOnly: true }}
              sx={{ width: 150 }}
              size="small"
            />
          </Box>
        </Box>

        {/* Conversion Boost */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Conversion Rate Improvement
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Slider
              value={conversionBoost}
              onChange={(_, value) => setConversionBoost(value as number)}
              min={-20}
              max={50}
              step={5}
              marks={[
                { value: -20, label: '-20%' },
                { value: 0, label: 'Current' },
                { value: 50, label: '+50%' },
              ]}
              sx={{
                flex: 1,
                '& .MuiSlider-thumb': { color: '#10b981' },
                '& .MuiSlider-track': { color: '#10b981' },
                '& .MuiSlider-rail': { color: '#cbd5e1' },
              }}
            />
            <TextField
              value={`${scenarioEnrollmentRate.toFixed(1)}%`}
              InputProps={{ readOnly: true }}
              sx={{ width: 150 }}
              size="small"
            />
          </Box>
        </Box>

        {/* Scenario Results */}
        <Box
          sx={{
            p: 3,
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
            Projected Scenario Results
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                Projected Enrollments
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#15803d' }}>
                {scenarioEnrollments}
              </Typography>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                {scenarioEnrollments > program.funnel.enrollments ? '+' : ''}
                {scenarioEnrollments - program.funnel.enrollments} vs current
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                Projected CPE
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#15803d' }}>
                ${scenarioCPE.toFixed(2)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                {scenarioCPE < (currentROI.costPerEnrollment ?? 0) ? 'Better' : 'Worse'} than
                current
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                Total Investment
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#15803d' }}>
                ${scenarioSpend.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#15803d' }}>
                {((spendMultiplier - 1) * 100).toFixed(0)}% vs current
              </Typography>
            </Box>
          </Box>
        </Box>

        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            textTransform: 'none',
            borderColor: '#cbd5e1',
            color: '#64748b',
            '&:hover': {
              borderColor: '#e91e63',
              backgroundColor: '#fef2f2',
            },
          }}
        >
          Reset to Current
        </Button>
      </Card>
    </Box>
  );
}

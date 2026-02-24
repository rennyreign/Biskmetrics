import { useState } from 'react';
import { Box, Card, Chip, IconButton, Collapse } from '@mui/material';
import { ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import type { Program } from '@/types/program';

interface InvestmentInsightsProps {
  programs: Program[];
}

export function InvestmentInsights({ programs }: InvestmentInsightsProps) {
  const [expanded, setExpanded] = useState(false);

  // Count programs by recommendation
  const strongBuys = programs.filter(
    p => p.recommendation?.action === 'increase' && p.recommendation?.confidence === 'high'
  ).length;
  const buys = programs.filter(
    p => p.recommendation?.action === 'increase' && p.recommendation?.confidence !== 'high'
  ).length;
  const holds = programs.filter(p => p.recommendation?.action === 'hold').length;
  const reduces = programs.filter(
    p => p.recommendation?.action === 'reduce' || p.recommendation?.action === 'pause'
  ).length;

  return (
    <Card sx={{ mb: 3, overflow: 'visible' }}>
      {/* Summary Header - Always Visible */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { bgcolor: '#f8fafc' },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DollarSign size={24} className="text-pink-500" />
          <Box>
            <h3 className="text-lg font-bold text-slate-900">Investment Insights</h3>
            <p className="text-sm text-slate-500">
              Strategic recommendations based on multi-factor analysis
            </p>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Summary Counts */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {strongBuys > 0 && (
              <Chip
                label={`${strongBuys} Strong Buy`}
                size="small"
                sx={{
                  bgcolor: '#dcfce7',
                  color: '#166534',
                  fontWeight: 600,
                  border: '1px solid #22c55e',
                }}
              />
            )}
            {buys > 0 && (
              <Chip
                label={`${buys} Buy`}
                size="small"
                sx={{
                  bgcolor: '#dbeafe',
                  color: '#1e40af',
                  fontWeight: 600,
                  border: '1px solid #3b82f6',
                }}
              />
            )}
            {holds > 0 && (
              <Chip
                label={`${holds} Hold`}
                size="small"
                sx={{
                  bgcolor: '#fef3c7',
                  color: '#92400e',
                  fontWeight: 600,
                  border: '1px solid #f59e0b',
                }}
              />
            )}
            {reduces > 0 && (
              <Chip
                label={`${reduces} Reduce`}
                size="small"
                sx={{
                  bgcolor: '#fee2e2',
                  color: '#991b1b',
                  fontWeight: 600,
                  border: '1px solid #ef4444',
                }}
              />
            )}
          </Box>

          <IconButton size="small">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Content */}
      <Collapse
        in={expanded}
        timeout={400}
        sx={{
          '& .MuiCollapse-wrapper': {
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        <Box sx={{ p: 3, pt: 0, borderTop: '1px solid #e2e8f0' }}>
          {/* Top Recommended Programs */}
          {(strongBuys > 0 || buys > 0) && (
            <Box sx={{ mb: 4 }}>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Top Recommended Programs
              </h4>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {programs
                  .filter(
                    p =>
                      p.recommendation?.action === 'increase' &&
                      (p.recommendation?.confidence === 'high' ||
                        p.recommendation?.confidence === 'medium')
                  )
                  .sort((a, b) => {
                    // Sort by confidence (high first) then by reasoning length
                    if (
                      a.recommendation?.confidence === 'high' &&
                      b.recommendation?.confidence !== 'high'
                    )
                      return -1;
                    if (
                      a.recommendation?.confidence !== 'high' &&
                      b.recommendation?.confidence === 'high'
                    )
                      return 1;
                    return 0;
                  })
                  .slice(0, 5)
                  .map(program => (
                    <Box
                      key={program.id}
                      sx={{
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover': { bgcolor: '#f1f5f9' },
                      }}
                    >
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <span className="text-sm font-semibold text-slate-900">
                            {program.programName}
                          </span>
                          <Chip
                            label={program.school}
                            size="small"
                            sx={{
                              bgcolor: '#e2e8f0',
                              color: '#475569',
                              fontSize: '11px',
                              height: '20px',
                            }}
                          />
                        </Box>
                        <p className="text-xs text-slate-500">
                          {program.recommendation?.reasoning}
                        </p>
                      </Box>
                      <Chip
                        label={program.recommendation?.confidence === 'high' ? 'Strong Buy' : 'Buy'}
                        size="small"
                        sx={{
                          bgcolor:
                            program.recommendation?.confidence === 'high' ? '#dcfce7' : '#dbeafe',
                          color:
                            program.recommendation?.confidence === 'high' ? '#166534' : '#1e40af',
                          fontWeight: 600,
                          border:
                            program.recommendation?.confidence === 'high'
                              ? '1px solid #22c55e'
                              : '1px solid #3b82f6',
                        }}
                      />
                    </Box>
                  ))}
              </Box>
            </Box>
          )}

          {/* Recommendation Criteria */}
          <Box sx={{ mb: 4 }}>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Recommendation Criteria</h4>
            <Box
              sx={{
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                p: 3,
              }}
            >
              <p className="text-xs text-slate-600 mb-3">
                Investment recommendations are based on program performance metrics and data
                quality:
              </p>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ minWidth: '140px' }}>
                    <p className="text-xs font-semibold text-slate-700">Lead Volume</p>
                  </Box>
                  <Box>
                    <p className="text-xs text-slate-600">
                      Minimum 50 leads required for reliable analysis
                    </p>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ minWidth: '140px' }}>
                    <p className="text-xs font-semibold text-slate-700">Conversion Rate</p>
                  </Box>
                  <Box>
                    <p className="text-xs text-slate-600">
                      <strong>Excellent:</strong> ≥15% lead to enrollment |{' '}
                      <strong>Minimum:</strong> ≥5%
                    </p>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ minWidth: '140px' }}>
                    <p className="text-xs font-semibold text-slate-700">Cost per Enrollment</p>
                  </Box>
                  <Box>
                    <p className="text-xs text-slate-600">
                      <strong>Excellent:</strong> ≤$2,000 | <strong>Maximum:</strong> ≤$5,000
                    </p>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ minWidth: '140px' }}>
                    <p className="text-xs font-semibold text-slate-700">Data Quality</p>
                  </Box>
                  <Box>
                    <p className="text-xs text-slate-600">
                      Programs with unreliable data are flagged for investigation
                    </p>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Strategic Notes */}
          <Box
            sx={{
              bgcolor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              p: 3,
            }}
          >
            <h4 className="text-sm font-semibold text-amber-900 mb-2">Investment Strategy Notes</h4>
            <ul className="text-xs text-amber-800 space-y-1.5">
              <li>
                <strong>Strong Buy (High Confidence):</strong> Programs with ≥15% conversion rate
                and ≤$2,000 CPE. Scale investment by 25%.
              </li>
              <li>
                <strong>Buy (Medium Confidence):</strong> Programs with solid performance (≥5%
                conversion, ≤$5,000 CPE). Consider gradual increases.
              </li>
              <li>
                <strong>Hold:</strong> Programs meeting minimum thresholds. Maintain current spend
                and monitor performance.
              </li>
              <li>
                <strong>Reduce:</strong> Programs with low conversion rates or high costs.
                Investigate funnel issues before increasing spend.
              </li>
              <li>
                <strong>Pause:</strong> Programs with unreliable data or insufficient lead volume.
                Complete data migration before decisions.
              </li>
            </ul>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}

import { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import type { Program } from '../types';

interface GraphViewProps {
  programs: Program[];
  showSchoolColumn: boolean;
}

type ChartType = 'leads' | 'conversion' | 'scatter';

const COLORS = {
  MSU: '#3b82f6',
  SMU: '#8b5cf6',
  USF: '#ec4899',
  'Emory ECE': '#f59e0b',
  'Emory GBS': '#10b981',
  ECSU: '#06b6d4',
  KEEP: '#f97316'
};

export function GraphView({ programs, showSchoolColumn }: GraphViewProps) {
  const [chartType, setChartType] = useState<ChartType>('leads');

  // Sort programs by leads for better visualization
  const sortedByLeads = [...programs].sort((a, b) => b.leads - a.leads).slice(0, 15);

  // Prepare data for conversion rates chart
  const conversionData = [...programs]
    .filter(p => p.leadToEnrollmentRate != null)
    .sort((a, b) => (b.leadToEnrollmentRate || 0) - (a.leadToEnrollmentRate || 0))
    .slice(0, 15)
    .map(p => ({
      name: p.programName.length > 25 ? p.programName.substring(0, 25) + '...' : p.programName,
      'Lead to Enroll': p.leadToEnrollmentRate,
      'Application Rate': p.applicationRate,
      'Enrollment Rate': p.enrollmentRate,
      school: p.school
    }));

  // Prepare data for scatter plot
  const scatterData = programs
    .filter(p => p.leadToEnrollmentRate != null)
    .map(p => ({
      leads: p.leads,
      conversionRate: p.leadToEnrollmentRate,
      programName: p.programName,
      school: p.school,
      level: p.level
    }));

  if (programs.length === 0) {
    return (
      <Box sx={{ p: 8, textAlign: 'center' }}>
        <p className="text-slate-600 mb-3">No programs found for this filter combination.</p>
        <Button
          onClick={() => window.location.reload()}
          sx={{
            color: '#e91e63',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#fce4ec'
            }
          }}
        >
          Clear filters
        </Button>
      </Box>
    );
  }

  return (
    <div>
      {/* Chart Type Selector */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <ButtonGroup variant="outlined">
          <Button
            onClick={() => setChartType('leads')}
            variant={chartType === 'leads' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'leads' ? '#e91e63' : 'transparent',
              color: chartType === 'leads' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'leads' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              }
            }}
          >
            Leads Volume
          </Button>
          <Button
            onClick={() => setChartType('conversion')}
            variant={chartType === 'conversion' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'conversion' ? '#e91e63' : 'transparent',
              color: chartType === 'conversion' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'conversion' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              }
            }}
          >
            Conversion Rates
          </Button>
          <Button
            onClick={() => setChartType('scatter')}
            variant={chartType === 'scatter' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'scatter' ? '#e91e63' : 'transparent',
              color: chartType === 'scatter' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'scatter' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              }
            }}
          >
            Volume vs Conversion
          </Button>
        </ButtonGroup>
      </Box>

      {/* Chart Display */}
      <div className="px-6 pb-6">
        {chartType === 'leads' && (
          <div>
            <h3 className="text-slate-900 mb-4">Top 15 Programs by Lead Volume</h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={sortedByLeads}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis 
                  dataKey="programName" 
                  type="category" 
                  stroke="#64748b"
                  width={190}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Leads']}
                />
                <Bar dataKey="leads" radius={[0, 8, 8, 0]}>
                  {sortedByLeads.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.school as keyof typeof COLORS] || '#e91e63'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'conversion' && (
          <div>
            <h3 className="text-slate-900 mb-4">Top 15 Programs by Conversion Rates (%)</h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={conversionData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748b"
                  width={190}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                />
                <Legend />
                <Bar dataKey="Lead to Enroll" fill="#e91e63" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Application Rate" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Enrollment Rate" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'scatter' && (
          <div>
            <h3 className="text-slate-900 mb-4">Lead Volume vs Lead to Enrollment Rate</h3>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="leads" 
                  name="Leads"
                  stroke="#64748b"
                  label={{ value: 'Lead Volume', position: 'bottom', offset: 40, style: { fill: '#64748b' } }}
                />
                <YAxis 
                  type="number" 
                  dataKey="conversionRate" 
                  name="Conversion Rate"
                  stroke="#64748b"
                  label={{ value: 'Lead to Enrollment Rate (%)', angle: -90, position: 'left', offset: 40, style: { fill: '#64748b' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="text-sm mb-1">{data.programName}</p>
                          <p className="text-xs text-slate-600 mb-2">{data.school} · {data.level}</p>
                          <p className="text-sm">Leads: {data.leads.toLocaleString()}</p>
                          <p className="text-sm">Conversion: {data.conversionRate.toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Programs" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.school as keyof typeof COLORS] || '#e91e63'}
                      opacity={0.7}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Legend for schools */}
            {showSchoolColumn && (
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                {Object.entries(COLORS).map(([school, color]) => (
                  <div key={school} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, opacity: 0.7 }} />
                    <span className="text-sm text-slate-600">{school}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
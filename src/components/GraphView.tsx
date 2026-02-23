import { useState } from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import type { Program } from '../types/program';

interface GraphViewProps {
  programs: Program[];
  showSchoolColumn: boolean;
}

type ChartType =
  | 'leads'
  | 'contactToEnroll'
  | 'contactToApp'
  | 'leadsVsContactEnroll'
  | 'leadsVsEnrollRates'
  | 'leadsVsApp'
  | 'topPerformers';

const COLORS = {
  MSU: '#3b82f6',
  SMU: '#8b5cf6',
  USF: '#ec4899',
  'Emory ECE': '#f59e0b',
  'Emory GBS': '#10b981',
  ECSU: '#06b6d4',
  KEEP: '#f97316',
};

export function GraphView({ programs, showSchoolColumn }: GraphViewProps) {
  const [chartType, setChartType] = useState<ChartType>('topPerformers');

  // Sort programs by leads for better visualization
  const sortedByLeads = [...programs].sort((a, b) => b.leads - a.leads).slice(0, 15);

  // Prepare data for Contact to Enrollment Rate chart (50+ leads)
  const contactToEnrollData = [...programs]
    .filter(p => p.conversions?.leadToEnrollmentRate != null && p.leads >= 50)
    .sort(
      (a, b) =>
        (b.conversions?.leadToEnrollmentRate || 0) - (a.conversions?.leadToEnrollmentRate || 0)
    )
    .slice(0, 15)
    .map(p => ({
      name: p.programName.length > 30 ? p.programName.substring(0, 30) + '...' : p.programName,
      rate: p.conversions?.leadToEnrollmentRate,
      school: p.school,
      leads: p.leads,
    }));

  // Prepare data for Contact to Application Rate chart
  const contactToAppData = [...programs]
    .filter(p => p.conversions?.contactToApplicationRate != null)
    .sort(
      (a, b) =>
        (b.conversions?.contactToApplicationRate || 0) -
        (a.conversions?.contactToApplicationRate || 0)
    )
    .slice(0, 15)
    .map(p => ({
      name: p.programName.length > 30 ? p.programName.substring(0, 30) + '...' : p.programName,
      rate: p.conversions?.contactToApplicationRate,
      school: p.school,
      leads: p.leads,
    }));

  // Prepare data for Leads vs Enrollment Rates (both Contact to Enroll and Enrollment Rate)
  const leadsVsContactEnrollData = programs
    .filter(p => p.conversions?.leadToEnrollmentRate != null)
    .map(p => ({
      leads: p.leads,
      rate: p.conversions?.leadToEnrollmentRate,
      programName: p.programName,
      school: p.school,
      level: p.level,
    }));

  const leadsVsLeadEnrollData = programs
    .filter(p => p.conversions?.leadToEnrollmentRate != null)
    .map(p => ({
      leads: p.leads,
      rate: p.conversions?.leadToEnrollmentRate,
      programName: p.programName,
      school: p.school,
      level: p.level,
    }));

  // Prepare data for Leads vs Contact to Application scatter plot
  const leadsVsAppData = programs
    .filter(p => p.conversions?.contactToApplicationRate != null)
    .map(p => ({
      leads: p.leads,
      rate: p.conversions?.contactToApplicationRate,
      programName: p.programName,
      school: p.school,
      level: p.level,
    }));

  // Prepare data for Top Performers - profitability-focused scoring
  // Filters: 50+ leads, requires both conversion rates
  // Scoring: Weighted toward conversion efficiency (ROI on ad spend)
  // - Leads provide scale but diminishing returns (log scale)
  // - Contact to Enrollment Rate = funnel efficiency (high weight)
  // - Enrollment Rate = final conversion (highest weight)
  const topPerformersData = (() => {
    // Filter: minimum 50 leads and must have both conversion metrics
    const validPrograms = programs.filter(
      p => p.leads >= 50 && p.conversions?.leadToEnrollmentRate != null
    );

    if (validPrograms.length === 0) return [];

    // Find max values for normalization
    const maxLeads = Math.max(...validPrograms.map(p => p.leads));
    const maxEnrollRate = Math.max(
      ...validPrograms.map(p => p.conversions?.leadToEnrollmentRate || 0)
    );

    // Profitability Score Calculation:
    // - Volume (20%): Log-scaled leads - rewards scale but with diminishing returns
    // - Funnel Efficiency (35%): Contact to Enrollment Rate - how well we convert contacts
    // - Final Conversion (45%): Enrollment Rate - ultimate ROI indicator
    return validPrograms
      .map(p => {
        const enrollRate = p.conversions?.leadToEnrollmentRate || 0;

        // Log-scaled volume score (diminishing returns on raw lead count)
        const volumeScore = (Math.log10(p.leads) / Math.log10(maxLeads)) * 100;
        const enrollScore = (enrollRate / maxEnrollRate) * 100;

        // Weighted profitability score
        const score = volumeScore * 0.3 + enrollScore * 0.7;

        return {
          name: p.programName.length > 30 ? p.programName.substring(0, 30) + '...' : p.programName,
          fullName: p.programName,
          school: p.school,
          level: p.level,
          leads: p.leads,
          leadToEnrollmentRate: enrollRate,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
  })();

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
              bgcolor: '#fce4ec',
            },
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
        <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          <Button
            onClick={() => setChartType('topPerformers')}
            variant={chartType === 'topPerformers' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'topPerformers' ? '#e91e63' : 'transparent',
              color: chartType === 'topPerformers' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'topPerformers' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              },
            }}
          >
            Top Performers
          </Button>
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
              },
            }}
          >
            Lead Volume
          </Button>
          <Button
            onClick={() => setChartType('contactToEnroll')}
            variant={chartType === 'contactToEnroll' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'contactToEnroll' ? '#e91e63' : 'transparent',
              color: chartType === 'contactToEnroll' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'contactToEnroll' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              },
            }}
          >
            Contact to Enroll Rate
          </Button>
          <Button
            onClick={() => setChartType('contactToApp')}
            variant={chartType === 'contactToApp' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'contactToApp' ? '#e91e63' : 'transparent',
              color: chartType === 'contactToApp' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'contactToApp' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              },
            }}
          >
            Contact to App Rate
          </Button>
          <Button
            onClick={() => setChartType('leadsVsContactEnroll')}
            variant={chartType === 'leadsVsContactEnroll' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'leadsVsContactEnroll' ? '#e91e63' : 'transparent',
              color: chartType === 'leadsVsContactEnroll' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'leadsVsContactEnroll' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              },
            }}
          >
            Leads vs Contact to Enroll
          </Button>
          <Button
            onClick={() => setChartType('leadsVsEnrollRates')}
            variant={chartType === 'leadsVsEnrollRates' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'leadsVsEnrollRates' ? '#e91e63' : 'transparent',
              color: chartType === 'leadsVsEnrollRates' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'leadsVsEnrollRates' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              },
            }}
          >
            Leads vs Both Enroll Rates
          </Button>
          <Button
            onClick={() => setChartType('leadsVsApp')}
            variant={chartType === 'leadsVsApp' ? 'contained' : 'outlined'}
            sx={{
              textTransform: 'none',
              bgcolor: chartType === 'leadsVsApp' ? '#e91e63' : 'transparent',
              color: chartType === 'leadsVsApp' ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: chartType === 'leadsVsApp' ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              },
            }}
          >
            Leads vs Contact to App
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
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Leads']}
                />
                <Bar dataKey="leads" radius={[0, 8, 8, 0]}>
                  {sortedByLeads.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.school as keyof typeof COLORS] || '#e91e63'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'contactToEnroll' && (
          <div>
            <h3 className="text-slate-900 mb-4">
              Top 15 Programs by Contact to Enrollment Rate (%)
            </h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={contactToEnrollData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" unit="%" />
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
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium mb-1">{data.name}</p>
                          <p className="text-xs text-slate-600 mb-2">{data.school}</p>
                          <p className="text-sm">Contact to Enroll: {data.rate?.toFixed(1)}%</p>
                          <p className="text-sm">Leads: {data.leads.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                  {contactToEnrollData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.school as keyof typeof COLORS] || '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'contactToApp' && (
          <div>
            <h3 className="text-slate-900 mb-4">
              Top 15 Programs by Contact to Application Rate (%)
            </h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={contactToAppData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" unit="%" />
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
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium mb-1">{data.name}</p>
                          <p className="text-xs text-slate-600 mb-2">{data.school}</p>
                          <p className="text-sm">Contact to App: {data.rate?.toFixed(1)}%</p>
                          <p className="text-sm">Leads: {data.leads.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                  {contactToAppData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.school as keyof typeof COLORS] || '#f59e0b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'leadsVsContactEnroll' && (
          <div>
            <h3 className="text-slate-900 mb-4">Lead Volume vs Contact to Enrollment Rate</h3>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="leads"
                  name="Leads"
                  stroke="#64748b"
                  label={{
                    value: 'Lead Volume',
                    position: 'bottom',
                    offset: 40,
                    style: { fill: '#64748b' },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="rate"
                  name="Contact to Enrollment Rate"
                  stroke="#64748b"
                  unit="%"
                  label={{
                    value: 'Contact to Enrollment Rate (%)',
                    angle: -90,
                    position: 'left',
                    offset: 40,
                    style: { fill: '#64748b' },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium mb-1">{data.programName}</p>
                          <p className="text-xs text-slate-600 mb-2">
                            {data.school} · {data.level}
                          </p>
                          <p className="text-sm">Leads: {data.leads.toLocaleString()}</p>
                          <p className="text-sm">Contact to Enroll: {data.rate?.toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Programs" data={leadsVsContactEnrollData}>
                  {leadsVsContactEnrollData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.school as keyof typeof COLORS] || '#10b981'}
                      opacity={0.7}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Legend for schools */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {Object.entries(COLORS).map(([school, color]) => (
                <div key={school} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color, opacity: 0.7 }}
                  />
                  <span className="text-sm text-slate-600">{school}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartType === 'leadsVsEnrollRates' && (
          <div>
            <h3 className="text-slate-900 mb-4">Lead Volume vs Both Enrollment Rates</h3>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="leads"
                  name="Leads"
                  stroke="#64748b"
                  label={{
                    value: 'Lead Volume',
                    position: 'bottom',
                    offset: 40,
                    style: { fill: '#64748b' },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="rate"
                  name="Enrollment Rate"
                  stroke="#64748b"
                  unit="%"
                  label={{
                    value: 'Enrollment Rate (%)',
                    angle: -90,
                    position: 'left',
                    offset: 40,
                    style: { fill: '#64748b' },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const seriesName = payload[0].name;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium mb-1">{data.programName}</p>
                          <p className="text-xs text-slate-600 mb-2">
                            {data.school} · {data.level}
                          </p>
                          <p className="text-sm">Leads: {data.leads.toLocaleString()}</p>
                          <p className="text-sm">
                            {seriesName}: {data.rate?.toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter name="Contact to Enroll" data={leadsVsContactEnrollData} fill="#10b981">
                  {leadsVsContactEnrollData.map((_, index) => (
                    <Cell key={`contact-${index}`} fill="#10b981" opacity={0.7} />
                  ))}
                </Scatter>
                <Scatter name="Enrollment Rate" data={leadsVsLeadEnrollData} fill="#e91e63">
                  {leadsVsLeadEnrollData.map((_, index) => (
                    <Cell key={`lead-${index}`} fill="#e91e63" opacity={0.7} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'leadsVsApp' && (
          <div>
            <h3 className="text-slate-900 mb-4">Lead Volume vs Contact to Application Rate</h3>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="leads"
                  name="Leads"
                  stroke="#64748b"
                  label={{
                    value: 'Lead Volume',
                    position: 'bottom',
                    offset: 40,
                    style: { fill: '#64748b' },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="rate"
                  name="Contact to Application Rate"
                  stroke="#64748b"
                  unit="%"
                  label={{
                    value: 'Contact to Application Rate (%)',
                    angle: -90,
                    position: 'left',
                    offset: 40,
                    style: { fill: '#64748b' },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium mb-1">{data.programName}</p>
                          <p className="text-xs text-slate-600 mb-2">
                            {data.school} · {data.level}
                          </p>
                          <p className="text-sm">Leads: {data.leads.toLocaleString()}</p>
                          <p className="text-sm">Contact to App: {data.rate?.toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Programs" data={leadsVsAppData}>
                  {leadsVsAppData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.school as keyof typeof COLORS] || '#f59e0b'}
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
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color, opacity: 0.7 }}
                    />
                    <span className="text-sm text-slate-600">{school}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {chartType === 'topPerformers' && (
          <div>
            <h3 className="text-slate-900 mb-2">Top 15 Programs by Profitability Potential</h3>
            <p className="text-sm text-slate-500 mb-4">
              Programs with 50+ leads scored by: Volume (20%) + Contact to Enroll Rate (35%) +
              Enrollment Rate (45%)
            </p>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={topPerformersData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" domain={[0, 100]} unit="" />
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
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium mb-1">{data.fullName}</p>
                          <p className="text-xs text-slate-600 mb-2">
                            {data.school} · {data.level}
                          </p>
                          <p className="text-sm font-semibold text-pink-600 mb-2">
                            Score: {data.score.toFixed(1)}
                          </p>
                          <p className="text-sm">Leads: {data.leads.toLocaleString()}</p>
                          <p className="text-sm">
                            Lead to Enrollment: {data.leadToEnrollmentRate?.toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                  {topPerformersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.school as keyof typeof COLORS] || '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Legend for schools */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              {Object.entries(COLORS).map(([school, color]) => (
                <div key={school} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm text-slate-600">{school}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

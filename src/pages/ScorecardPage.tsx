import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { ExecutiveSnapshot } from '@/components/Scorecard/ExecutiveSnapshot';
import { MetricTable } from '@/components/Scorecard/MetricTable';
import { TrendCharts } from '@/components/Scorecard/TrendCharts';
import { EditMetricDialog } from '@/components/Scorecard/EditMetricDialog';
import { AddMetricDialog } from '@/components/Scorecard/AddMetricDialog';
import { useScorecardData } from '@/hooks/useScorecardData';
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';
import type { Pipeline, EOSMetric } from '@/types/eos-scorecard';

const EOS_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ScorecardPage() {
  const [pipeline, setPipeline] = useState<Pipeline>('degree');
  const [currentWeek, setCurrentWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedMetric, setSelectedMetric] = useState<EOSMetric | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMetricDialogOpen, setAddMetricDialogOpen] = useState(false);
  const [eosDay, setEosDay] = useState(1); // Monday by default

  const handleEosDayChange = (newDay: number) => {
    setEosDay(newDay);
    // When user changes EOS day, update the EOS session date to that day
    // Keep the same week, just change which day is the "EOS session day"
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
    const newSessionDate = new Date(weekStart);
    // Add days to get to the selected day (0=Sunday, 1=Monday, etc.)
    const daysToAdd = newDay === 0 ? 6 : newDay - 1; // Sunday wraps to end of week
    newSessionDate.setDate(weekStart.getDate() + daysToAdd);
    setCurrentWeek(newSessionDate);
  };

  const { metrics, summary, trends, updateMetric, addMetric, deleteMetric } = useScorecardData(
    pipeline,
    currentWeek
  );

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const handleMetricClick = (metric: EOSMetric) => {
    setSelectedMetric(metric);
    setEditDialogOpen(true);
  };

  const handleMetricSave = (metricId: string, updates: Partial<EOSMetric>) => {
    updateMetric(metricId, updates);
    setEditDialogOpen(false);
    setSelectedMetric(null);
  };

  const handleAddMetric = (metric: {
    name: string;
    category: 'leading' | 'lagging';
    pipeline: Pipeline;
    owner: string;
    target: number;
    unit: string;
    isCostMetric: boolean;
  }) => {
    // Generate id and sortOrder for the new metric
    const newId = `custom-${Date.now()}`;
    const categoryMetrics = metrics.filter(m => m.category === metric.category);
    const maxSortOrder =
      categoryMetrics.length > 0 ? Math.max(...categoryMetrics.map(m => m.sortOrder ?? 0)) : 0;

    addMetric({
      ...metric,
      id: newId,
      sortOrder: maxSortOrder + 1,
    });
    setAddMetricDialogOpen(false);
  };

  const handleDeleteMetric = (metricId: string) => {
    deleteMetric(metricId);
    setEditDialogOpen(false);
    setSelectedMetric(null);
  };

  const handleReorderMetrics = (reorderedMetrics: EOSMetric[]) => {
    // Update sortOrder for each metric based on new position
    reorderedMetrics.forEach((metric, index) => {
      updateMetric(metric.id, { sortOrder: index + 1 });
    });
  };

  const leadingMetrics = metrics.filter(m => m.category === 'leading');
  const laggingMetrics = metrics.filter(m => m.category === 'lagging');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e2e8f0',
          py: 3,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                Marketing Scorecard
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  EOS Session:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#3b82f6',
                    fontWeight: 600,
                  }}
                >
                  {format(currentWeek, 'EEE, MMM dd, yyyy')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                  <Calendar size={16} color="#64748b" />
                  <Typography variant="caption" sx={{ color: '#64748b', mr: 1 }}>
                    EOS Day:
                  </Typography>
                  <FormControl size="small">
                    <Select
                      value={eosDay}
                      onChange={e => handleEosDayChange(Number(e.target.value))}
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiSelect-select': {
                          py: 0.5,
                          px: 1.5,
                        },
                      }}
                    >
                      {EOS_DAYS.map((day, index) => (
                        <MenuItem key={day} value={index}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Weekly EOS Session - Track execution and outcomes for Marketing
              </Typography>
            </Box>

            {/* Week Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handlePreviousWeek} size="small">
                <ChevronLeft size={20} />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, minWidth: 180, textAlign: 'center' }}
              >
                Week of {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
              </Typography>
              <IconButton onClick={handleNextWeek} size="small">
                <ChevronRight size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* Pipeline Tabs */}
          <Tabs
            value={pipeline}
            onChange={(_, value) => setPipeline(value)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
              },
              '& .Mui-selected': {
                color: '#e91e63 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#e91e63',
              },
            }}
          >
            <Tab label="Degree Pipeline" value="degree" />
            <Tab label="Certificate Pipeline" value="certificate" />
          </Tabs>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Executive Snapshot */}
        <ExecutiveSnapshot summary={summary} />

        {/* Leading Indicators */}
        <Box sx={{ mb: 4 }}>
          <MetricTable
            title="Leading Indicators"
            metrics={leadingMetrics}
            onAddMetric={() => setAddMetricDialogOpen(true)}
            onRowClick={handleMetricClick}
            onReorder={handleReorderMetrics}
          />
        </Box>

        {/* Lagging Indicators */}
        <Box sx={{ mb: 4 }}>
          <MetricTable
            title="Lagging Indicators"
            metrics={laggingMetrics}
            onAddMetric={() => setAddMetricDialogOpen(true)}
            onRowClick={handleMetricClick}
            onReorder={handleReorderMetrics}
          />
        </Box>

        {/* Trend Charts */}
        <TrendCharts trends={trends} pipeline={pipeline} />
      </Container>

      {/* Edit Metric Dialog */}
      <EditMetricDialog
        metric={selectedMetric}
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedMetric(null);
        }}
        onSave={updates => selectedMetric && handleMetricSave(selectedMetric.id, updates)}
        onDelete={metricId => handleDeleteMetric(metricId)}
      />

      {/* Add Metric Dialog */}
      <AddMetricDialog
        open={addMetricDialogOpen}
        onClose={() => setAddMetricDialogOpen(false)}
        onAdd={handleAddMetric}
        pipeline={pipeline}
        existingMetrics={metrics.map(m => m.name)}
      />
    </Box>
  );
}

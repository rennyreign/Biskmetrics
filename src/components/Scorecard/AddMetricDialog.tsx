import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Autocomplete,
  Chip,
} from '@mui/material';
import { X } from 'lucide-react';
import type { Pipeline, MetricCategory } from '@/types/eos-scorecard';

// Available metrics from HubSpot/CRM that can be added to scorecard
const AVAILABLE_METRICS = [
  // Cost Metrics
  { name: 'Cost per Lead', category: 'leading' as MetricCategory, unit: '$', isCostMetric: true },
  { name: 'Cost per MQL', category: 'leading' as MetricCategory, unit: '$', isCostMetric: true },
  { name: 'Cost per SQL', category: 'leading' as MetricCategory, unit: '$', isCostMetric: true },
  { name: 'Cost per Visit', category: 'leading' as MetricCategory, unit: '$', isCostMetric: true },
  { name: 'Cost per Click', category: 'leading' as MetricCategory, unit: '$', isCostMetric: true },
  {
    name: 'Cost per Application',
    category: 'lagging' as MetricCategory,
    unit: '$',
    isCostMetric: true,
  },
  {
    name: 'Cost per Opportunity',
    category: 'lagging' as MetricCategory,
    unit: '$',
    isCostMetric: true,
  },
  {
    name: 'Cost per Enrollment',
    category: 'lagging' as MetricCategory,
    unit: '$',
    isCostMetric: true,
  },

  // Conversion Rate Metrics
  {
    name: 'Visitor to Inquiry',
    category: 'leading' as MetricCategory,
    unit: '%',
    isCostMetric: false,
  },
  {
    name: 'Visitor to Lead',
    category: 'leading' as MetricCategory,
    unit: '%',
    isCostMetric: false,
  },
  { name: 'Lead to MQL', category: 'leading' as MetricCategory, unit: '%', isCostMetric: false },
  { name: 'MQL to SQL', category: 'leading' as MetricCategory, unit: '%', isCostMetric: false },
  {
    name: 'Inquiry to Opportunity Rate',
    category: 'lagging' as MetricCategory,
    unit: '%',
    isCostMetric: false,
  },
  {
    name: 'Opportunity to Application Rate',
    category: 'lagging' as MetricCategory,
    unit: '%',
    isCostMetric: false,
  },
  {
    name: 'Opportunity to Enrollment Rate',
    category: 'lagging' as MetricCategory,
    unit: '%',
    isCostMetric: false,
  },
  {
    name: 'Application to Enrollment Rate',
    category: 'lagging' as MetricCategory,
    unit: '%',
    isCostMetric: false,
  },

  // Volume Metrics
  { name: 'Total Leads', category: 'leading' as MetricCategory, unit: '', isCostMetric: false },
  { name: 'Total MQLs', category: 'leading' as MetricCategory, unit: '', isCostMetric: false },
  { name: 'Total SQLs', category: 'leading' as MetricCategory, unit: '', isCostMetric: false },
  {
    name: 'Total Opportunities',
    category: 'lagging' as MetricCategory,
    unit: '',
    isCostMetric: false,
  },
  {
    name: 'Total Applications',
    category: 'lagging' as MetricCategory,
    unit: '',
    isCostMetric: false,
  },
  {
    name: 'Total Enrollments',
    category: 'lagging' as MetricCategory,
    unit: '',
    isCostMetric: false,
  },
];

interface AddMetricDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (metric: {
    name: string;
    category: MetricCategory;
    pipeline: Pipeline;
    owner: string;
    target: number;
    unit: string;
    isCostMetric: boolean;
  }) => void;
  pipeline: Pipeline;
  existingMetrics: string[]; // Names of metrics already in the scorecard
}

export function AddMetricDialog({
  open,
  onClose,
  onAdd,
  pipeline,
  existingMetrics,
}: AddMetricDialogProps) {
  const [selectedMetric, setSelectedMetric] = useState<(typeof AVAILABLE_METRICS)[0] | null>(null);
  const [owner, setOwner] = useState('');
  const [target, setTarget] = useState<number>(0);

  const availableOptions = AVAILABLE_METRICS.filter(
    metric => !existingMetrics.includes(metric.name)
  );

  const handleAdd = () => {
    if (!selectedMetric || !owner || target === 0) {
      return;
    }

    onAdd({
      name: selectedMetric.name,
      category: selectedMetric.category,
      pipeline,
      owner,
      target,
      unit: selectedMetric.unit,
      isCostMetric: selectedMetric.isCostMetric,
    });

    // Reset form
    setSelectedMetric(null);
    setOwner('');
    setTarget(0);
    onClose();
  };

  const handleClose = () => {
    setSelectedMetric(null);
    setOwner('');
    setTarget(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add Metric to {pipeline === 'degree' ? 'Degree' : 'Certificate'} Pipeline
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Metric Selection with Autosuggest */}
          <Box>
            <Typography
              variant="caption"
              sx={{ color: '#0f172a', mb: 1, display: 'block', fontWeight: 600 }}
            >
              Select Metric *
            </Typography>
            <Autocomplete
              value={selectedMetric}
              onChange={(_, newValue) => setSelectedMetric(newValue)}
              options={availableOptions}
              getOptionLabel={option => option.name}
              groupBy={option =>
                option.category === 'leading' ? 'Leading Indicators' : 'Lagging Indicators'
              }
              renderInput={params => (
                <TextField {...params} placeholder="Search available metrics..." size="small" />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{option.name}</Typography>
                    <Chip
                      label={option.unit || 'count'}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        bgcolor: '#f1f5f9',
                        color: '#64748b',
                      }}
                    />
                  </Box>
                </li>
              )}
              noOptionsText="No available metrics (all metrics already added)"
            />
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
              Metrics are sourced from HubSpot CRM data
            </Typography>
          </Box>

          {/* Show category and unit when metric is selected */}
          {selectedMetric && (
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Category
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {selectedMetric.category}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Unit
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedMetric.unit || 'count'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedMetric.isCostMetric
                      ? 'Cost (lower is better)'
                      : 'Performance (higher is better)'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Target and Owner */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: '#0f172a', mb: 0.5, display: 'block', fontWeight: 600 }}
              >
                Target *
              </Typography>
              <TextField
                type="number"
                value={target || ''}
                onChange={e => setTarget(Number(e.target.value))}
                fullWidth
                size="small"
                placeholder="Enter target value"
              />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: '#0f172a', mb: 0.5, display: 'block', fontWeight: 600 }}
              >
                Owner *
              </Typography>
              <TextField
                value={owner}
                onChange={e => setOwner(e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g., Marketing Manager"
              />
            </Box>
          </Box>

          <Typography variant="caption" sx={{ color: '#64748b', fontStyle: 'italic' }}>
            Current week values will be automatically populated from HubSpot CRM data once the
            metric is added.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!selectedMetric || !owner || target === 0}
          sx={{
            textTransform: 'none',
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
            '&:disabled': { bgcolor: '#cbd5e1' },
          }}
        >
          Add Metric
        </Button>
      </DialogActions>
    </Dialog>
  );
}

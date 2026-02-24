import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';
import type { EOSMetric } from '@/types/eos-scorecard';

interface EditMetricDialogProps {
  metric: EOSMetric | null;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<EOSMetric>) => void;
  onDelete?: (metricId: string) => void;
}

export function EditMetricDialog({
  metric,
  open,
  onClose,
  onSave,
  onDelete,
}: EditMetricDialogProps) {
  const [target, setTarget] = useState(metric?.target ?? 0);
  const [owner, setOwner] = useState(metric?.owner ?? '');
  const [idsHypothesis, setIdsHypothesis] = useState(metric?.idsHypothesis ?? '');
  const [idsAction, setIdsAction] = useState(metric?.idsAction ?? '');

  // Resync form state when metric changes
  useEffect(() => {
    if (metric) {
      setTarget(metric.target);
      setOwner(metric.owner);
      setIdsHypothesis(metric.idsHypothesis ?? '');
      setIdsAction(metric.idsAction ?? '');
    }
  }, [metric]);

  if (!metric) return null;

  const handleSave = () => {
    onSave({
      target,
      owner,
      idsHypothesis: metric.idsFlagged ? idsHypothesis : undefined,
      idsAction: metric.idsFlagged ? idsAction : undefined,
    });
    onClose();
  };

  const handleClose = () => {
    // Reset to original values
    setTarget(metric.target);
    setOwner(metric.owner);
    setIdsHypothesis(metric.idsHypothesis ?? '');
    setIdsAction(metric.idsAction ?? '');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Edit Metric: {metric.name}
            </Typography>
            {metric.idsFlagged && (
              <Chip
                label="IDS Flagged"
                size="small"
                sx={{
                  bgcolor: '#ef4444',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Read-only fields */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block' }}>
              Current Week (Read-only)
            </Typography>
            <TextField
              value={metric.currentValue}
              disabled
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#0f172a',
                  bgcolor: '#f8fafc',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, display: 'block' }}>
              Updated via weekly scorecard submission
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5, display: 'block' }}>
              4-Week Avg (Calculated)
            </Typography>
            <TextField
              value={metric.fourWeekAvg.toFixed(2)}
              disabled
              fullWidth
              size="small"
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#0f172a',
                  bgcolor: '#f8fafc',
                },
              }}
            />
          </Box>
        </Box>

        {/* Editable fields */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: '#0f172a', mb: 0.5, display: 'block', fontWeight: 600 }}
            >
              Target *
            </Typography>
            <TextField
              type="number"
              value={target}
              onChange={e => setTarget(Number(e.target.value))}
              fullWidth
              size="small"
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
            />
          </Box>
        </Box>

        {/* IDS Discussion (only if flagged) */}
        {metric.idsFlagged && (
          <Box sx={{ bgcolor: '#fef3c7', p: 2, borderRadius: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              IDS Discussion
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ color: '#0f172a', mb: 0.5, display: 'block', fontWeight: 600 }}
              >
                Hypothesis
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                What do you think is causing this issue?
              </Typography>
              <TextField
                multiline
                rows={3}
                value={idsHypothesis}
                onChange={e => setIdsHypothesis(e.target.value)}
                fullWidth
                size="small"
                placeholder="Enter your hypothesis..."
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{ color: '#0f172a', mb: 0.5, display: 'block', fontWeight: 600 }}
              >
                Action Plan
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block' }}>
                What specific action will you take?
              </Typography>
              <TextField
                multiline
                rows={3}
                value={idsAction}
                onChange={e => setIdsAction(e.target.value)}
                fullWidth
                size="small"
                placeholder="Enter your action plan..."
              />
            </Box>
          </Box>
        )}

        {/* Summary info */}
        <Box sx={{ display: 'flex', gap: 3, pt: 2, borderTop: '1px solid #e2e8f0' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Category
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
              {metric.category}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={metric.status === 'green' ? 'On Track' : 'Off Track'}
                size="small"
                sx={{
                  bgcolor: metric.status === 'green' ? '#f0fdf4' : '#fef2f2',
                  color: metric.status === 'green' ? '#15803d' : '#dc2626',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: `1px solid ${metric.status === 'green' ? '#86efac' : '#fecaca'}`,
                }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Streak
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: metric.greenStreak > 0 ? '#10b981' : '#ef4444',
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {metric.greenStreak > 0 ? metric.greenStreak : metric.redStreak}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box>
          {onDelete && (
            <Button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${metric.name}"?`)) {
                  onDelete(metric.id);
                }
              }}
              sx={{
                textTransform: 'none',
                color: '#ef4444',
                '&:hover': { bgcolor: '#fef2f2' },
              }}
            >
              Delete Metric
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              textTransform: 'none',
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

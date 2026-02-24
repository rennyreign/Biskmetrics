import { useState } from 'react';
import { Box, Typography, Card, Chip, IconButton } from '@mui/material';
import { TrendingUp, TrendingDown, Flag, Plus, GripVertical } from 'lucide-react';
import type { EOSMetric } from '@/types/eos-scorecard';

interface MetricTableProps {
  title: string;
  metrics: EOSMetric[];
  onAddMetric: () => void;
  onRowClick: (metric: EOSMetric) => void;
  onReorder?: (reorderedMetrics: EOSMetric[]) => void;
}

export function MetricTable({
  title,
  metrics,
  onAddMetric,
  onRowClick,
  onReorder,
}: MetricTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${Math.round(value).toLocaleString()}`;
    } else if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const getWoWColor = (wowDelta: number, isCostMetric: boolean) => {
    if (isCostMetric) {
      return wowDelta < 0 ? '#10b981' : wowDelta > 0 ? '#ef4444' : '#64748b';
    } else {
      return wowDelta > 0 ? '#10b981' : wowDelta < 0 ? '#ef4444' : '#64748b';
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex &&
      onReorder
    ) {
      const reordered = [...metrics];
      const [draggedItem] = reordered.splice(draggedIndex, 1);
      reordered.splice(dragOverIndex, 0, draggedItem);
      onReorder(reordered);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  return (
    <Card>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Box
          onClick={onAddMetric}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            color: '#3b82f6',
            '&:hover': { color: '#2563eb' },
          }}
        >
          <Plus size={16} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Add Metric
          </Typography>
        </Box>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              {onReorder && (
                <th
                  style={{
                    padding: '12px 8px',
                    width: '40px',
                  }}
                />
              )}
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Metric
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Owner
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Current
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Last Week
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                WoW Δ
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                4-Wk Avg
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Target
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Streak
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                IDS
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => {
              const wowColor = getWoWColor(metric.wowDelta, metric.isCostMetric);
              const isPositiveWoW = metric.isCostMetric ? metric.wowDelta < 0 : metric.wowDelta > 0;
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;

              return (
                <tr
                  key={metric.id}
                  draggable={!!onReorder}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={e => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragLeave={handleDragLeave}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: metric.idsFlagged
                      ? '#fef3c7'
                      : isDragging
                        ? '#f1f5f9'
                        : isDragOver
                          ? '#e0f2fe'
                          : 'white',
                    cursor: onReorder ? 'move' : 'pointer',
                    opacity: isDragging ? 0.5 : 1,
                    borderTop: isDragOver ? '2px solid #3b82f6' : undefined,
                  }}
                >
                  {onReorder && (
                    <td
                      style={{ padding: '8px', width: '40px', cursor: 'grab' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <IconButton
                        size="small"
                        sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
                      >
                        <GripVertical size={16} color="#94a3b8" />
                      </IconButton>
                    </td>
                  )}
                  <td style={{ padding: '16px' }} onClick={() => onRowClick(metric)}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {metric.name}
                    </Typography>
                  </td>
                  <td style={{ padding: '16px' }} onClick={() => onRowClick(metric)}>
                    <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                      {metric.owner}
                    </Typography>
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'right' }}
                    onClick={() => onRowClick(metric)}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatValue(metric.currentValue, metric.unit)}
                    </Typography>
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'right' }}
                    onClick={() => onRowClick(metric)}
                  >
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {formatValue(metric.lastWeekValue, metric.unit)}
                    </Typography>
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'right' }}
                    onClick={() => onRowClick(metric)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      {metric.wowDelta !== 0 && (
                        <>
                          {isPositiveWoW ? (
                            <TrendingUp size={14} color={wowColor} />
                          ) : (
                            <TrendingDown size={14} color={wowColor} />
                          )}
                        </>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: wowColor,
                          fontSize: '0.875rem',
                        }}
                      >
                        {metric.wowDelta > 0 ? '+' : ''}
                        {metric.wowDelta.toFixed(1)}%
                      </Typography>
                    </Box>
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'right' }}
                    onClick={() => onRowClick(metric)}
                  >
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {formatValue(metric.fourWeekAvg, metric.unit)}
                    </Typography>
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'right' }}
                    onClick={() => onRowClick(metric)}
                  >
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {formatValue(metric.target, metric.unit)}
                    </Typography>
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'center' }}
                    onClick={() => onRowClick(metric)}
                  >
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
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'center' }}
                    onClick={() => onRowClick(metric)}
                  >
                    {(metric.greenStreak > 0 || metric.redStreak > 0) && (
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: metric.greenStreak > 0 ? '#f0fdf4' : '#fef2f2',
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: metric.greenStreak > 0 ? '#10b981' : '#ef4444',
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: metric.greenStreak > 0 ? '#15803d' : '#dc2626',
                          }}
                        >
                          {metric.greenStreak > 0 ? metric.greenStreak : metric.redStreak}
                        </Typography>
                      </Box>
                    )}
                  </td>
                  <td
                    style={{ padding: '16px', textAlign: 'center' }}
                    onClick={() => onRowClick(metric)}
                  >
                    {metric.idsFlagged && <Flag size={16} color="#f59e0b" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Card>
  );
}

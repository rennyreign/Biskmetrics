import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import { X, Plus, Filter, GripVertical } from 'lucide-react';
import type { Program } from '../types';

interface ProgramTableProps {
  programs: Program[];
  showSchoolColumn: boolean;
}

type SortField = keyof Program | null;
type SortDirection = 'asc' | 'desc';
type Operator = '>' | '>=' | '<' | '<=' | '=' | '!=';

interface MetricFilter {
  id: string;
  field: keyof Program;
  operator: Operator;
  value: number;
}

interface ColumnDef {
  id: string;
  field: keyof Program | 'school';
  label: string;
  align: 'left' | 'right';
  format: 'text' | 'number' | 'percentage' | 'chip';
}

const DEFAULT_COLUMNS: ColumnDef[] = [
  { id: 'programName', field: 'programName', label: 'Program', align: 'left', format: 'text' },
  { id: 'school', field: 'school', label: 'School', align: 'left', format: 'text' },
  { id: 'level', field: 'level', label: 'Program Type', align: 'left', format: 'chip' },
  { id: 'leads', field: 'leads', label: 'Leads', align: 'right', format: 'number' },
  { id: 'contactToApplicationRate', field: 'contactToApplicationRate', label: 'Contact to App Rate', align: 'right', format: 'percentage' },
  { id: 'applicationRate', field: 'applicationRate', label: 'App Rate', align: 'right', format: 'percentage' },
  { id: 'contactToEnrollmentRate', field: 'contactToEnrollmentRate', label: 'Contact Enroll Rate', align: 'right', format: 'percentage' },
  { id: 'enrollmentRate', field: 'enrollmentRate', label: 'Enrollment Rate', align: 'right', format: 'percentage' },
];

const METRIC_FIELDS: { value: keyof Program; label: string }[] = [
  { value: 'leads', label: 'Leads' },
  { value: 'contactToApplicationRate', label: 'Contact to App Rate' },
  { value: 'applicationRate', label: 'Application Rate' },
  { value: 'contactToEnrollmentRate', label: 'Contact to Enroll Rate' },
  { value: 'enrollmentRate', label: 'Enrollment Rate' },
];

const OPERATORS: { value: Operator; label: string }[] = [
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
];

export function ProgramTable({ programs, showSchoolColumn }: ProgramTableProps) {
  const [sortField, setSortField] = useState<SortField>('leads');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [metricFilters, setMetricFilters] = useState<MetricFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [columnOrder, setColumnOrder] = useState<string[]>(DEFAULT_COLUMNS.map(c => c.id));
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  // Apply metric filters
  const filteredPrograms = useMemo(() => {
    if (metricFilters.length === 0) return programs;

    return programs.filter(program => {
      return metricFilters.every(filter => {
        const value = program[filter.field];
        if (value == null) return false; // Exclude nulls when filtering
        
        const numValue = typeof value === 'number' ? value : 0;
        switch (filter.operator) {
          case '>': return numValue > filter.value;
          case '>=': return numValue >= filter.value;
          case '<': return numValue < filter.value;
          case '<=': return numValue <= filter.value;
          case '=': return numValue === filter.value;
          case '!=': return numValue !== filter.value;
          default: return true;
        }
      });
    });
  }, [programs, metricFilters]);

  const sortedPrograms = useMemo(() => {
    if (!sortField) return filteredPrograms;

    return [...filteredPrograms].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredPrograms, sortField, sortDirection]);

  const addFilter = () => {
    const newFilter: MetricFilter = {
      id: Date.now().toString(),
      field: 'leads',
      operator: '>',
      value: 0
    };
    setMetricFilters([...metricFilters, newFilter]);
  };

  const updateFilter = (id: string, updates: Partial<MetricFilter>) => {
    setMetricFilters(metricFilters.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  const removeFilter = (id: string) => {
    setMetricFilters(metricFilters.filter(f => f.id !== id));
  };

  const clearAllFilters = () => {
    setMetricFilters([]);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num == null) return '—';
    return num.toLocaleString('en-US');
  };

  const formatPercentage = (num: number | null | undefined): string => {
    if (num == null) return '—';
    return `${num.toFixed(1)}%`;
  };

  // Get visible columns in order
  const visibleColumns = useMemo(() => {
    return columnOrder
      .map(id => DEFAULT_COLUMNS.find(c => c.id === id)!)
      .filter(col => col && (col.id !== 'school' || showSchoolColumn));
  }, [columnOrder, showSchoolColumn]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }

    setColumnOrder(prev => {
      const newOrder = [...prev];
      const draggedIdx = newOrder.indexOf(draggedColumn);
      const targetIdx = newOrder.indexOf(targetColumnId);
      
      // Remove dragged item and insert at target position
      newOrder.splice(draggedIdx, 1);
      newOrder.splice(targetIdx, 0, draggedColumn);
      
      return newOrder;
    });
    setDraggedColumn(null);
  }, [draggedColumn]);

  const handleDragEnd = useCallback(() => {
    setDraggedColumn(null);
  }, []);

  // Format cell value based on column definition
  const formatCellValue = (program: Program, column: ColumnDef) => {
    const value = program[column.field as keyof Program];
    
    if (column.id === 'programName') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>{program.programName}</span>
          {topPerformers.has(program.id) && (
            <Chip
              label="Top Performer"
              size="small"
              sx={{
                bgcolor: '#d1fae5',
                color: '#065f46',
                height: '20px',
                fontSize: '11px'
              }}
            />
          )}
        </Box>
      );
    }
    
    if (column.format === 'chip' && column.id === 'level') {
      return (
        <Chip
          label={program.level}
          size="small"
          sx={{
            bgcolor: program.level === 'Certificate' ? '#dbeafe' : '#f3e8ff',
            color: program.level === 'Certificate' ? '#1e40af' : '#6b21a8',
            fontSize: '12px'
          }}
        />
      );
    }
    
    if (column.format === 'number') {
      return formatNumber(value as number | null);
    }
    
    if (column.format === 'percentage') {
      return formatPercentage(value as number | null);
    }
    
    return value as string;
  };

  // Calculate top performers for Enrollment Rate
  const topPerformers = useMemo(() => {
    const withRate = sortedPrograms
      .filter(p => p.enrollmentRate != null)
      .sort((a, b) => (b.enrollmentRate || 0) - (a.enrollmentRate || 0))
      .slice(0, 3);
    return new Set(withRate.map(p => p.id));
  }, [sortedPrograms]);

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
    <Box>
      {/* Metric Filters Section */}
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: showFilters || metricFilters.length > 0 ? 2 : 0 }}>
          <Button
            startIcon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? 'contained' : 'outlined'}
            size="small"
            sx={{
              textTransform: 'none',
              bgcolor: showFilters ? '#e91e63' : 'transparent',
              color: showFilters ? 'white' : '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: showFilters ? '#c2185b' : '#f8fafc',
                borderColor: '#e91e63',
              }
            }}
          >
            Metric Filters {metricFilters.length > 0 && `(${metricFilters.length})`}
          </Button>
          {metricFilters.length > 0 && (
            <Button
              size="small"
              onClick={clearAllFilters}
              sx={{
                textTransform: 'none',
                color: '#64748b',
                '&:hover': { color: '#e91e63' }
              }}
            >
              Clear all
            </Button>
          )}
          <Box sx={{ ml: 'auto', color: '#64748b', fontSize: '14px' }}>
            {sortedPrograms.length} of {programs.length} programs
          </Box>
        </Box>

        {/* Filter Controls */}
        {showFilters && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {metricFilters.map((filter) => (
              <Box key={filter.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Metric</InputLabel>
                  <Select
                    value={filter.field}
                    label="Metric"
                    onChange={(e) => updateFilter(filter.id, { field: e.target.value as keyof Program })}
                  >
                    {METRIC_FIELDS.map(f => (
                      <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <InputLabel>Op</InputLabel>
                  <Select
                    value={filter.operator}
                    label="Op"
                    onChange={(e) => updateFilter(filter.id, { operator: e.target.value as Operator })}
                  >
                    {OPERATORS.map(op => (
                      <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  type="number"
                  label="Value"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: parseFloat(e.target.value) || 0 })}
                  sx={{ width: 100 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeFilter(filter.id)}
                  sx={{ color: '#94a3b8', '&:hover': { color: '#e91e63' } }}
                >
                  <X size={18} />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<Plus size={16} />}
              onClick={addFilter}
              size="small"
              sx={{
                textTransform: 'none',
                color: '#64748b',
                alignSelf: 'flex-start',
                '&:hover': { color: '#e91e63', bgcolor: '#fce4ec' }
              }}
            >
              Add filter
            </Button>
          </Box>
        )}
      </Box>

      {sortedPrograms.length === 0 ? (
        <Box sx={{ p: 8, textAlign: 'center' }}>
          <p className="text-slate-600 mb-3">No programs match the current filters.</p>
          <Button
            onClick={clearAllFilters}
            sx={{
              color: '#e91e63',
              textTransform: 'none',
              '&:hover': { bgcolor: '#fce4ec' }
            }}
          >
            Clear metric filters
          </Button>
        </Box>
      ) : (
      <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            {visibleColumns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                draggable
                onDragStart={(e) => handleDragStart(e, column.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                onDragEnd={handleDragEnd}
                sx={{
                  cursor: 'grab',
                  opacity: draggedColumn === column.id ? 0.5 : 1,
                  bgcolor: draggedColumn === column.id ? '#fce4ec' : 'inherit',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <GripVertical size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                  <TableSortLabel
                    active={sortField === column.field}
                    direction={sortField === column.field ? sortDirection : 'desc'}
                    onClick={() => handleSort(column.field as SortField)}
                    sx={{
                      '&.MuiTableSortLabel-root': {
                        color: '#475569',
                      },
                      '&.MuiTableSortLabel-root:hover': {
                        color: '#e91e63',
                      },
                      '&.Mui-active': {
                        color: '#e91e63',
                      },
                      '& .MuiTableSortLabel-icon': {
                        color: '#e91e63 !important',
                      }
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPrograms.map((program) => (
            <TableRow
              key={program.id}
              sx={{
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ 
                    color: column.id === 'leads' ? '#0f172a' : 
                           column.format === 'percentage' ? '#64748b' : 
                           column.id === 'school' ? '#475569' : 'inherit'
                  }}
                >
                  {formatCellValue(program, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      )}
    </Box>
  );
}

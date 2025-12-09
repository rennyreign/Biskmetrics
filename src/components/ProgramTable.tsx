import { useState, useMemo } from 'react';
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
  Button
} from '@mui/material';
import type { Program } from '../types';

interface ProgramTableProps {
  programs: Program[];
  showSchoolColumn: boolean;
}

type SortField = keyof Program | null;
type SortDirection = 'asc' | 'desc';

export function ProgramTable({ programs, showSchoolColumn }: ProgramTableProps) {
  const [sortField, setSortField] = useState<SortField>('leads');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedPrograms = useMemo(() => {
    if (!sortField) return programs;

    return [...programs].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [programs, sortField, sortDirection]);

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

  // Calculate top performers for Lead to Enrollment Rate
  const topPerformers = useMemo(() => {
    const withRate = sortedPrograms
      .filter(p => p.leadToEnrollmentRate != null)
      .sort((a, b) => (b.leadToEnrollmentRate || 0) - (a.leadToEnrollmentRate || 0))
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
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f8fafc' }}>
            <TableCell>
              <TableSortLabel
                active={sortField === 'programName'}
                direction={sortField === 'programName' ? sortDirection : 'desc'}
                onClick={() => handleSort('programName')}
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
                Program
              </TableSortLabel>
            </TableCell>
            {showSchoolColumn && (
              <TableCell>
                <TableSortLabel
                  active={sortField === 'school'}
                  direction={sortField === 'school' ? sortDirection : 'desc'}
                  onClick={() => handleSort('school')}
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
                  School
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>
              <TableSortLabel
                active={sortField === 'level'}
                direction={sortField === 'level' ? sortDirection : 'desc'}
                onClick={() => handleSort('level')}
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
                Level
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'leads'}
                direction={sortField === 'leads' ? sortDirection : 'desc'}
                onClick={() => handleSort('leads')}
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
                Leads
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'contactToApplicationRate'}
                direction={sortField === 'contactToApplicationRate' ? sortDirection : 'desc'}
                onClick={() => handleSort('contactToApplicationRate')}
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
                Contact to App Rate
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'applicationRate'}
                direction={sortField === 'applicationRate' ? sortDirection : 'desc'}
                onClick={() => handleSort('applicationRate')}
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
                Application Rate
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'enrollmentRate'}
                direction={sortField === 'enrollmentRate' ? sortDirection : 'desc'}
                onClick={() => handleSort('enrollmentRate')}
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
                Enrollment Rate
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'contactToEnrollmentRate'}
                direction={sortField === 'contactToEnrollmentRate' ? sortDirection : 'desc'}
                onClick={() => handleSort('contactToEnrollmentRate')}
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
                Contact to Enroll Rate
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'inquiryToEnrollmentRate'}
                direction={sortField === 'inquiryToEnrollmentRate' ? sortDirection : 'desc'}
                onClick={() => handleSort('inquiryToEnrollmentRate')}
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
                Inquiry to Enroll Rate
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortField === 'leadToEnrollmentRate'}
                direction={sortField === 'leadToEnrollmentRate' ? sortDirection : 'desc'}
                onClick={() => handleSort('leadToEnrollmentRate')}
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
                Lead to Enroll Rate
              </TableSortLabel>
            </TableCell>
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
              <TableCell>
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
              </TableCell>
              {showSchoolColumn && (
                <TableCell sx={{ color: '#475569' }}>{program.school}</TableCell>
              )}
              <TableCell>
                <Chip
                  label={program.level}
                  size="small"
                  sx={{
                    bgcolor: program.level === 'Certificate' ? '#dbeafe' : '#f3e8ff',
                    color: program.level === 'Certificate' ? '#1e40af' : '#6b21a8',
                    fontSize: '12px'
                  }}
                />
              </TableCell>
              <TableCell align="right" sx={{ color: '#0f172a' }}>
                {formatNumber(program.leads)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#64748b' }}>
                {formatPercentage(program.contactToApplicationRate)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#64748b' }}>
                {formatPercentage(program.applicationRate)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#64748b' }}>
                {formatPercentage(program.enrollmentRate)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#64748b' }}>
                {formatPercentage(program.contactToEnrollmentRate)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#64748b' }}>
                {formatPercentage(program.inquiryToEnrollmentRate)}
              </TableCell>
              <TableCell align="right" sx={{ color: '#64748b' }}>
                {formatPercentage(program.leadToEnrollmentRate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Table, BarChart3 } from 'lucide-react';

interface ViewToggleProps {
  view: 'table' | 'graph';
  onViewChange: (view: 'table' | 'graph') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={(event, newValue) => {
        if (newValue !== null) {
          onViewChange(newValue);
        }
      }}
      sx={{
        bgcolor: 'white',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        '& .MuiToggleButton-root': {
          px: 3,
          py: 1,
          border: '1px solid #e2e8f0',
          color: '#64748b',
          textTransform: 'none',
          '&.Mui-selected': {
            bgcolor: '#e91e63',
            color: 'white',
            borderColor: '#e91e63',
            '&:hover': {
              bgcolor: '#c2185b',
            },
          },
          '&:hover': {
            bgcolor: '#f1f5f9',
          },
        },
      }}
    >
      <ToggleButton value="table">
        <Table style={{ width: '16px', height: '16px', marginRight: '8px' }} />
        Table
      </ToggleButton>
      <ToggleButton value="graph">
        <BarChart3 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
        Graph
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

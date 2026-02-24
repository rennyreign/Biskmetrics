import { Drawer, Box, IconButton, Typography, Tabs, Tab } from '@mui/material';
import { X } from 'lucide-react';
import { useState } from 'react';
import type { Program } from '@/types/program';
import { FunnelView } from './FunnelView';
import { ROICalculator } from './ROICalculator';
import { TrendsView } from './TrendsView';
import { InsightsView } from './InsightsView';

interface ProgramDetailDrawerProps {
  program: Program | null;
  open: boolean;
  onClose: () => void;
}

type TabValue = 'funnel' | 'roi' | 'trends' | 'insights';

export function ProgramDetailDrawer({ program, open, onClose }: ProgramDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('funnel');

  if (!program) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={400}
      SlideProps={{
        timeout: 400,
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '90%', md: '70%', lg: '60%' },
          maxWidth: '1200px',
        },
      }}
      sx={{
        '& .MuiDrawer-paper': {
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
              {program.programName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {program.school}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                •
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {program.level}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#64748b' }}>
            <X size={24} />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e2e8f0', px: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                minHeight: '48px',
              },
              '& .Mui-selected': {
                color: '#e91e63',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#e91e63',
              },
            }}
          >
            <Tab label="Funnel Analysis" value="funnel" />
            <Tab label="ROI Calculator" value="roi" />
            <Tab label="Trends" value="trends" />
            <Tab label="Insights" value="insights" />
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {activeTab === 'funnel' && <FunnelView program={program} />}
          {activeTab === 'roi' && <ROICalculator program={program} />}
          {activeTab === 'trends' && <TrendsView program={program} />}
          {activeTab === 'insights' && <InsightsView program={program} />}
        </Box>
      </Box>
    </Drawer>
  );
}

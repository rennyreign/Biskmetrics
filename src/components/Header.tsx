import { Box, Container, Tooltip } from '@mui/material';
import { Info } from 'lucide-react';
import biskLogo from '../assets/BiskAmpLogo.jpg';

export function Header() {
  return (
    <Box
      sx={{
        bgcolor: '#2c3e50',
        color: 'white',
        py: 3,
        borderBottom: '3px solid #e91e63',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <img src={biskLogo} alt="BISK" style={{ height: '40px', objectFit: 'contain' }} />
          <Box sx={{ height: '40px', width: '1px', bgcolor: 'rgba(255,255,255,0.2)' }} />
          <h1 style={{ margin: 0, color: 'white' }}>Program Performance Dashboard</h1>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.8)' }}>
          <p className="text-sm" style={{ margin: 0 }}>
            Data from January 1 – December 3, 2025 (static snapshot)
          </p>
          <Tooltip title="This dashboard displays a static snapshot of program performance data and is not updated in real-time.">
            <Info style={{ width: '16px', height: '16px', cursor: 'help' }} />
          </Tooltip>
        </Box>
      </Container>
    </Box>
  );
}

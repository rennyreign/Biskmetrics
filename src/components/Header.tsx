import { Box, Container } from '@mui/material';
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <img src={biskLogo} alt="BISK" style={{ height: '40px', objectFit: 'contain' }} />
          <Box sx={{ height: '40px', width: '1px', bgcolor: 'rgba(255,255,255,0.2)' }} />
          <h1 style={{ margin: 0, color: 'white' }}>Performance Dashboard</h1>
        </Box>
      </Container>
    </Box>
  );
}

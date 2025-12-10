import { useState, useMemo } from 'react';
import { Box, Container, Button, ButtonGroup } from '@mui/material';
import { ProgramTable } from './components/ProgramTable';
import { GraphView } from './components/GraphView';
import { FilterSection } from './components/FilterSection';
import { ViewToggle } from './components/ViewToggle';
import { Header } from './components/Header';
import { RecommendedVerdict } from './components/RecommendedVerdict';
import { programs } from './data/programs';
import { LayoutDashboard, Award } from 'lucide-react';

type Page = 'dashboard' | 'verdict';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedSchool, setSelectedSchool] = useState<string>('All Schools');
  const [selectedLevel, setSelectedLevel] = useState<string>('All Program Types');
  const [view, setView] = useState<'table' | 'graph'>('table');

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const schoolMatch = selectedSchool === 'All Schools' || program.school === selectedSchool;
      const levelMatch = selectedLevel === 'All Program Types' || program.level === selectedLevel;
      return schoolMatch && levelMatch;
    });
  }, [selectedSchool, selectedLevel]);

  const getFilterSummary = () => {
    const parts = [`${filteredPrograms.length} programs`];
    if (selectedSchool !== 'All Schools') parts.push(selectedSchool);
    if (selectedLevel !== 'All Program Types') parts.push(selectedLevel);
    return parts.join(' · ');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Navigation */}
        <Box sx={{ mb: 4 }}>
          <ButtonGroup variant="outlined" sx={{ bgcolor: 'white', borderRadius: '8px' }}>
            <Button
              onClick={() => setPage('dashboard')}
              variant={page === 'dashboard' ? 'contained' : 'outlined'}
              startIcon={<LayoutDashboard size={18} />}
              sx={{
                textTransform: 'none',
                px: 3,
                py: 1.5,
                bgcolor: page === 'dashboard' ? '#e91e63' : 'white',
                color: page === 'dashboard' ? 'white' : '#64748b',
                borderColor: '#e2e8f0',
                '&:hover': {
                  bgcolor: page === 'dashboard' ? '#c2185b' : '#f8fafc',
                  borderColor: '#e91e63',
                }
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setPage('verdict')}
              variant={page === 'verdict' ? 'contained' : 'outlined'}
              startIcon={<Award size={18} />}
              sx={{
                textTransform: 'none',
                px: 3,
                py: 1.5,
                bgcolor: page === 'verdict' ? '#e91e63' : 'white',
                color: page === 'verdict' ? 'white' : '#64748b',
                borderColor: '#e2e8f0',
                '&:hover': {
                  bgcolor: page === 'verdict' ? '#c2185b' : '#f8fafc',
                  borderColor: '#e91e63',
                }
              }}
            >
              Recommended Verdict
            </Button>
          </ButtonGroup>
        </Box>

        {page === 'dashboard' ? (
          <>
            {/* Filters */}
            <FilterSection
              selectedSchool={selectedSchool}
              selectedLevel={selectedLevel}
              onSchoolChange={setSelectedSchool}
              onLevelChange={setSelectedLevel}
            />

            {/* Summary Chip and View Toggle */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 3,
                  py: 1,
                  bgcolor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '24px',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }}
              >
                <span className="text-sm text-slate-700">Showing {getFilterSummary()}</span>
              </Box>
              <ViewToggle view={view} onViewChange={setView} />
            </Box>

            {/* Main Content Card */}
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #e2e8f0' }}>
                <h2 className="text-slate-900">Programs</h2>
              </Box>
              {view === 'table' ? (
                <ProgramTable 
                  programs={filteredPrograms}
                  showSchoolColumn={selectedSchool === 'All Schools'}
                />
              ) : (
                <GraphView 
                  programs={filteredPrograms}
                  showSchoolColumn={selectedSchool === 'All Schools'}
                />
              )}
            </Box>
          </>
        ) : (
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              overflow: 'hidden'
            }}
          >
            <RecommendedVerdict />
          </Box>
        )}
      </Container>
    </Box>
  );
}
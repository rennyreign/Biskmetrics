import { useState, useMemo } from 'react';
import { Box, Container } from '@mui/material';
import { ProgramTable } from './components/ProgramTable';
import { GraphView } from './components/GraphView';
import { FilterSection } from './components/FilterSection';
import { ViewToggle } from './components/ViewToggle';
import { Header } from './components/Header';
import { mockPrograms } from './data/mockData';

export default function App() {
  const [selectedSchool, setSelectedSchool] = useState<string>('All Schools');
  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels');
  const [view, setView] = useState<'table' | 'graph'>('table');

  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter(program => {
      const schoolMatch = selectedSchool === 'All Schools' || program.school === selectedSchool;
      const levelMatch = selectedLevel === 'All Levels' || program.level === selectedLevel;
      return schoolMatch && levelMatch;
    });
  }, [selectedSchool, selectedLevel]);

  const getFilterSummary = () => {
    const parts = [`${filteredPrograms.length} programs`];
    if (selectedSchool !== 'All Schools') parts.push(selectedSchool);
    if (selectedLevel !== 'All Levels') parts.push(selectedLevel);
    return parts.join(' · ');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
      </Container>
    </Box>
  );
}
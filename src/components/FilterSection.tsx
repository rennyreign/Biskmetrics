import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FilterSectionProps {
  selectedSchool: string;
  selectedLevel: string;
  onSchoolChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

const SCHOOL_OPTIONS = [
  'All Schools',
  'MSU',
  'SMU',
  'USF',
  'Emory ECE',
  'Emory GBS',
  'ECSU',
  'KEEP'
];

const LEVEL_OPTIONS = [
  'All Program Types',
  'Certificate',
  'Degree'
];

export function FilterSection({
  selectedSchool,
  selectedLevel,
  onSchoolChange,
  onLevelChange
}: FilterSectionProps) {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 220 }}>
        <InputLabel id="school-select-label">School</InputLabel>
        <Select
          labelId="school-select-label"
          value={selectedSchool}
          label="School"
          onChange={(e) => onSchoolChange(e.target.value)}
          sx={{
            bgcolor: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cbd5e1',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e91e63',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e91e63',
            }
          }}
        >
          {SCHOOL_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 220 }}>
        <InputLabel id="level-select-label">Program Type</InputLabel>
        <Select
          labelId="level-select-label"
          value={selectedLevel}
          label="Program Type"
          onChange={(e) => onLevelChange(e.target.value)}
          sx={{
            bgcolor: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cbd5e1',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e91e63',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e91e63',
            }
          }}
        >
          {LEVEL_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

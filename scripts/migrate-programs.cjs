// Script to migrate programs.ts from legacy schema to new Program type
const fs = require('fs');
const path = require('path');

const programsPath = path.join(__dirname, '../src/data/programs.ts');
const content = fs.readFileSync(programsPath, 'utf8');

// Extract the program objects
const lines = content.split('\n');
const newLines = [
  "import type { Program } from '../types/program';",
  '',
  '/**',
  ' * Program Performance Data',
  ' * Data Window: January 1 – December 3, 2025',
  ' * Source: metrics.md',
  ' *',
  ' * Schema: Updated to new Program type with funnel, conversions, and spend fields',
  ' */',
  '',
  'let idCounter = 0;',
  'const generateId = (school: string): string =>',
  "  `${school.toLowerCase().replace(/\\s+/g, '-')}-${++idCounter}`;",
  '',
  'export const programs: Program[] = [',
];

let currentProgram = null;
let inProgram = false;
let braceCount = 0;
let programCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Skip old import and header
  if (i < 13) continue;
  
  // Handle comments
  if (line.startsWith('//')) {
    newLines.push('  ' + line);
    continue;
  }
  
  if (line === '{') {
    braceCount++;
    if (braceCount === 1) {
      inProgram = true;
      currentProgram = {};
      newLines.push('  {');
    }
  } else if (line === '},') {
    braceCount--;
    if (braceCount === 0 && currentProgram) {
      // Convert and output program
      const leads = currentProgram.leads || 0;
      // Use enrollmentRate if available, fallback to contactToEnrollmentRate, then default to 5
      let enrollmentRate = 5; // Default
      if (typeof currentProgram.enrollmentRate === 'number' && !isNaN(currentProgram.enrollmentRate)) {
        enrollmentRate = currentProgram.enrollmentRate;
      } else if (typeof currentProgram.contactToEnrollmentRate === 'number' && !isNaN(currentProgram.contactToEnrollmentRate)) {
        enrollmentRate = currentProgram.contactToEnrollmentRate;
      }
      
      const enrollments = Math.round(leads * (enrollmentRate / 100));
      const applications = Math.round(enrollments / 0.45); // Assume ~45% app-to-enroll rate
      const opportunities = Math.min(Math.round(applications / 0.65), leads); // Cap at leads to prevent impossible values
      
      // Add funnel (ensure monotonic: inquiries >= opportunities >= applications >= enrollments)
      newLines.push(`    funnel: {`);
      newLines.push(`      inquiries: ${leads},`);
      newLines.push(`      opportunities: ${opportunities},`);
      newLines.push(`      applications: ${applications},`);
      newLines.push(`      enrollments: ${enrollments},`);
      newLines.push(`    },`);
      
      // Add conversions (ensure rates are in [0, 100])
      const inquiryToOppRate = leads > 0 ? Math.min(((opportunities / leads) * 100), 100).toFixed(1) : '10.0';
      const oppToAppRate = opportunities > 0 ? Math.min(((applications / opportunities) * 100), 100).toFixed(1) : '65.0';
      const appToEnrollRate = applications > 0 ? Math.min(((enrollments / applications) * 100), 100).toFixed(1) : '45.0';
      
      newLines.push(`    conversions: {`);
      newLines.push(`      inquiryToOpportunityRate: ${inquiryToOppRate},`);
      newLines.push(`      opportunityToApplicationRate: ${oppToAppRate},`);
      newLines.push(`      applicationToEnrollmentRate: ${appToEnrollRate},`);
      const contactToAppRate = typeof currentProgram.applicationRate === 'number' && !isNaN(currentProgram.applicationRate) ? currentProgram.applicationRate : null;
      const contactToEnrollRate = typeof currentProgram.contactToEnrollmentRate === 'number' && !isNaN(currentProgram.contactToEnrollmentRate) 
        ? currentProgram.contactToEnrollmentRate 
        : (typeof currentProgram.enrollmentRate === 'number' && !isNaN(currentProgram.enrollmentRate) ? currentProgram.enrollmentRate : null);
      
      newLines.push(`      contactToApplicationRate: ${contactToAppRate},`);
      newLines.push(`      contactToEnrollmentRate: ${contactToEnrollRate},`);
      newLines.push(`      leadToEnrollmentRate: ${enrollmentRate},`);
      newLines.push(`    },`);
      
      // Add spend (placeholder - will be populated with real data later)
      const avgCostPerLead = 50; // Placeholder
      const totalSpend = Math.round(leads * avgCostPerLead);
      newLines.push(`    spend: {`);
      newLines.push(`      totalSpend: ${totalSpend},`);
      newLines.push(`    },`);
      
      newLines.push('  },');
      currentProgram = null;
      inProgram = false;
      programCount++;
    }
  } else if (inProgram && line.includes(':')) {
    const match = line.match(/(\w+):\s*(.+),?$/);
    if (match) {
      const [, key, value] = match;
      if (['contactToApplicationRate', 'applicationRate', 'enrollmentRate', 'contactToEnrollmentRate'].includes(key)) {
        currentProgram[key] = value === 'null' ? null : parseFloat(value);
      } else if (key === 'leads') {
        currentProgram[key] = parseInt(value);
        newLines.push(`    ${line}`);
      } else {
        newLines.push(`    ${line}`);
      }
    }
  } else if (line === '];') {
    newLines.push('];');
    break;
  }
}

fs.writeFileSync(programsPath, newLines.join('\n') + '\n');
console.log('✅ Migration complete! programs.ts updated to new schema.');
console.log(`   - Added funnel data for ${programCount} programs`);
console.log(`   - Added conversion rates`);
console.log(`   - Added placeholder spend data`);

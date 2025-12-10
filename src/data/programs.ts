import type { Program } from '../types';

/**
 * Program Performance Data
 * Data Window: January 1 – December 3, 2025
 * Source: metrics.md
 */

let idCounter = 0;
const generateId = (school: string): string => `${school.toLowerCase().replace(/\s+/g, '-')}-${++idCounter}`;

export const programs: Program[] = [
  // ============================================
  // MSU CERTIFICATES
  // ============================================
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Professional Cert in Supervisory Management',
    leads: 2174,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 12.1,
    enrollmentRate: 1.8
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'People and Team Development Cert',
    leads: 1602,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 5.7,
    enrollmentRate: 2.2
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Supply Management & Logistics',
    leads: 535,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 9.5,
    enrollmentRate: 4.8
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Professional Cert in Business Analytics',
    leads: 468,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 8.1,
    enrollmentRate: 2.8
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Creative Business, Strategy & Leadership Cert',
    leads: 330,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 19.2,
    enrollmentRate: 9.5
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Business Analytics',
    leads: 317,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 12.5,
    enrollmentRate: 5.1
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Supply Chain Management Ops',
    leads: 282,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 15.4,
    enrollmentRate: 7.2
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Supply Chain Management & Procurement',
    leads: 245,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 7.4,
    enrollmentRate: 2.8
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Advanced Master Cert in Integrated Supply Chain Management',
    leads: 222,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 7.3,
    enrollmentRate: 2.7
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Advanced Master Cert in Supply Chain Management & Procurement',
    leads: 216,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 3.7,
    enrollmentRate: 1.4
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Leadership Strategies for Effective Change Management',
    leads: 172,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 12.1,
    enrollmentRate: 5.3
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Professional Certificate in Supervisor Management',
    leads: 168,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 22.8,
    enrollmentRate: 19.2
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Global Supply Chain Management',
    leads: 159,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 11.1,
    enrollmentRate: 5.6
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Human Resource Talent Strategy',
    leads: 154,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 1.5,
    enrollmentRate: 0.6
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Transformation Leadership & Creative Thinking Cert',
    leads: 126,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 34.4,
    enrollmentRate: 17.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Advanced Procurement Management',
    leads: 100,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 23.3,
    enrollmentRate: 11.2
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Certificate in Advanced Procurement Management - Global Supply Chain',
    leads: 89,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 2.9,
    enrollmentRate: 1.1
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Integrated Supply Chain Management',
    leads: 68,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 22.0,
    enrollmentRate: 14.7
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Master Cert in Advanced Procurement Management - Strategic Negotiation',
    leads: 66,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 20.5,
    enrollmentRate: 12.1
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Professional Cert in Human Resources & Talent Management',
    leads: 62,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 19.2,
    enrollmentRate: 16.1
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Supply Chain Management 1',
    leads: 43,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 11.1,
    enrollmentRate: 4.6
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Management Essentials',
    leads: 41,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 22.2,
    enrollmentRate: 12.1
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Leadership Essentials',
    leads: 39,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 32.0,
    enrollmentRate: 20.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Global Supply Chain Management',
    leads: 28,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 20.0,
    enrollmentRate: 10.7
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Strategic Negotiation',
    leads: 27,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 77.2,
    enrollmentRate: 66.6
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Strategic Sourcing',
    leads: 26,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 77.0,
    enrollmentRate: 48.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Developing Organizational Culture',
    leads: 16,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Integrated Logistics Strategy',
    leads: 16,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 50.0,
    enrollmentRate: 18.7
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Building High Performance Organizations',
    leads: 15,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Transformational & Visionary Leadership',
    leads: 11,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 37.5,
    enrollmentRate: 27.2
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Manufacturing Planning & Control',
    leads: 10,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 50.0,
    enrollmentRate: 30.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Essential Analytical Skills',
    leads: 8,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 33.0,
    enrollmentRate: 12.5
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Strategic Supply Management',
    leads: 6,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 33.0,
    enrollmentRate: 33.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Applying Business Analytics',
    leads: 5,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Analytics for Competitive Advantages',
    leads: 5,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 25.0,
    enrollmentRate: 20.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Developing Strategic Business Models',
    leads: 4,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 75.0,
    enrollmentRate: 75.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Data Mining and Management Strategies',
    leads: 3,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Distribution Fulfilment',
    leads: 2,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'External Market Drivers & Disruptors',
    leads: 1,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Global Advanced Master Cert in Integrated Supply Chain Management',
    leads: 1,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Developing a Creative Mindset',
    leads: 1,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 100.0,
    enrollmentRate: 100.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Supply Chain Management 2',
    leads: 1,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 100.0,
    enrollmentRate: 100.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Global Cert in Supply Chain Management & Logistics',
    leads: 1,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Certificate',
    programName: 'Supply Base Management',
    leads: 1,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },

  // ============================================
  // MSU DEGREES
  // ============================================
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'MS in Healthcare Management',
    leads: 2023,
    contactToApplicationRate: 14.1,
    applicationRate: 4.2,
    contactToEnrollmentRate: 8.3,
    enrollmentRate: 2.4
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'MS in Supply Chain Management',
    leads: 2475,
    contactToApplicationRate: 9.2,
    applicationRate: 3.4,
    contactToEnrollmentRate: 2.8,
    enrollmentRate: 1.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'MS Management Strategy & Leadership',
    leads: 1059,
    contactToApplicationRate: 21.4,
    applicationRate: 9.1,
    contactToEnrollmentRate: 12.0,
    enrollmentRate: 4.8
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'MSL - Strategic Management',
    leads: 647,
    contactToApplicationRate: 10.4,
    applicationRate: 3.2,
    contactToEnrollmentRate: 5.6,
    enrollmentRate: 1.7
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'MSL - Human Resource Management',
    leads: 469,
    contactToApplicationRate: 8.9,
    applicationRate: 3.5,
    contactToEnrollmentRate: 6.1,
    enrollmentRate: 2.1
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'HR Management and Development Cert',
    leads: 200,
    contactToApplicationRate: 7.6,
    applicationRate: 3.0,
    contactToEnrollmentRate: 2.5,
    enrollmentRate: 0.0
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'Leadership & Managing Teams Graduate Certificate',
    leads: 195,
    contactToApplicationRate: 8.7,
    applicationRate: 3.5,
    contactToEnrollmentRate: 1.2,
    enrollmentRate: 0.5
  },
  {
    id: generateId('msu'),
    school: 'MSU',
    level: 'Degree',
    programName: 'Strategic Management Graduate Certificate',
    leads: 69,
    contactToApplicationRate: 14.7,
    applicationRate: 7.2,
    contactToEnrollmentRate: null,
    enrollmentRate: null
  },

  // ============================================
  // SMU CERTIFICATES
  // ============================================
  {
    id: generateId('smu'),
    school: 'SMU',
    level: 'Certificate',
    programName: 'Lean Six Sigma Green',
    leads: 695,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 18.3,
    enrollmentRate: 8.7
  },
  {
    id: generateId('smu'),
    school: 'SMU',
    level: 'Certificate',
    programName: 'Women in Leadership',
    leads: 679,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 16.4,
    enrollmentRate: 6.2
  },
  {
    id: generateId('smu'),
    school: 'SMU',
    level: 'Certificate',
    programName: 'Lean Six Sigma Yellow',
    leads: 424,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 27.9,
    enrollmentRate: 11.7
  },
  {
    id: generateId('smu'),
    school: 'SMU',
    level: 'Certificate',
    programName: 'Lean Six Sigma Black',
    leads: 362,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 3.2,
    enrollmentRate: 1.2
  },
  {
    id: generateId('smu'),
    school: 'SMU',
    level: 'Certificate',
    programName: 'Principles of Lean',
    leads: 269,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 17.7,
    enrollmentRate: 7.0
  },

  // ============================================
  // SMU DEGREES
  // ============================================
  {
    id: generateId('smu'),
    school: 'SMU',
    level: 'Degree',
    programName: 'NPL',
    leads: 1631,
    contactToApplicationRate: 6.3,
    applicationRate: 1.8,
    contactToEnrollmentRate: 4.2,
    enrollmentRate: 1.2
  },
  {
    id: generateId('smu'),
    school: 'SMU',
    level: 'Degree',
    programName: 'MACT',
    leads: 1019,
    contactToApplicationRate: 9.9,
    applicationRate: 2.6,
    contactToEnrollmentRate: 4.4,
    enrollmentRate: 1.2
  },

  // ============================================
  // USF DEGREES
  // ============================================
  {
    id: generateId('usf'),
    school: 'USF',
    level: 'Degree',
    programName: 'MS in Health Informatics',
    leads: 1600,
    contactToApplicationRate: 22.0,
    applicationRate: 9.0,
    contactToEnrollmentRate: 10.0,
    enrollmentRate: 4.1
  },
  {
    id: generateId('usf'),
    school: 'USF',
    level: 'Degree',
    programName: 'Grad Cert in Health Informatics',
    leads: 1200,
    contactToApplicationRate: 8.2,
    applicationRate: 2.7,
    contactToEnrollmentRate: 3.7,
    enrollmentRate: 1.2
  },
  {
    id: generateId('usf'),
    school: 'USF',
    level: 'Degree',
    programName: 'Grad Cert in Health Analytics',
    leads: 767,
    contactToApplicationRate: 6.6,
    applicationRate: 2.2,
    contactToEnrollmentRate: 2.7,
    enrollmentRate: 0.7
  },
  {
    id: generateId('usf'),
    school: 'USF',
    level: 'Degree',
    programName: 'MSHI Health Care Analytics',
    leads: 516,
    contactToApplicationRate: 18.2,
    applicationRate: 6.7,
    contactToEnrollmentRate: 5.5,
    enrollmentRate: 2.1
  },

  // ============================================
  // USF CERTIFICATES
  // ============================================
  {
    id: generateId('usf'),
    school: 'USF',
    level: 'Certificate',
    programName: 'USF Micro Credential',
    leads: 109,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: null,
    enrollmentRate: 0.0
  },

  // ============================================
  // EMORY ECE CERTIFICATES
  // ============================================
  {
    id: generateId('emory-ece'),
    school: 'Emory ECE',
    level: 'Certificate',
    programName: 'Lean Six Sigma Green Belt Healthcare Certificate',
    leads: 1817,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 16.8,
    enrollmentRate: 6.5
  },
  {
    id: generateId('emory-ece'),
    school: 'Emory ECE',
    level: 'Certificate',
    programName: 'Lean Six Sigma Green Belt',
    leads: 1479,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 17.1,
    enrollmentRate: 7.3
  },
  {
    id: generateId('emory-ece'),
    school: 'Emory ECE',
    level: 'Certificate',
    programName: 'Lean Six Sigma Yellow Belt Cert',
    leads: 652,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 31.6,
    enrollmentRate: 15.6
  },
  {
    id: generateId('emory-ece'),
    school: 'Emory ECE',
    level: 'Certificate',
    programName: 'Women in Leadership',
    leads: 585,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 8.9,
    enrollmentRate: 3.4
  },
  {
    id: generateId('emory-ece'),
    school: 'Emory ECE',
    level: 'Certificate',
    programName: 'Lean Six Sigma Black Belt',
    leads: 357,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 11.5,
    enrollmentRate: 3.9
  },
  {
    id: generateId('emory-ece'),
    school: 'Emory ECE',
    level: 'Certificate',
    programName: 'Lean Continuous Improvement Certificate',
    leads: 304,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 21.8,
    enrollmentRate: 6.5
  },

  // ============================================
  // EMORY GBS CERTIFICATES
  // ============================================
  {
    id: generateId('emory-gbs'),
    school: 'Emory GBS',
    level: 'Certificate',
    programName: 'Leveraging AI for Business Success',
    leads: 1965,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 16.1,
    enrollmentRate: 5.9
  },
  {
    id: generateId('emory-gbs'),
    school: 'Emory GBS',
    level: 'Certificate',
    programName: 'Driving ROI with Analytics',
    leads: 885,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 10.6,
    enrollmentRate: 3.6
  },
  {
    id: generateId('emory-gbs'),
    school: 'Emory GBS',
    level: 'Certificate',
    programName: 'Leading Digital Transformation',
    leads: 257,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 14.5,
    enrollmentRate: 3.1
  },

  // ============================================
  // ECSU DEGREES
  // ============================================
  {
    id: generateId('ecsu'),
    school: 'ECSU',
    level: 'Degree',
    programName: 'MS in Management',
    leads: 697,
    contactToApplicationRate: 4.5,
    applicationRate: 4.6,
    contactToEnrollmentRate: 10.4,
    enrollmentRate: 2.4
  },
  {
    id: generateId('ecsu'),
    school: 'ECSU',
    level: 'Degree',
    programName: 'MS in Applied Data Science',
    leads: 598,
    contactToApplicationRate: 20.1,
    applicationRate: 4.8,
    contactToEnrollmentRate: 11.8,
    enrollmentRate: 2.8
  },
  {
    id: generateId('ecsu'),
    school: 'ECSU',
    level: 'Degree',
    programName: 'MS in Special Education',
    leads: 565,
    contactToApplicationRate: 20.9,
    applicationRate: 5.4,
    contactToEnrollmentRate: 10.4,
    enrollmentRate: 3.0
  },
  {
    id: generateId('ecsu'),
    school: 'ECSU',
    level: 'Degree',
    programName: 'MS in Accounting',
    leads: 522,
    contactToApplicationRate: 16.1,
    applicationRate: 4.2,
    contactToEnrollmentRate: 8.0,
    enrollmentRate: 2.1
  },

  // ============================================
  // KEEP CERTIFICATES
  // ============================================
  {
    id: generateId('keep'),
    school: 'KEEP',
    level: 'Certificate',
    programName: 'Negotiations Fundamentals Certificate',
    leads: 373,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 16.3,
    enrollmentRate: 5.3
  },
  {
    id: generateId('keep'),
    school: 'KEEP',
    level: 'Certificate',
    programName: 'Fundamentals of Project Management',
    leads: 272,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 17.0,
    enrollmentRate: 2.9
  },
  {
    id: generateId('keep'),
    school: 'KEEP',
    level: 'Certificate',
    programName: 'Data Driven Decision Making',
    leads: 12,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 57.1,
    enrollmentRate: 33.0
  },
  {
    id: generateId('keep'),
    school: 'KEEP',
    level: 'Certificate',
    programName: 'Lean Six Sigma Green Belt',
    leads: 15,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 0.0,
    enrollmentRate: 0.0
  },
  {
    id: generateId('keep'),
    school: 'KEEP',
    level: 'Certificate',
    programName: 'Project Management Professional',
    leads: 38,
    contactToApplicationRate: null,
    applicationRate: null,
    contactToEnrollmentRate: 8.6,
    enrollmentRate: 5.2
  }
];

// Export school list for filters
export const schools = ['MSU', 'SMU', 'USF', 'Emory ECE', 'Emory GBS', 'ECSU', 'KEEP'] as const;
export type SchoolId = typeof schools[number];

// Export level list for filters
export const levels = ['Certificate', 'Degree'] as const;
export type ProgramLevel = typeof levels[number];

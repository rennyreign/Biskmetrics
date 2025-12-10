export interface Program {
  id: string;
  school: string;
  level: 'Certificate' | 'Degree';
  programName: string;
  leads: number;
  contactToApplicationRate: number | null;
  applicationRate: number | null;
  contactToEnrollmentRate: number | null;
  enrollmentRate: number | null; // Consolidated from leadToEnrollmentRate and inquiryToEnrollmentRate
}

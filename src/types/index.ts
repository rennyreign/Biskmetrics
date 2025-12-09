export interface Program {
  id: string;
  school: string;
  level: 'Certificate' | 'Degree';
  programName: string;
  leads: number;
  contactToApplicationRate: number | null;
  applicationRate: number | null;
  enrollmentRate: number | null;
  contactToEnrollmentRate: number | null;
  inquiryToEnrollmentRate: number | null;
  leadToEnrollmentRate: number | null;
}

import { LOGINS } from '@/enums/auth';

export type TClinicsList = {
  clinicName: string;
  clinicId: string;
  agreeTermsAndConditions: boolean;
  clinicRules: string;
};

export type TIsReadTerms = {
  id: string;
  agreeTermsAndConditions: boolean
};

export type TAvailableBookings = {
  bookingId?: string;
  approvalAvailables: number;
  clinicId: string;
  clinicName: string;
  date: string;
  diagnosisAvailable: number;
  filesToApprove: number;
  filesToDiagnose: number;
};

export type TBooking = {
  bookingDate: string;
  clinic: TClinicsList;
  createdAt: string;
  filesToApprove: number;
  filesToDiagnose: number;
  id: string;
  userRole: LOGINS;
}

export type TBookings = {
  bookings: TBooking[];
  totalBookings: number;
};

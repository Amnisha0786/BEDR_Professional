export type TOverview = {
  filesRequiringResubmission: number;
  nonUrgentReferralsRequiringAction: string;
  unreadDiagnosisReports: number;
  urgentReferralsRequiringAction: string;
};

export type TViewFiles = {
  actionToBeTaken: string;
  actionToBeTakenForLeftEye: string;
  actionToBeTakenForRightEye: string
  diagnosisFormHtml: string;
  id: string;
  optometristFirstName: string;
  optometristLastName: string;
  patientFirstName: string;
  patientLastName: string;
  receivedAt: string;
  issueWith?: string;
  issueDescription?: string;
};

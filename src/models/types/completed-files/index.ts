export type TCompletedFiles = {
  id: string;
  createdAt: string;
  idNumber: string;
  firstName: string;
  lastName: string;
  rightEyeDiagnosis?: string;
  leftEyeDiagnosis?: string;
  diagnosisFormHtml?: string | undefined;
  fileStatus: string;
};

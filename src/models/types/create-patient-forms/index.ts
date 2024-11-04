import { VISION_AFFECTED, VISUAL_IMPAIRMENT } from '@/enums/create-patient';

export type TRegisterNewPatientForm = {
  id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  postCode: string;
  ethnicity: string;
  sex: string;
  callingCode: string;
  patientId?: string;
};

export type TPatientListDetails = {
  callingCode: string;
  dateOfBirth: string;
  email: string;
  ethnicity: string;
  firstName: string;
  id: string;
  lastName: string;
  mobileNumber: string;
  patientId: string;
  postCode: string;
  sex: string;
};
export type TIpadPatientListDetails = {
  callingCode: string;
  dateOfBirth: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  mobileNumber: string;
  postCode: string;
  idNumber: string;
  sex: string;
  ethnicity: string;
};

export type TIntraocularPressure = {
  rightEye: number;
  leftEye: number;
};

export type TReferralForm = {
  id?: string;
  visionScaleType: string;
  affectedEye: string;
  durationOfSymptoms: string;
  visualImpairment: VISUAL_IMPAIRMENT[];
  pain: string;
  redness: string;
  pastEyeHistory?: any[];
  currentTreatmentForEyes: string;
  medicalHistory?: any[];
  familyHistory?: string[];
  lifestyle?: string[];
  remarks?: string;
  intraocularPressure: TIntraocularPressure;
  rightEyeVision: number;
  leftEyeVision: number;
  whatTreatment?: string;
  otherPastEyeHistory?: any;
  otherMedicalHistory?: any;
  otherFamilyHistory?: string;
  durationBetween_3To_52Weeks?: number;
  allergy?: string;
  affectedVision: VISION_AFFECTED[];
  isCorrectedVision?: string;
};

export type TFile = {
  lastModified?: number | string;
  lastModifiedDate?: string;
  name: string;
  size?: number;
  type?: string;
  webkitRelativePath?: string;
};

export type TLeftEyeImagesForm = {
  id?: string;
  fundusImage?: string;
  octVideo?: string;
  thicknessMap?: string;
  intraocularPressure?: number;
  opticDiscImage?: string;
  visualFieldTest?: string;
  dicomFile?: string;
  discOctVideo?: string;
  discThicknessProfile?: string;
  discDicomFile?: string;
  addAnotherImage?: string;
};

export type TLeftEyeImagesFormProgress = {
  id?: string;
  fundusImage?: string;
  octVideo?: string;
  thicknessMap?: string;
  opticDiscImage?: string;
  visualFieldTest?: string;
  dicomFile?: string;
  discOctVideo?: string;
  discThicknessProfile?: string;
  discDicomFile?: string;
  addAnotherImage?: string;
};

export type TRightEyeImagesForm = {
  id?: string;
  fundusImage?: string;
  octVideo?: string;
  thicknessMap?: string;
  opticDiscImage?: string;
  visualFieldTest?: string;
  dicomFile?: string;
  discOctVideo?: string;
  discThicknessProfile?: string;
  discDicomFile?: string;
  addAnotherImage?: string;
};

export type TCommunicationPreferencesForm = {
  id?: string;
  receivingDiagnosisMedium: string;
  name?: string;
  email?: string;
  notificationMedium: string;
  patientFileId?: string;
};

export type TGetInProgressFileData = {
  id?: string;
  fileStatus?: string;
  patient?: TRegisterNewPatientForm;
  referralForm?: TReferralForm;
  rightEyeImages?: TRightEyeImagesForm;
  communicationForm?: TCommunicationPreferencesForm;
  leftEyeImages?: TLeftEyeImagesForm;
};

export type TNewPatientSearch = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
};

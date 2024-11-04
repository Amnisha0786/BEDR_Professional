import { AFFECTED_EYE } from '@/enums/create-patient';
import { ACTION_TO_BE_TAKEN } from '@/enums/file-in-progress';
import {
  TCommunicationPreferencesForm,
  TLeftEyeImagesForm,
  TReferralForm,
  TRegisterNewPatientForm,
  TRightEyeImagesForm,
} from '../create-patient-forms';

export type TColorObj = {
  id?: string;
  rightEyeVision: string;
  leftEyeVision: string;
  visionScaleType: {
    log_mar: string;
    snellen: string;
  };
  isCorrectedVision: string;
  affectedVision: {
    no: string;
    blurred: string;
    patch_curtain: string;
    distortion: string;
    total_loss: string;
    sudden_onset_loss_of_vision: string;
    double_vision_ghosting: string;
  };
  visualImpairment: {
    none: string;
    floaters: string;
    flashes: string;
    sensitive_to_light: string;
    previous_occurence: string;
  };
  durationOfSymptoms: string;
  pastEyeHistory: {
    none: string;
    cataract: string;
    glaucoma: string;
    diabetic_retinopath: string;
    dryamd: string;
    wetamd: string;
  };
  medicalHistory: {
    n_a: string;
    hypertension: string;
    dvt: string;
    stroke: string;
    memory_loss: string;
    diabetes: string;
  };
  familyHistory: {
    n_a: string;
    hypertension: string;
    dvt: string;
    stroke: string;
    memory_loss: string;
    diabetes: string;
  };
  lifestyle: {
    smoker: string;
    former_smoker: string;
    drugs: string;
    alcohol: string;
  };
  intraocularPressure: {
    leftEye: string;
    rightEye: string;
  };
  affectedEye: string;
  redness: string;
  pain: string;
  currentTreatmentForEyes: string;
  whatTreatment?: string;
  remarks?: string;
};

export type TDraftDiagnosisForm = {
  id?: string;
  affectedEye: AFFECTED_EYE;
  leftEyeDiagnosis?: string;
  otherLeftEyeDiagnosis?: string;
  rightEyeDiagnosis?: string;
  otherRightEyeDiagnosis?: string;
  otherOpthalmicConditions?: any[];
  otherInputOpthalmicConditions?: string;
  diagnosisReason?: string;
  actionToBeTakenForLeftEye?: string;
  actionToBeTakenForRightEye?: string;
  remarks?: string;
  isReaderConfident?: string;
};

export type TPatient = {
  dateOfBirth: string;
  email: string;
  ethnicity: string;
  firstName: string;
  id: string;
  lastName: string;
  sex: string;
};

export type TDraftDiagnosisFormPayload = {
  patientFileId: string;
  affectedEye: AFFECTED_EYE;
  rightEyeDiagnosis?: string;
  leftEyeDiagnosis?: string;
  otherOpthalmicConditions?: any[];
  diagnosisReason?: string;
  actionToBeTakenForLeftEye?: string;
  actionToBeTakenForRightEye?: string;
  remarks?: string;
  isReaderConfident?: boolean;
  diagnosisFormHtml?: string;
  diagnosisFormHtmlForOptometrist?: string;
  otherDiagnosisDescription?: string;
};

export type TGetInProgressFileDetails = {
  id: string;
  idNumber: string;
  fileStatus: string;
  patient: TRegisterNewPatientForm;
  referralForm?: TReferralForm;
  rightEyeImages?: TRightEyeImagesForm;
  diagnosisForm?: TDraftDiagnosisFormPayload;
  leftEyeImages?: TLeftEyeImagesForm;
  communicationForm?: TCommunicationPreferencesForm;
  patientReferred?: boolean;
  rejectionReasons?: {
    id: string;
    issueWith: string;
    affectedEye: string;
    issueDescription: string;
    submittedAt: string;
    createdAt: string;
    updatedAt: string;
    isEnabled: boolean;
  };
  reviewedBy: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
  };
};

export type TCloseFileForm = {
  reasonToSkip: string;
  issueWith?: string;
  affectedEye?: string;
  issueDescription?: string;
};

export type TCurrentTab = {
  multiselect?: string;
  itemValue: string;
  keyname: string;
};

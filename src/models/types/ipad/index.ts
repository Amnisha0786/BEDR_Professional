export type TExpressConsentAllow = {
  useAnonymisedDataConsent?: boolean | undefined;
  agreeTermsAndConditions: boolean;
  sendFurtherInformation?: boolean | undefined;
};

export type TDiagnosisReportShare = {
  name?: string;
  email?: string;
};

export type TPatientConsentIpad = {
  useAnonymisedDataConsent?: boolean;
  agreeTermsAndConditions?: boolean;
  sendFurtherInformation?: boolean;
  name?: string;
  email?: string;
  shareDiagnosisReportConsent?: boolean;
  collectStoreAndTransferConsent?: boolean;
  patientFileId?: string;
};

export type TSubmitFile = {
  patientFileId: string;
  fileStatus: string;
};

export type TGetUnpaidFileData = {
  id: string;
  idNumber: string;
  fileStatus: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: number;
    callingCode: string;
    postCode: string;
    dateOfBirth: string;
    profilePicture: string;
    sex: string;
    ethnicity: string;
  };
  optometrist: {
    firstName: string;
    lastName: string;
    email: string;
  };
  rightEyeImages: {
    id?: string;
    eye?: string;
    fundusImage?: string;
    octVideo?: string;
    thicknessMap?: string;
    intraocularPressure?: string;
    opticDiscImage?: string;
    visualFieldTest?: string;
    dicomFile?: string;
    createdAt?: string;
    updatedAt?: string;
    isEnabled?: boolean;
    discOctVideo?: string;
    discThicknessProfile?: string;
    discDicomFile?: string;
    addAnotherImage?: string;
  };
  leftEyeImages: {
    id?: string;
    eye?: string;
    fundusImage?: string;
    octVideo?: string;
    thicknessMap?: string;
    intraocularPressure?: number;
    opticDiscImage?: string;
    visualFieldTest?: string;
    dicomFile?: string;
    createdAt?: string;
    updatedAt?: string;
    isEnabled?: boolean;
    discOctVideo?: string;
    discThicknessProfile?: string;
    discDicomFile?: string;
    addAnotherImage?: string;
  };
  consentForm: {
    id: string;
    collectStoreAndTransferConsent: boolean;
    shareDiagnosisReportConsent: boolean;
    useAnonymisedDataConsent: boolean;
    agreeTermsAndConditions: boolean;
    sendFurtherInformation: boolean;
    signature: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    isEnabled: boolean;
  };
  communicationForm: {
    id: string;
    notificationMedium: string;
    receivingDiagnosisMedium: string;
    name: string | null;
    email: string | null;
    mobileNumber: string | null;
    callingCode: string;
    createdAt: string;
    updatedAt: string;
    isEnabled: boolean;
  };
  payments: {
    id: string;
    paymentId: string;
    paymentStatus: string;
    amount: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

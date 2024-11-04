import {
  AVI_MIME_TYPES,
  VISION_AFFECTED,
  VISUAL_IMPAIRMENT,
} from '@/enums/create-patient';
import { API_URLS } from './api-constants';
import { getAPIRequestWithDecryption, postAPIRequestWithEncryption } from './axios';

type TSelectPatientPayload = {
  patientId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  callingCode?: string;
  postCode?: string;
  dateOfBirth?: string;
  sex?: string;
  ethnicity?: string;
};

type TAddReferralFormPayload = {
  patientFileId: string;
  rightEyeVision: number;
  leftEyeVision: number;
  visionScaleType: string;
  affectedVision: VISION_AFFECTED[];
  affectedEye: string;
  durationOfSymptoms: string;
  rightEyeIntraocularPressure: number;
  leftEyeIntraocularPressure: number;
  visualImpairment: VISUAL_IMPAIRMENT[];
  pain: string;
  redness: string;
  pastEyeHistory?: any[];
  treatment: string;
  medicalHistory?: any[];
  familyHistory?: any[];
  lifestyle?: string[];
  allergy?: string;
  remarks?: string;
};

type TAddEyeImagesPayload = {
  patientFileId: string;
  eye: string;
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

type TGetPatientsPayload = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  page?: number;
  offset?: number;
};

type TGetInProgressFile = {
  practiceId: string;
};

type TOpenPendingFile = {
  practiceId: string;
  patientFileId: string;
};

type TAddCommunicationFormPayload = {
  patientFileId?: string;
  notificationMedium?: string;
  receivingDiagnosisMedium?: string;
  name?: string;
  email?: string;
  mobileNumber?: string;
  callingCode?: string;
};

type TSubmitFilePayload = {
  patientFileId: string;
  fileStatus: string;
};

export const getAllPatients = async (data?: TGetPatientsPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_ALL_PATIENTS,
    data,
  });
};

export const getFileInProgress = async (data: TGetInProgressFile) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_FILE_IN_PROGRESS,
    data,
  });
};

export const getMedicineList = async () => {
  return await getAPIRequestWithDecryption({ url: API_URLS.GET_MEDICINE_LIST });
};

export const selectPatient = async (data: TSelectPatientPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.SELECT_PATIENT,
    data,
  });
};

export const addReferralForm = async (data: TAddReferralFormPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.ADD_REFERRAL_FORM,
    data,
  });
};

export const addEyeImages = async (data: TAddEyeImagesPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.ADD_EYE_IMAGES,
    data,
  });
};

export const addCommunicationForm = async (
  data: TAddCommunicationFormPayload,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.COMMUNICATION_PREFERENCES,
    data,
  });
};

export const submitFile = async (data: TSubmitFilePayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.SUBMIT_FILE,
    data,
  });
};

export const cancelFile = async (fileId: string) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CANCEL_FILE,
    data: { patientFileId: fileId },
  });
};

export const uploadFile = async (file: File) => {
  if (!file) {
    return;
  }
  const formData = new FormData();
  formData.append('file', file);
  return await postAPIRequestWithEncryption({
    url: AVI_MIME_TYPES?.includes(file?.type)
      ? `${API_URLS.UPLOAD_FILE}?is_avi=true`
      : API_URLS.UPLOAD_FILE,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
    withoutDecimalize: true,
    isPayloadNotEncrypted: true,
  });
};

export const deleteUploadedFile = async (key: string) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.DELETE_UPLOADED_FILE,
    data: { key },
  });
};

export const getPendingFiles = async (data: TGetInProgressFile) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_PENDING_FILES,
    data,
  });
};

export const openPendingFiles = async (data: TOpenPendingFile) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.OPEN_PENDING_FILE,
    data,
  });
};

export const getFileInProgressIpad = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_FILE_IN_PROGRESS_IPAD,
    data: {},
  });
};

export const cancelFileIpad = async (fileId: string) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CANCEL_FILE_IPAD,
    data: { patientFileId: fileId },
  });
};

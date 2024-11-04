import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TFileStatusTrackerPayload = {
  practiceId: string;
  searchQuery?: string;
  page: number;
  offset: number;
};

type TPracticeFileStatusTrackerPayload = {
  searchQuery?: string;
  page?: number;
  offset?: number;
};

type TMoveToPatientFiles = {
  patientFileIds: string[];
};

type TConfirmReferral = {
  patientFileId: string;
};

export const getFileStatusTrackerList = async (
  data: TFileStatusTrackerPayload,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_FILE_STATUS,
    data,
  });
};

export const moveToPatientFiles = async (data: TMoveToPatientFiles) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.MOVE_TO_PATIENT_FILES,
    data,
  });
};

export const confirmPatientReferral = async (data: TConfirmReferral) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CONFIRM_REFERRAL,
    data,
  });
};

export const getPracticeFileStatusTrackerList = async (
  data: TPracticeFileStatusTrackerPayload,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.PRACTICE_FILE_STATUS_TRACKER,
    data,
  });
};

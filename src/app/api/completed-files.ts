import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TCompletedFilesPayload = {
  startDate?: string;
  endDate?: string;
  diagnosis?: string;
  searchQuery?: string;
  sortBy?: string;
  page?: number;
  offset?: number;
};

type TViewPatientFile = {
  patientFileId: string;
};

export const getAllCompletedFiles = async (data: TCompletedFilesPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.COMPLETED_FILES,
    data,
  });
};

export const viewPatientFile = async (data: TViewPatientFile) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.VIEW_PATIENT_FILE,
    data,
  });
};

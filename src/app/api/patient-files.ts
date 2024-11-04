import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TFileStatusTrackerPayload = {
  practiceId: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  sortBy?: string;
  page: number;
  offset: number;
};

export const getOptometristPatientFiles = async (
  data: TFileStatusTrackerPayload,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_PATIENT_FILES,
    data,
  });
};

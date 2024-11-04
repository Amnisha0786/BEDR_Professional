import { TPatientConsentIpad, TSubmitFile } from '@/models/types/ipad';
import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

export const getListFilesData = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_FILES_LIST,
    data: {},
  });
};

export const submitPatientConsent = async (data: TPatientConsentIpad) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.SUBMIT_PATIENT_CONSENT,
    data,
  });
};

export const submitFile = async (data: TSubmitFile) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.SUBMIT_FILE_DATA,
    data,
  });
};

export const checkoutSession = async (data: TPatientConsentIpad) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CREATE_CHECKOUT_SESSION,
    data,
  });
};

export const getPatientsFiles = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.SUBMITTED_FILES,
    data: {},
  });
};

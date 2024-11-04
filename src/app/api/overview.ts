import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

export const getPracticeOverviewData = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_PRACTICE_DASHBOARD_DATA,
    data: {},
  });
};

export const getUnreadFiles = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_UNREAD_FILES,
    data: {},
  });
};

export const getUrgentFiles = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_URGENT_FILES,
    data: {},
  });
};

export const getNonUrgentFiles = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_NON_URGENT_FILES,
    data: {},
  });
};

export const getResubmissionFiles = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_RESUBMISSION_FILES,
    data: {},
  });
};

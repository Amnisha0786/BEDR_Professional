import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

export const getOptometristDashboardData = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_DASHBOARD_DATA,
    data: {},
  });
};

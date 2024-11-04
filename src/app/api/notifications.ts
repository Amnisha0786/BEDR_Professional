import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TNotificationPayload = {
  page?: number;
  offset?: number;
};

export const getNotifications = async (data: TNotificationPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_NOTIFICATION,
    data,
  });
};

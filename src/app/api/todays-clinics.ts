import { ALERT_STATUS } from '@/enums/todays-clinics';
import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TOpenNextFilePayload = {
  fileType: string;
};

type TUrgentBookingAlertPayload = {
  urgentRequestId: string;
  bookingAlertStatus: ALERT_STATUS;
};

export const getTodaysClinics = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_TODAYS_CLINICS,
    data: {},
  });
};

export const openNextFile = async (data: TOpenNextFilePayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.OPEN_NEXT_FILE,
    data,
  });
};

export const urgentAlertStatus = async (data: TUrgentBookingAlertPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.ALERT_RESPONSE,
    data,
  });
};
export const sendMessageTodayTeam = async (data: any) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.SEND_MESSAGE_TODAY_TEAM,
    data,
  });
};

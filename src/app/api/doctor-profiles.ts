import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TDoctorsListPayload = {
  searchQuery: string;
  page: number;
  offset: number;
};

export const getDoctorsList = async (data: TDoctorsListPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.LIST_DOCTORS,
    data,
  });
};

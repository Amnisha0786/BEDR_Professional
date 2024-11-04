import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TGetOptometristsPayload = {
  name?: string;
  page?: number;
  offset?: number;
};

type TAddOptometristPayload = {
  optometristIds: string[];
};

type TRemoveOptometristPayload = {
  optometristId: string;
};

export const getAllOptometrists = async (data?: TGetOptometristsPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_ALL_OPTOMETRISTS,
    data,
  });
};

export const getPracticeOptometrists = async (
  data?: TGetOptometristsPayload,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_PRACTICE_OPTOMETRISTS,
    data,
  });
};

export const addOptometrist = async (data: TAddOptometristPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.ADD_OPTOMETRIST,
    data,
  });
};

export const removeOptometrist = async (data: TRemoveOptometristPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.REMOVE_OPTOMETRIST,
    data,
  });
};

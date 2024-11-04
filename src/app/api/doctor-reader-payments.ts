import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TGetPaymentsPayload = {
  page: number;
  offset: number;
  startDate?: string;
  endDate?: string;
  month?: string
};

export const getBankDetails = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_BANK_DETAILS,
    data: {},
  });
};

export const setBankDetails = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.ADD_BANK_DETAILS,
    data: {},
  });
};

export const getAllPayments = async (data: TGetPaymentsPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_PAYMENTS,
    data,
  });
};

export const getMonthlyPayments = async (data: TGetPaymentsPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_MONTHLY_PAYMENTS,
    data,
  });
};

export const deleteBankAccount = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.DELETE_BANK_ACCOUNT,
    data: {},
  });
};

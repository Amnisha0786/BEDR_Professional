import { TLoginForm } from '@/models/types/auth';
import {
  getAPIRequestWithDecryption,
  getAPIRequestWithoutDecryption,
  postAPIRequestWithoutEncryption,
} from './axios';
import { API_URLS } from './api-constants';
import { convertJsonToFormdata } from '@/lib/common/convert-json-to-formdata';

export type TDeviceType = 'web';

export type TRegisterNewUserPayload = {
  role: string;
  gocNumber?: string;
  gmcNumber?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  postCode?: string;
  practice?: string;
  confirmPassword: string;
  callingCode?: string;
  deviceType?: TDeviceType;
  profilePicture?: string;
  practiseId?: string;
  otp?: string;
  sex?: string;
  ethinicity?: string;
  otpType?: string;
  termsAndConditions: boolean;
  icoNumber?: string;
  practiceName?: string;
  practiceAddress?: string;
  contactPerson?: string;
  salutation?: string;
};

type TVerifyOtpPayload = {
  mobileNumber?: string;
  email: string;
  role: string;
  otpType: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  practiceId?: string;
  deviceType?: TDeviceType;
};

type TForgotPasswordPayload = {
  email: string;
  role: string;
};

type TResetPassword = {
  token: string;
  password: string;
};

type TGetPractices = {
  email: string;
  role: string;
};

type TPractices = { practiceId: string; practiceName: string };

type TGetPracticesResponse = {
  data: { data: TPractices[]; status: number; message?: string };
};

export const verifyOTP = async (
  data: TVerifyOtpPayload | FormData,
  isFormdata = false,
) => {
  let payload;
  if (isFormdata) {
    payload = convertJsonToFormdata(data);
  } else {
    payload = data;
  }

  return await postAPIRequestWithoutEncryption({
    url: API_URLS.VERIFY_OTP,
    data: payload,
    headers: isFormdata
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' },
    withoutDecimalize: isFormdata,
  });
};

export const registerNewUser = async (
  data: TRegisterNewUserPayload | FormData,
) => {
  return await postAPIRequestWithoutEncryption({
    url: API_URLS.SIGNUP,
    data: convertJsonToFormdata(data),
    headers: { 'Content-Type': 'multipart/form-data' },
    withoutDecimalize: true,
  });
};

export const loginUser = async (data: TLoginForm) => {
  return await postAPIRequestWithoutEncryption({ url: API_URLS.LOGIN, data });
};

export const logOutUser = async (refreshToken: string) => {
  return await getAPIRequestWithoutDecryption({
    url: API_URLS.LOGOUT,
    headers: { refresh_token: refreshToken },
  });
};

export const forgotPassword = async (data: TForgotPasswordPayload) => {
  return await postAPIRequestWithoutEncryption({
    url: API_URLS.FORGOT_PASSWORD,
    data,
  });
};

export const resetPassword = async (data: TResetPassword) => {
  return await postAPIRequestWithoutEncryption({
    url: API_URLS.RESET_PASSWORD,
    data,
  });
};

export const generateNewAccessToken = async (refreshToken: string) => {
  return await getAPIRequestWithDecryption({
    url: API_URLS.GET_NEW_ACCESS_TOKEN,
    headers: { refresh_token: refreshToken },
  });
};

export const getOptometristPractices = async (
  data: TGetPractices,
): Promise<TGetPracticesResponse> => {
  return await postAPIRequestWithoutEncryption({
    url: API_URLS.GET_PRACTICES,
    data,
  });
};

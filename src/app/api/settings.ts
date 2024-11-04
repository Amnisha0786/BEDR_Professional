import { TSettingsHelpAndSupport } from '@/models/types/settings';
import { TNotificationPayload } from '@/models/types/settings';
import { API_URLS } from './api-constants';
import {
  getAPIRequestWithDecryption,
  postAPIRequestWithEncryption,
  postAPIRequestWithoutEncryption,
} from './axios';

type TGetTermsConditionsPayload = {
  role: string;
};
type TChangePasswordPayload = {
  password: string;
  currentPassword: string;
};

type TEditUserPayload = {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  callingCode?: string;
  postCode?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  gocNumber?: string;
  gmcNumber?: string;
  sex?: string;
  ethnicity?: string;
  icoNumber?: string;
  practiceName?: string;
  practiceAddress?: string;
  contactPerson?: string;
};

export const getUserProfile = async () => {
  return await getAPIRequestWithDecryption({ url: API_URLS.GET_USER_PROFILE });
};

export const helpAndSupport = async (data: TSettingsHelpAndSupport) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.HELP_SUPPORT,
    data,
  });
};
export const getTermsConditions = async (data: TGetTermsConditionsPayload) => {
  return await postAPIRequestWithoutEncryption({
    url: API_URLS.TERMS_CONDITIONS,
    data,
  });
};

export const getPrivacyPolicy = async (data: TGetTermsConditionsPayload) => {
  return await postAPIRequestWithoutEncryption({
    url: API_URLS.PRIVACY_POLICY,
    data,
  });
};

export const notificationSettings = async (data: TNotificationPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.NOTIFICATIONS_SETTINGS,
    data,
  });
};

export const agreeToTermsConditions = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.AGREE_TO_TERMS_CONDITION,
    data: {},
  });
};

export const getNotificationSettings = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_NOTIFICATION_SETTINGS,
    data: {},
  });
};

export const editUserProfile = async (data: TEditUserPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.EDIT_PROFILE,
    data,
  });
};

export const changeUserPassword = async (data: TChangePasswordPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CHANGE_PASSWORD,
    data,
  });
};

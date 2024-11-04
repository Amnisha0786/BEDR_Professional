import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TGetUserChatIdPayload = {
  userId: string;
};

type TGetUserChatMessagesPayload = {
  chatId: string;
};

export const getUserChatId = async (data: TGetUserChatIdPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_CHAT_ID,
    data,
  });
};

export const getUserChatMessages = async (
  data: TGetUserChatMessagesPayload,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_USER_CHAT_MESSAGES,
    data,
  });
};

export const getAllUsers = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_ALL_USERS,
    data: {},
  });
};
export const getAllDoctorAndReaders = async (data: any) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_ALL_DOCTOR_AND_READERS,
    data,
  });
};

export const clearUserChat = async (data: TGetUserChatMessagesPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CLEAR_CHAT,
    data,
  });
};

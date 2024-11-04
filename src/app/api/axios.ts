'use client';

import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import decamelizeKeys from 'decamelize-keys';
import { toast } from 'sonner';

import { generateNewAccessToken } from './auth';
import {
  clearCookies,
  clearIpadCookies,
  getValueFromCookies,
  setValuesInCookies,
} from '@/lib/common/manage-cookies';
import { getConfig } from '@/lib/utils';
import { decryptData, encryptData } from '@/lib/common/secure-request';
import {
  TGetRequestProps,
  TPostRequestProps,
} from '@/models/types/api-methods';
import {
  clearRedux,
  storeNewIpadAccessToken,
  storeNewAccessToken,
} from '@/lib/store';

const API_BASE_URL = getConfig();
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
const getRsaKeys = () => {
  const ipadAccessToken = getValueFromCookies('ipadAccessToken');
  const privateKey = ipadAccessToken?.length
    ? getValueFromCookies('ipadPrivateKey')
    : getValueFromCookies('privateKey');
  const publicKey = ipadAccessToken?.length
    ? getValueFromCookies('ipadPublicKey')
    : getValueFromCookies('publicKey');
  return { privateKey, publicKey };
};

let isRefreshing = false;
let subscribers: ((token?: string) => void)[] = [];

const onRefreshed = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

const addSubscriber = (callback: () => void) => {
  subscribers.push(callback);
};

instance.interceptors.request.use(
  (config) => {
    const ipadAccessToken = getValueFromCookies('ipadAccessToken');
    const accessToken = ipadAccessToken?.length
      ? getValueFromCookies('ipadAccessToken')
      : getValueFromCookies('accessToken');
    if (accessToken) {
      if (config.headers) {
        config.headers.access_token = accessToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: any) => {
    const responseData = camelcaseKeys(response, { deep: true });
    return responseData;
  },
  async (error) => {
    const ipadAccessToken = getValueFromCookies('ipadAccessToken');
    const refreshToken = ipadAccessToken?.length
      ? getValueFromCookies('ipadRefreshToken')
      : getValueFromCookies('refreshToken');
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          if (!refreshToken) {
            return;
          }

          originalRequest.headers.refresh_token = refreshToken;
          const getAccessToken = await generateNewAccessToken(refreshToken);
          if (getAccessToken?.data?.data) {
            const { privateKey, publicKey } = getRsaKeys();
            const role = getValueFromCookies('role');
            onRefreshed(getAccessToken?.data?.data);
            isRefreshing = false;
            if (ipadAccessToken?.length) {
              setValuesInCookies('ipadAccessToken', getAccessToken?.data?.data);
              storeNewIpadAccessToken(
                getAccessToken?.data?.data,
                refreshToken,
                role,
                privateKey,
                publicKey,
              );
            } else {
              setValuesInCookies('accessToken', getAccessToken?.data?.data);
              storeNewAccessToken(
                getAccessToken?.data?.data,
                refreshToken,
                role,
                privateKey,
                publicKey,
              );
            }

            return instance(originalRequest);
          }
        } catch (error) {
          isRefreshing = false;
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 403
          ) {
            {
              ipadAccessToken?.length ? clearIpadCookies() : clearCookies();
            }
            clearRedux();
            window.location.pathname = '/login';
            toast.success('Session expired. Please login again.');
          } else {
            return Promise.reject(error);
          }
        }
      } else {
        return new Promise((resolve) => {
          addSubscriber((token?: string) => {
            originalRequest.headers.access_token = token;
            resolve(instance(originalRequest));
          });
        });
      }
    }
    return Promise.reject(error);
  },
);

export const getAPIRequestWithDecryption = ({
  url,
  headers,
  config,
}: TGetRequestProps) => {
  return instance.request({
    method: 'get',
    url,
    headers: {
      ...instance.defaults.headers.common,
      ...headers,
    },
    transformResponse: [
      function (responseData) {
        if (JSON.parse(responseData)?.data) {
          const { privateKey } = getRsaKeys();
          if (!privateKey) return;
          const decryptedResponse = decryptData({
            data: JSON.parse(responseData)?.data,
            privateKey,
          });
          return decryptedResponse;
        }
      },
    ],
    ...config,
  });
};

export const getAPIRequestWithoutDecryption = ({
  url,
  headers,
  config,
}: TGetRequestProps) => {
  return instance.request({
    method: 'get',
    url,
    headers: {
      ...instance.defaults.headers.common,
      ...headers,
    },
    ...config,
  });
};

export const postAPIRequestWithEncryption = ({
  url,
  headers,
  config,
  data,
  isPayloadNotEncrypted = false,
  withoutDecimalize = false,
}: TPostRequestProps) => {
  let requestBody;
  if (!isPayloadNotEncrypted) {
    const { publicKey } = getRsaKeys();
    if (!publicKey || !data) {
      return;
    }
    requestBody = encryptData({ data: decamelizeKeys(data), publicKey });
  } else {
    if (!withoutDecimalize) {
      requestBody = decamelizeKeys(data);
    } else {
      requestBody = data;
    }
  }
  return instance.request({
    method: 'post',
    url,
    data: requestBody,
    headers: {
      ...instance.defaults.headers.common,
      ...headers,
    },
    transformResponse: [
      function (responseData) {
        if (JSON.parse(responseData)?.data) {
          const { privateKey } = getRsaKeys();
          if (!privateKey) return;
          const decryptedResponse = decryptData({
            data: JSON.parse(responseData)?.data,
            privateKey,
            message: JSON.parse(responseData)?.message,
            status: JSON.parse(responseData)?.status,
          });
          return decryptedResponse;
        } else {
          return {
            message: JSON.parse(responseData)?.message,
            status: JSON.parse(responseData)?.status,
          };
        }
      },
    ],
    ...config,
  });
};

export const postAPIRequestWithoutEncryption = ({
  url,
  headers,
  config,
  data,
  withoutDecimalize = false,
}: TPostRequestProps) => {
  return instance.request({
    method: 'post',
    url,
    data: withoutDecimalize ? data : decamelizeKeys(data),
    headers: {
      ...instance.defaults.headers.common,
      ...headers,
    },
    ...config,
  });
};

export const putAPIRequest = ({
  url,
  headers,
  config,
  data,
}: TPostRequestProps) => {
  return instance.request({
    method: 'put',
    url,
    data: decamelizeKeys(data),
    headers: {
      ...instance.defaults.headers.common,
      ...headers,
    },
    transformResponse: [
      function (responseData) {
        const { privateKey } = getRsaKeys();
        if (!privateKey) return;
        const decryptedResponse = decryptData({
          data: JSON.parse(responseData)?.data,
          privateKey,
        });
        return decryptedResponse;
      },
    ],
    ...config,
  });
};

export const patchAPIRequest = ({
  url,
  headers,
  config,
  data,
}: TPostRequestProps) => {
  return instance.request({
    method: 'patch',
    url,
    data: decamelizeKeys(data),
    headers: {
      ...instance.defaults.headers.common,
      ...headers,
    },
    transformResponse: [
      function (responseData) {
        const { privateKey } = getRsaKeys();
        if (!privateKey) return;
        const decryptedResponse = decryptData({
          data: JSON.parse(responseData)?.data,
          privateKey,
        });
        return decryptedResponse;
      },
    ],
    ...config,
  });
};

export const deleteAPIRequest = ({
  url,
  headers,
  config,
}: TGetRequestProps) => {
  return instance.request({
    method: 'delete',
    url,
    headers: {
      ...instance.defaults.headers.common,
      ...headers,
    },
    transformResponse: [
      function (responseData) {
        const { privateKey } = getRsaKeys();
        if (!privateKey) return;
        const decryptedResponse = decryptData({
          data: JSON.parse(responseData)?.data,
          privateKey,
        });
        return decryptedResponse;
      },
    ],
    ...config,
  });
};

export default instance;

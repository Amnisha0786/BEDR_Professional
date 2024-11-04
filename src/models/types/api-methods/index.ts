import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export type TGetRequestProps = {
  url: string;
  headers?: RawAxiosRequestHeaders;
  config?: AxiosRequestConfig;
};

export type TPostRequestProps = {
  url: string;
  headers?: RawAxiosRequestHeaders;
  config?: AxiosRequestConfig;
  data: any;
  isPayloadNotEncrypted?: boolean;
  withoutDecimalize?: boolean;
};

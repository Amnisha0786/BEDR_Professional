import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

export type TGetRequestProps = {
  url: string;
  headers?: RawAxiosRequestHeaders;
  config?: AxiosRequestConfig;
};

import { PERFORMANCE_DATA_FOR } from '@/enums/performance-data';
import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TPerformanceDataFor = {
  performanceDataFor: PERFORMANCE_DATA_FOR;
  practiceId: string;
};

export const getPerformanceData = async (data: TPerformanceDataFor) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_PERFORMANCE_DATA,
    data,
  });
};

'use client';

import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { TRefreshStates } from '@/lib/updateReduxState/updateReduxStateSlice';

const useRefreshStates = () => {
  const refreshData = useSelector(
    (state: RootState) => state?.refreshData?.data,
  );
  if (refreshData) {
    return refreshData as TRefreshStates;
  }

  return null;
};

export default useRefreshStates;

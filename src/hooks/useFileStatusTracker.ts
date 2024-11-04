'use client';

import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { TFileStatusTrackerList } from '@/models/types/file-status-tracker';

const useFileStatusTracker = () => {
  const fileStatusTrackerList = useSelector(
    (state: RootState) => state?.fileStatusTracker?.data,
  );
  if (fileStatusTrackerList) {
    return fileStatusTrackerList as TFileStatusTrackerList[];
  }

  return null;
};

export default useFileStatusTracker;

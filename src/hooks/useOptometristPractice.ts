'use client';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { TOptometristPracticeDetails } from '@/lib/optometristPractice/optometristPracticeSlice';

const useOptometristPractice = () => {
  const optoPractice = useSelector(
    (state: RootState) => state?.optometristPractice?.data,
  );
  if (optoPractice) {
    return optoPractice as TOptometristPracticeDetails;
  }

  return null;
};

export default useOptometristPractice;

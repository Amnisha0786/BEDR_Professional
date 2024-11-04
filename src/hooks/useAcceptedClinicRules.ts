'use client';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';

const useAcceptedClinicRules = () => {
  const getAcceptedClinicRules = useSelector(
    (state: RootState) => state?.getAcceptedClinicRules?.data,
  );

  return getAcceptedClinicRules;
};

export default useAcceptedClinicRules;

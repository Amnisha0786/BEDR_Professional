'use client';

import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';

const useTodayClinicUser = () => {
  const isUserFromClinic = useSelector(
    (state: RootState) => state?.userFromClinic,
  );
  if (isUserFromClinic) {
    return isUserFromClinic;
  }
  return null;
};

export default useTodayClinicUser;

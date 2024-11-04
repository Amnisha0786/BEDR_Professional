'use client';
import { UserData } from '@/lib/userProfile/userProfileSlice';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';

const useUserProfile = () => {
  const userProfile = useSelector(
    (state: RootState) => state?.userProfile?.data?.data,
  );
  if (userProfile) {
    return userProfile as UserData;
  }

  return null;
};

export default useUserProfile;

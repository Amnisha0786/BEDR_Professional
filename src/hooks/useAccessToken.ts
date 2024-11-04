'use client';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { TAccessTokenDetails } from '@/lib/userAuthentication/userAuthenticationSlice';

const useAccessToken = () => {
  const userAccessToken = useSelector(
    (state: RootState) => state?.authenticationKeys?.data,
  );
  if (userAccessToken) {
    return userAccessToken as TAccessTokenDetails;
  }

  return null;
};

export default useAccessToken;

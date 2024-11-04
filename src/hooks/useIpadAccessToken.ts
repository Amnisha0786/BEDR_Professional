'use client';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { TAccessTokenDetails } from '@/lib/userAuthentication/userIpadAuthenticationSlice';

const useIpadAccessToken = () => {
  const ipadUserAccessToken = useSelector(
    (state: RootState) => state?.userAccessTokenIpad?.data,
  );
  if (ipadUserAccessToken) {
    return ipadUserAccessToken as TAccessTokenDetails;
  }
  return null;
};

export default useIpadAccessToken;

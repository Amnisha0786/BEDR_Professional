'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

type IProp = {
  url: string;
};

const useUrl = () => {
  const UserUrl = useSelector((state: RootState) => state?.userUrl);
  if (UserUrl) {
    return UserUrl as IProp
  }
  return null;
};

export default useUrl;

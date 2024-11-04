'use client';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';

const useOnlineUsers = () => {
  const onlineUsers = useSelector(
    (state: RootState) => state?.onlineUsers?.data,
  );
  if (onlineUsers) {
    return onlineUsers as string[];
  }

  return null;
};

export default useOnlineUsers;

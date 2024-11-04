'use client';

import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { TMessageStatus } from '@/lib/messageStatus/messageStatusSlice';

const useUserMessageStatus = () => {
  const deliveredMessages = useSelector(
    (state: RootState) => state?.messageStatus?.data,
  );
  if (deliveredMessages) {
    return deliveredMessages as TMessageStatus[];
  }

  return null;
};

export default useUserMessageStatus;

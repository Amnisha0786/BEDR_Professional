'use client';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { Socket } from 'socket.io-client';

const useSocket = () => {
  const socketObj = useSelector((state: RootState) => state?.socketIo?.data);
  if (socketObj) {
    return socketObj as Socket;
  }

  return null;
};

export default useSocket;

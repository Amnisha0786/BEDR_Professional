'use client';
import { useSelector } from 'react-redux';

import { RootState } from '@/lib/store';
import { TChatUsers } from '@/models/types/messages';

const useChatUsers = () => {
  const getAllChatUsers = useSelector(
    (state: RootState) => state?.getChatUsers?.data,
  );
  if (getAllChatUsers) {
    return getAllChatUsers as TChatUsers[];
  }

  return null;
};

export default useChatUsers;

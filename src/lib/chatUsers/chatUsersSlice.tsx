import { TChatUsers } from '@/models/types/messages';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TGetChatUsers = {
  data: TChatUsers[];
  loading: false;
  error: null;
};

const initialState: TGetChatUsers = {
  data: [],
  loading: false,
  error: null,
};

export const chatUsersSlice = createSlice({
  name: 'getChatUsers',
  initialState,
  reducers: {
    getChatUsers: (state, action: PayloadAction<TChatUsers[]>) => {
      (state.data = action?.payload?.sort((a: TChatUsers, b: TChatUsers) => {
        if (!a?.lastMessage?.createdAt) return 1;
        if (!b?.lastMessage?.createdAt) return -1;
        return (
          new Date(b?.lastMessage?.createdAt).valueOf() -
          new Date(a?.lastMessage?.createdAt).valueOf()
        );
      })),
        (state.loading = false);
    },
  },
});

export const { getChatUsers } = chatUsersSlice.actions;

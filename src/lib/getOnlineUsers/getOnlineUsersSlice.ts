import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TUserAuthentication = {
  data: string[];
  loading: false;
  error: null;
};

const initialState: TUserAuthentication = {
  data: [],
  loading: false,
  error: null,
};

export const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    fetchOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.data = action?.payload;
      state.loading = false;
    },
  },
});

export const { fetchOnlineUsers } = onlineUsersSlice.actions;

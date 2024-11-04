import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  url: '',
};

export const userPageUrl = createSlice({
  name: 'userUrl',
  initialState,
  reducers: {
    userUrl: (state, action: PayloadAction<string>) => {
      state.url = action?.payload;
    },
    resetUrl: () => initialState,
  },
});

export const { userUrl, resetUrl } = userPageUrl.actions;

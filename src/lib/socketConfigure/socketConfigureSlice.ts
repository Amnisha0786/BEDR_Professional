import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const socketConfigureSlice = createSlice({
  name: 'socketIo',
  initialState,
  reducers: {
    setSocketConfig: (state, action: PayloadAction<any | null>) => {
      state.data = action?.payload;
    },
  },
});

export const { setSocketConfig } = socketConfigureSlice.actions;

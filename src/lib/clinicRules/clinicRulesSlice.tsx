import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TGetChatUsers = {
  data: number;
  loading: false;
  error: null;
};

const initialState: TGetChatUsers = {
  data: 0,
  loading: false,
  error: null,
};

export const clinicRulesSlice = createSlice({
  name: 'getAcceptedClinicRules',
  initialState,
  reducers: {
    setAcceptedClinicRules: (state, action: PayloadAction<number>) => {
      state.data = action?.payload;
      state.loading = false;
    },
  },
});

export const { setAcceptedClinicRules } = clinicRulesSlice.actions;

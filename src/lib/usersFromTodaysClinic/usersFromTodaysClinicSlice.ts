import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  isFromClinic: false,
};

export const userFromTodaysClinicSlice = createSlice({
  name: 'userFromClinic',
  initialState,
  reducers: {
    setIsUserFromClinic: (state, action: PayloadAction<boolean>) => {
      state.isFromClinic = action?.payload;
    },
    resetIsUserFromClinic: () => initialState,
  },
});

export const { setIsUserFromClinic, resetIsUserFromClinic } =
  userFromTodaysClinicSlice.actions;

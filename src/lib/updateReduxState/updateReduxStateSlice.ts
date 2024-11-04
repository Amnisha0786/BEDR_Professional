import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TRefreshStates = {
  isRefreshFileStatusTracker?: boolean;
  isRefreshTodaysClinic?: boolean;
  isRefreshPractice?: boolean;
  isRefreshPatientFiles?: boolean;
  isRefreshCompletedFiles?: boolean;
};

type TRefreshData = {
  data: TRefreshStates;
};

const initialState: TRefreshData = {
  data: {
    isRefreshFileStatusTracker: false,
    isRefreshTodaysClinic: false,
    isRefreshPractice: false,
    isRefreshPatientFiles: false,
    isRefreshCompletedFiles: false,
  },
};

export const updateReduxStateSlice = createSlice({
  name: 'refreshData',
  initialState,
  reducers: {
    setRefreshData: (state, action: PayloadAction<TRefreshStates>) => {
      state.data = action?.payload;
    },
  },
});

export const { setRefreshData } = updateReduxStateSlice.actions;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { TFileStatusTrackerList } from '@/models/types/file-status-tracker';

type TFileTracker = {
  data: TFileStatusTrackerList[];
  loading: false;
  error: null;
};

const initialState: TFileTracker = {
  data: [],
  loading: false,
  error: null,
};

export const fileStatusTrackerListSlice = createSlice({
  name: 'fileStatusTracker',
  initialState,
  reducers: {
    setFileStatusTracker: (
      state,
      action: PayloadAction<TFileStatusTrackerList[]>,
    ) => {
      state.data = action?.payload;
      state.loading = false;
    },
  },
});

export const { setFileStatusTracker } = fileStatusTrackerListSlice.actions;

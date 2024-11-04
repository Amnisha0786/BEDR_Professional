import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TOptometristPracticeDetails = {
  practiceName?: string;
  practiceId?: string;
};

type TOptometristPractice = {
  data: TOptometristPracticeDetails | null;
  loading: false;
  error: null;
};

const initialState: TOptometristPractice = {
  data: null,
  loading: false,
  error: null,
};

export const optometristPracticeSlice = createSlice({
  name: 'optometristPractice',
  initialState,
  reducers: {
    optometristPractice: (
      state,
      action: PayloadAction<TOptometristPracticeDetails | null>,
    ) => {
      (state.data = action?.payload), (state.loading = false);
    },
    resetPractice: () => initialState,
  },
});

export const { optometristPractice, resetPractice } =
  optometristPracticeSlice.actions;

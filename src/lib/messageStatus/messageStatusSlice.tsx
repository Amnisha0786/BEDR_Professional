import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type TMessageStatus = {
  chatId: string;
  content: string;
  contentType: string;
  createdAt: string;
  deliveredAt: string;
  id: string;
  isEnabled: boolean;
  messageStatus: string;
  readAt: string;
  receiverId: string;
  senderId: string;
  sentAt: string;
  updatedAt: string;
};

type TUserAuthentication = {
  data: TMessageStatus[];
  loading: false;
  error: null;
};

const initialState: TUserAuthentication = {
  data: [],
  loading: false,
  error: null,
};

export const userMessageStatusSlice = createSlice({
  name: 'messageStatus',
  initialState,
  reducers: {
    fetchStatusForMessageUsers: (
      state,
      action: PayloadAction<TMessageStatus[]>,
    ) => {
      const newStatuses = action.payload;

      newStatuses?.forEach((newStatus) => {
        const index = state?.data?.findIndex(
          (status) => status?.id === newStatus?.id,
        );
        if (index !== -1) {
          state.data[index] = newStatus;
        } else {
          state.data.push(newStatus);
        }
      });
      state.loading = false;
    },
  },
});

export const { fetchStatusForMessageUsers } = userMessageStatusSlice.actions;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getValueFromCookies } from '../common/manage-cookies';

export type TAccessTokenDetails = {
  accessToken: string;
  role?: string;
  privateKey?: string;
  publicKey?: string;
  refreshToken: string;
};

type TUserAuthentication = {
  data: TAccessTokenDetails | null;
  loading: false;
  error: null;
};

const defaultValues: TUserAuthentication = {
  data: {
    accessToken: '',
    role: '',
    privateKey: '',
    publicKey: '',
    refreshToken: '',
  },
  loading: false,
  error: null,
};

const initialState: TUserAuthentication = {
  data: {
    accessToken: getValueFromCookies('accessToken') || '',
    role: getValueFromCookies('role') || '',
    privateKey: getValueFromCookies('privateKey') || '',
    publicKey: getValueFromCookies('publicKey') || '',
    refreshToken: getValueFromCookies('refreshToken') || '',
  },
  loading: false,
  error: null,
};

export const userAuthenticationSlice = createSlice({
  name: 'authenticationKeys',
  initialState,
  reducers: {
    setAccessToken: (
      state,
      action: PayloadAction<TAccessTokenDetails | null>,
    ) => {
      state.data = action?.payload;
      state.loading = false;
    },
    resetAccesToken: () => defaultValues,
  },
});

export const { setAccessToken, resetAccesToken } =
  userAuthenticationSlice.actions;

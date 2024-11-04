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
    privateKey: '',
    publicKey: '',
    refreshToken: '',
  },
  loading: false,
  error: null,
};

const ipadInitialState: TUserAuthentication = {
  data: {
    accessToken: getValueFromCookies('ipadAccessToken') || '',
    privateKey: getValueFromCookies('ipadPrivateKey') || '',
    publicKey: getValueFromCookies('ipadPublicKey') || '',
    refreshToken: getValueFromCookies('refreshToken') || '',
  },
  loading: false,
  error: null,
};

export const ipaduserAuthenticationSlice = createSlice({
  name: 'userAccessTokenIpad',
  initialState: ipadInitialState,
  reducers: {
    userAccessTokenIpad: (
      state,
      action: PayloadAction<TAccessTokenDetails | null>,
    ) => {
      state.data = action?.payload;
      state.loading = false;
    },
    ipadResetAccesToken: () => defaultValues,
  },
});

export const { userAccessTokenIpad, ipadResetAccesToken } =
  ipaduserAuthenticationSlice.actions;

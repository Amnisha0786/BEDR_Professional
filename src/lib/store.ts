import { configureStore } from '@reduxjs/toolkit';
import { resetUser, userProfileSlice } from './userProfile/userProfileSlice';
import {
  optometristPracticeSlice,
  resetPractice,
} from './optometristPractice/optometristPracticeSlice';
import {
  resetAccesToken,
  setAccessToken,
  userAuthenticationSlice,
} from './userAuthentication/userAuthenticationSlice';
import {
  ipadResetAccesToken,
  userAccessTokenIpad,
  ipaduserAuthenticationSlice,
} from './userAuthentication/userIpadAuthenticationSlice';
import {
  fetchOnlineUsers,
  onlineUsersSlice,
} from './getOnlineUsers/getOnlineUsersSlice';
import { userMessageStatusSlice } from './messageStatus/messageStatusSlice';
import { chatUsersSlice } from './chatUsers/chatUsersSlice';
import { userPageUrl } from './userPageUrl/userPageUrlSlice';
import { clinicRulesSlice } from './clinicRules/clinicRulesSlice';
import { socketConfigureSlice } from './socketConfigure/socketConfigureSlice';
import { userFromTodaysClinicSlice } from './usersFromTodaysClinic/usersFromTodaysClinicSlice';
import { fileStatusTrackerListSlice } from './fileStausTracketList/fileStatustTrackerListSlice';
import { updateReduxStateSlice } from './updateReduxState/updateReduxStateSlice';

export const store = configureStore({
  reducer: {
    [userProfileSlice.name]: userProfileSlice.reducer,
    [optometristPracticeSlice.name]: optometristPracticeSlice.reducer,
    [userAuthenticationSlice.name]: userAuthenticationSlice.reducer,
    [ipaduserAuthenticationSlice.name]: ipaduserAuthenticationSlice.reducer,
    [onlineUsersSlice.name]: onlineUsersSlice.reducer,
    [userMessageStatusSlice.name]: userMessageStatusSlice.reducer,
    [chatUsersSlice.name]: chatUsersSlice.reducer,
    [userPageUrl.name]: userPageUrl.reducer,
    [clinicRulesSlice.name]: clinicRulesSlice.reducer,
    [socketConfigureSlice.name]: socketConfigureSlice.reducer,
    [userFromTodaysClinicSlice.name]: userFromTodaysClinicSlice.reducer,
    [fileStatusTrackerListSlice.name]: fileStatusTrackerListSlice.reducer,
    [updateReduxStateSlice.name]: updateReduxStateSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the type of store
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const clearRedux = () => {
  store.dispatch(resetAccesToken());
  store.dispatch(ipadResetAccesToken());
  store.dispatch(resetUser());
  store.dispatch(resetPractice());
};

export const storeNewAccessToken = (
  token: string,
  refreshToken: string,
  role?: string,
  privateKey?: string,
  publicKey?: string,
) => {
  return store.dispatch(
    setAccessToken({
      accessToken: token,
      role,
      privateKey,
      publicKey,
      refreshToken,
    }),
  );
};

export const storeNewIpadAccessToken = (
  token: string,
  refreshToken: string,
  role?: string,
  privateKey?: string,
  publicKey?: string,
) => {
  return store.dispatch(
    userAccessTokenIpad({
      accessToken: token,
      role,
      privateKey,
      publicKey,
      refreshToken,
    }),
  );
};

export const updateOnlineUsers = (payload: string[]) => {
  store.dispatch(fetchOnlineUsers(payload));
};

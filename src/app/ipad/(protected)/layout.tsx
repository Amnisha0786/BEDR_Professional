'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import Header from '@/components/common-layout/header';
import { useAppDispatch } from '@/lib/hooks';
import { userProfile } from '@/lib/userProfile/userProfileSlice';
import Loader from '@/components/custom-loader';
import {
  getErrorMessage,
  getSocketConfig,
  onConnect,
  onConnectionError,
  onDisconnect,
  onError,
} from '@/lib/utils';
import { getUserProfile } from '@/app/api/settings';
import useIpadAccessToken from '@/hooks/useIpadAccessToken';
import useSocket from '@/hooks/useSocket';
import { setSocketConfig } from '@/lib/socketConfigure/socketConfigureSlice';
import { clearDataOnLogout } from '@/lib/common/clear-data-on-logout';
import { logOutUser } from '@/app/api';
import { getValueFromCookies } from '@/lib/common/manage-cookies';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [inited, setInited] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const socketIo = useSocket();
  const API_BASE_URL = getSocketConfig();
  const router = useRouter();

  const socket = useMemo(() => {
    if (socketIo) {
      return socketIo;
    }
  }, [socketIo]);

  const userIpadAccessToken = useIpadAccessToken();
  const refreshToken = useMemo(() => {
    return userIpadAccessToken?.refreshToken || getValueFromCookies('ipadRefreshToken')
  }, [userIpadAccessToken?.refreshToken]);

  const isIpadAuthenticated = useMemo(() => {
    if (userIpadAccessToken?.accessToken) {
      return userIpadAccessToken?.accessToken;
    }
  }, [userIpadAccessToken?.accessToken]);

  const handleLogout = useCallback(
    async (sessionExpired?: boolean) => {
      try {
        if (!refreshToken) {
          return;
        }
        const response = await logOutUser(refreshToken);
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        }
        if (sessionExpired) {
          toast.success(t('translation.logoutDueToInactivity'));
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        clearDataOnLogout(true);
        if (socket?.connected) {
          socket.disconnect();
        }
        router.push('/login');
      }
    },
    [socket],
  );

  useEffect(() => {
    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      const inactivityTime = currentTime - lastActivity;
      const logoutTimeout = 30 * 60 * 1000;
      if (inactivityTime > logoutTimeout) {
        handleLogout(true);
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    const intervalId = setInterval(checkInactivity, 5 * 1000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(intervalId);
    };
  }, [lastActivity]);

  const fetchUserDetails = useCallback(async () => {
    try {
      const fetchUserData = await getUserProfile();
      dispatch(userProfile(fetchUserData?.data));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
      handleLogout();
    } finally {
      setInited(true);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (refreshToken?.trim()?.length && API_BASE_URL) {
      dispatch(
        setSocketConfig(
          io(API_BASE_URL as string, {
            auth: {
              token: refreshToken,
            },
            secure: true,
            transports: ['polling', 'websocket', 'webtransport'],
          }),
        ),
      );
    }
  }, [refreshToken, API_BASE_URL]);

  useEffect(() => {
    if (!isIpadAuthenticated?.trim()?.length) {
      return;
    }
    fetchUserDetails();
  }, [isIpadAuthenticated]);

  useEffect(() => {
    if (socket) {
      if (socket?.connected) {
        onConnect();
      }
      socket.on('connect_error', onConnectionError);
      socket.on('error', onError);
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
    }
  }, [socket]);

  if (!isIpadAuthenticated?.trim()?.length) {
    return <Loader />;
  }

  return (
    inited && (
      <div className='!mt-[80px] flex overflow-y-auto ms:h-[calc(100vh-80px)]'>
        <Header isIpadView={true} />
        <div className='flex h-[calc(100vh-80px)] w-full overflow-hidden overflow-y-auto'>
          <main className=' thin-scroll h-full w-full flex-1 overflow-y-auto overflow-x-hidden bg-layoutBg ms:pb-[100px]'>
            <div className='mx-auto max-w-[1050px]'>{children}</div>
          </main>
        </div>
      </div>
    )
  );
};

export default Layout;

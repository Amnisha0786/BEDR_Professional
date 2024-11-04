'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import camelcaseKeys from 'camelcase-keys';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import Header from '@/components/common-layout/header';
import Sidebar from '@/components/common-layout/sidebar';
import { useAppDispatch } from '@/lib/hooks';
import { getUserProfile } from '../api/settings';
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
import ReadOnlyService from '@/components/common-layout/readonly-service';
import { LOGINS } from '@/enums/auth';
import { getValueFromCookies } from '@/lib/common/manage-cookies';
import { optometristPractice } from '@/lib/optometristPractice/optometristPracticeSlice';
import useAccessToken from '@/hooks/useAccessToken';
import useUserProfile from '@/hooks/useUserProfile';
import { updateOnlineUsers } from '@/lib/store';
import { decryptData, encryptData } from '@/lib/common/secure-request';
import DoctorReaderReadOnlyText from '@/components/common-layout/doctor-reader-readonly-service';
import { setAcceptedClinicRules } from '@/lib/clinicRules/clinicRulesSlice';
import useAcceptedClinicRules from '@/hooks/useAcceptedClinicRules';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import { logOutUser } from '../api';
import useSocket from '@/hooks/useSocket';
import { clearDataOnLogout } from '@/lib/common/clear-data-on-logout';
import { setSocketConfig } from '@/lib/socketConfigure/socketConfigureSlice';
import { getFileStatusTrackerList } from '../api/file-status-tracker';
import { setFileStatusTracker } from '@/lib/fileStausTracketList/fileStatustTrackerListSlice';
import { getChatUsers } from '@/lib/chatUsers/chatUsersSlice';
import { TChatUsers } from '@/models/types/messages';
import useChatUsers from '@/hooks/useChatUsers';
import { getAllUsers } from '../api/messages';
import { setRefreshData } from '@/lib/updateReduxState/updateReduxStateSlice';

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [lastActivity, setLastActivity] = useState(Date.now());

  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const userAccessToken = useAccessToken();
  const user = useUserProfile();
  const allChatUsers = useChatUsers();
  const clinicRules = useAcceptedClinicRules();
  const router = useRouter();
  const socketIo = useSocket();
  const API_BASE_URL = getSocketConfig();
  const { t } = useTranslation();

  const socket = useMemo(() => {
    if (socketIo) {
      return socketIo;
    }
  }, [socketIo]);

  const isAuthenticated = useMemo(() => {
    if (userAccessToken?.accessToken) {
      return userAccessToken?.accessToken;
    }
  }, [userAccessToken?.accessToken]);

  const refreshToken = useMemo(() => {
    if (userAccessToken?.refreshToken) {
      return userAccessToken?.refreshToken;
    }
  }, [userAccessToken?.refreshToken]);

  const userRole = useMemo(() => {
    if (userAccessToken?.role) {
      return userAccessToken?.role;
    }
  }, [userAccessToken?.role]);

  const practiceName = useMemo(() => {
    return getValueFromCookies('practiceName');
  }, []);

  const practiceId = useMemo(() => {
    return getValueFromCookies('practiceId');
  }, []);

  const handleLogout = useCallback(
    async (sessionExpired?: boolean) => {
      const refreshToken = getValueFromCookies('refreshToken');
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
        clearDataOnLogout();
        if (socket?.connected) {
          socket.disconnect();
        }
        router.push('/login');
      }
    },
    [socket],
  );

  // useEffect(() => {
  //   const handleUserActivity = () => {
  //     setLastActivity(Date.now());
  //   };

  //   const checkInactivity = () => {
  //     const currentTime = Date.now();
  //     const inactivityTime = currentTime - lastActivity;
  //     const logoutTimeout = 30 * 60 * 1000;
  //     if (inactivityTime > logoutTimeout) {
  //       handleLogout(true);
  //     }
  //   };

  //   window.addEventListener('mousemove', handleUserActivity);
  //   window.addEventListener('click', handleUserActivity);
  //   window.addEventListener('keydown', handleUserActivity);

  //   const intervalId = setInterval(checkInactivity, 5 * 1000);

  //   return () => {
  //     window.removeEventListener('mousemove', handleUserActivity);
  //     window.removeEventListener('click', handleUserActivity);
  //     window.removeEventListener('keydown', handleUserActivity);
  //     clearInterval(intervalId);
  //   };
  // }, [lastActivity]);

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

  const fetchUserDetails = useCallback(async () => {
    try {
      const fetchUserData = await getUserProfile();
      dispatch(userProfile(fetchUserData?.data));
      dispatch(
        setAcceptedClinicRules(
          fetchUserData?.data?.data?.clinicTermsAndConditions || 0,
        ),
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
      handleLogout();
    }
  }, [userRole, handleLogout]);

  const fetchFileTracker = useCallback(async () => {
    if (!practiceId) {
      return;
    }
    try {
      const response = await getFileStatusTrackerList({
        practiceId,
        offset: 100,
        page: 1,
      });
      dispatch(setFileStatusTracker(response?.data?.data));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, [practiceId]);

  const updateOptometristPractice = useCallback(() => {
    if (practiceId && practiceName) {
      dispatch(
        optometristPractice({
          practiceId,
          practiceName,
        }),
      );
    }
  }, [practiceId, practiceName]);

  useEffect(() => {
    updateOptometristPractice();
  }, [updateOptometristPractice]);

  useEffect(() => {
    if (userRole === LOGINS.OPTOMETRIST && practiceId) {
      fetchFileTracker();
    }
  }, [userRole, practiceId]);

  useEffect(() => {
    const handleSocketEvent = () => {
      fetchFileTracker();
      dispatch(
        setRefreshData({
          isRefreshFileStatusTracker: true,
          isRefreshPractice: true,
          isRefreshTodaysClinic: true,
          isRefreshPatientFiles: true,
          isRefreshCompletedFiles: true,
        }),
      );
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.FILE_SUBMITTED_BY_OPTOMETRIST, handleSocketEvent);
      socket.on(SOCKET_EVENTS.FILE_SUBMITTED_BY_DOCTOR, handleSocketEvent);
      socket.on(SOCKET_EVENTS.FILE_SUBMITTED_BY_READER, handleSocketEvent);
      socket.on(SOCKET_EVENTS.FILE_REJECTED_BY_PROFESSIONAL, handleSocketEvent);
      return () => {
        socket.off(
          SOCKET_EVENTS.FILE_SUBMITTED_BY_OPTOMETRIST,
          handleSocketEvent,
        );
        socket.off(
          SOCKET_EVENTS.FILE_PICKED_BY_PROFESSIONAL,
          handleSocketEvent,
        );
        socket.off(
          SOCKET_EVENTS.FILE_REJECTED_BY_PROFESSIONAL,
          handleSocketEvent,
        );
        socket.off(
          SOCKET_EVENTS.FILE_SUBMITTED_BY_OPTOMETRIST,
          handleSocketEvent,
        );
      };
    }
  }, [socket, fetchFileTracker, user]);

  useEffect(() => {
    if (!isAuthenticated?.trim()?.length) {
      return;
    }
    fetchUserDetails();
  }, [isAuthenticated]);

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

  const fetchChatUsers = useCallback(async () => {
    try {
      const response = await getAllUsers();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      dispatch(getChatUsers(responseData));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, []);

  useEffect(() => {
    if (userRole === LOGINS.DOCTOR || userRole === LOGINS.READER) {
      fetchChatUsers();
    }
  }, [fetchChatUsers, userRole]);

  useEffect(() => {
    socket &&
      socket.on(SOCKET_EVENTS.GET_ONLINE_USERS, (response) => {
        if (!response?.data || !user?.chatDecryptionKey) {
          return;
        }
        const decrypted = decryptData({
          data: camelcaseKeys(response?.data),
          privateKey: user?.chatDecryptionKey,
          message: response?.message,
          status: response?.status,
        });
        updateOnlineUsers(decrypted?.data);
      });
  }, [user, socket, userRole]);

  useEffect(() => {
    const refreshUserDetails = () => {
      fetchUserDetails();
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.NOTIFICATION_LIST, refreshUserDetails);

      return () => {
        socket.off(SOCKET_EVENTS.NOTIFICATION_LIST, refreshUserDetails);
      };
    }
  }, [socket, user, fetchUserDetails]);

  const isBlockDoctorReader = useMemo(() => {
    if (userRole === LOGINS.DOCTOR || userRole === LOGINS.READER) {
      return clinicRules <= 0;
    }
  }, [userRole, user, clinicRules]);

  const renderContent = () => {
    if (
      userRole === LOGINS.OPTOMETRIST &&
      !practiceId &&
      pathname !== '/settings' &&
      pathname !== '/notifications'
    ) {
      return (
        <div className='px-[30px] py-[30px] md:px-[43px]'>
          <ReadOnlyService />
        </div>
      );
    } else if (
      isBlockDoctorReader &&
      (userRole === LOGINS.DOCTOR || userRole === LOGINS.READER) &&
      pathname !== '/planner' &&
      pathname !== '/settings' &&
      pathname !== '/notifications'
    ) {
      return (
        <div className='px-5 py-[30px] md:px-[43px]'>
          <DoctorReaderReadOnlyText />
        </div>
      );
    }
    return children;
  };

  useEffect(() => {
    if (
      socket?.connected &&
      (userRole === LOGINS.DOCTOR || userRole === LOGINS.READER) &&
      !pathname?.includes('/chat-messages')
    ) {
      socket.on(
        SOCKET_EVENTS.ON_RECIEVE_NEW_MESSAGE,
        (response: any, ack: any) => {
          if (!user?.chatEncryptionKey || !user?.chatDecryptionKey) {
            return;
          }
          const decrypted = decryptData({
            data: response?.data,
            privateKey: user?.chatDecryptionKey,
            message: response?.message,
            status: response?.status,
          });
          const responseData = camelcaseKeys(decrypted?.data, { deep: true });
          const newMessage = {
            ...responseData?.message,
            sender: responseData?.message?.senderId,
            receiver: responseData?.message?.receiverId,
          };

          const updatedChatUsers = allChatUsers?.map((chatUser) => {
            const unread = chatUser?.unreadMessages || 0;
            if (chatUser?.id === responseData?.message?.chatId) {
              return {
                ...chatUser,
                lastMessage: {
                  ...newMessage,
                },
                unreadMessages: !newMessage?.readAt ? unread + 1 : unread,
              };
            }
            return chatUser;
          });

          dispatch(getChatUsers(updatedChatUsers as TChatUsers[]));
          toast.success(
            t('translation.messageFrom', {
              name: `${responseData?.sender?.firstName || 'user'} ${responseData?.sender?.lastName || ''}`,
            }),
          );
          const encyptedData = encryptData({
            data: {
              in_same_chat: false,
            },
            publicKey: user?.chatEncryptionKey,
          });
          ack(encyptedData);
        },
      );
      return () => {
        socket.off(SOCKET_EVENTS.ON_RECIEVE_NEW_MESSAGE);
      };
    }
  }, [socket, userRole, user, pathname, allChatUsers]);

  useEffect(() => {
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.CHAT_REFRESH, () => {
        fetchChatUsers();
      });

      return () => {
        socket.off(SOCKET_EVENTS.CHAT_REFRESH);
      };
    }
  }, [user, socket, fetchChatUsers]);

  if (!isAuthenticated?.trim()?.length || !userRole) {
    return <Loader />;
  }

  return (
    <div className='!mt-[80px] flex overflow-y-auto ms:h-[calc(100vh-80px)]'>
      <Header />
      <div className='flex h-[calc(100vh-80px)] w-full overflow-hidden overflow-y-auto'>
        <Sidebar />
        <main className='thin-scroll h-full w-full flex-1 overflow-y-auto overflow-x-hidden bg-layoutBg '>
          <div className='mr-auto max-w-[1300px]'>{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

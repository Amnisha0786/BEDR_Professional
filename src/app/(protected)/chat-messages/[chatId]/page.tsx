'use client';

import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import camelcaseKeys from 'camelcase-keys';
import { FieldPath, useForm } from 'react-hook-form';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import Icon from '@/components/custom-components/custom-icon';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import UsersGroupList from '@/components/chat-messages/users-group-list';
import UserChat from '@/components/chat-messages/user-chat';
import UserProfile from '@/components/chat-messages/user-profile';
import {
  clearUserChat,
  getAllDoctorAndReaders,
  getAllUsers,
  getUserChatId,
  getUserChatMessages,
} from '@/app/api/messages';
import { cn, getErrorMessage } from '@/lib/utils';
import useUserProfile from '@/hooks/useUserProfile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TAllReaderDoctor,
  TChatUsers,
  TCurrentUser,
  TMessage,
  TSendMessage,
  TUserChat,
  TUsers,
} from '@/models/types/messages';
import useOnlineUsers from '@/hooks/useOnlineUsers';
import { debounce } from '@/lib/common/debounce';
import { AlertDialog } from '@/components/ui/alert-dialog';
import CustomAlertBox from '@/components/custom-components/custom-alert-box';
import useChatUsers from '@/hooks/useChatUsers';
import { useAppDispatch } from '@/lib/hooks';
import { getChatUsers } from '@/lib/chatUsers/chatUsersSlice';
import useUserMessageStatus from '@/hooks/useUserMessageStatus';
import { MESSAGE_CONTENT_TYPE, MESSAGE_STATUS } from '@/enums/chat';
import Loader from '@/components/custom-loader';
import { decryptData, encryptData } from '@/lib/common/secure-request';
import useSocket from '@/hooks/useSocket';
import useTodayClinicUser from '@/hooks/useTodayClinicUser';
import {
  resetIsUserFromClinic,
  setIsUserFromClinic,
} from '@/lib/usersFromTodaysClinic/usersFromTodaysClinicSlice';
import { Button } from '@/components/ui/button';
import { sendMessageTodayTeam } from '@/app/api/todays-clinics';
import { openUploadDialog } from '@/lib/common/openUploadDialog';
import { uploadFile } from '@/app/api/create-patient-request';
import { Form } from '@/components/ui/form';
import { TypographyP } from '@/components/ui/typography/p';
import { getImageUrl } from '@/lib/common/getImageUrl';
import { Separator } from '@/components/ui/separator';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';

const defaultValues = {
  contentType: MESSAGE_CONTENT_TYPE.TEXT,
};

const ChatMessages = () => {
  const form = useForm<TSendMessage>({
    defaultValues,
    mode: 'onSubmit',
  });

  const [loading, setLoading] = useState(false);
  const [allDoctorsLoading, setAllDoctorsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [fetchingUserChat, setFetchingUserChat] = useState(false);
  const [openClearChatPopup, setOpenClearChatPopup] = useState(false);
  const [allDoctorReaders, setAllDoctorReaders] = useState<TAllReaderDoctor>();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState(false);
  const [userChatMessages, setUserChatMessages] = useState<TUserChat>();
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [activeTab, setActiveTab] = useState<number>(2);

  const { t } = useTranslation();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const params = useParams();
  const user = useUserProfile();
  const onlineUsers = useOnlineUsers();
  const screenWidth = useMemo(() => window.innerWidth, []);
  const allChatUsers = useChatUsers();
  const dispatch = useAppDispatch();
  const userMessageStatus = useUserMessageStatus();
  const socket = useSocket();
  const userRoute = useTodayClinicUser();
  const router = useRouter();

  const inited = useRef(false);

  const showAll = useMemo(
    () => (screenWidth > 1200 ? true : false),
    [screenWidth],
  );

  const fetchChatUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data || [];
      const newArray = [...[...(allChatUsers || []), ...responseData]]?.reduce(
        (acc, current) => {
          const user = acc?.find(
            (item: TChatUsers) => item?.id === current?.id,
          );
          if (!user) {
            acc.push(current);
          }
          return acc;
        },
        [],
      );
      dispatch(getChatUsers(newArray));
      dispatch(resetIsUserFromClinic());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
      inited.current = true;
    }
  }, []);

  const fetchChatUsersWithUnreadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data || [];
      dispatch(getChatUsers(responseData));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
      inited.current = true;
    }
  }, []);

  useEffect(() => {
    if (!inited.current && (!allChatUsers?.length || userRoute?.isFromClinic)) {
      fetchChatUsers();
    }
  }, [allChatUsers, userRoute]);

  const fetchAllDoctorReader = useCallback(async (value: string) => {
    if (!value?.trim()?.length) {
      return setAllDoctorReaders(undefined);
    }
    setAllDoctorsLoading(true);
    try {
      const response = await getAllDoctorAndReaders({
        search_query: value,
      });

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setAllDoctorReaders(
        responseData?.doctorsAndReaders ?? responseData?.doctorsAndReaders,
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setAllDoctorsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allChatUsers?.length) {
      const isChatExist = allChatUsers?.find(
        (item) => item?.id === params?.chatId,
      );
      if (!isChatExist) {
        router.push(`/chat-messages/${allChatUsers[0]?.id}`);
      }
    }
  }, [allChatUsers, params]);

  useEffect(() => {
    const updatedChatUsers = allChatUsers?.map((chatUser) => {
      if (chatUser?.id === params?.chatId) {
        return {
          ...chatUser,
          unreadMessages: 0,
        };
      }
      return chatUser;
    });
    dispatch(getChatUsers(updatedChatUsers as TChatUsers[]));
  }, [params]);

  const fetchUserMessages = useCallback(
    async (hideLoading = false) => {
      if (!hideLoading) {
        setMessagesLoading(true);
      }
      try {
        if (!params?.chatId) {
          return;
        }
        const response = await getUserChatMessages({
          chatId: params?.chatId as string,
        });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        const responseData = response?.data?.data;
        const giftedChatMessages = responseData?.messages?.map(
          (msg: TMessage) => msg,
        );
        setMessages(
          giftedChatMessages?.sort((a: TMessage, b: TMessage) => {
            return (
              new Date(a?.createdAt).valueOf() -
              new Date(b?.createdAt).valueOf()
            );
          }),
        );
        setUserChatMessages(responseData);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setMessagesLoading(false);
      }
    },
    [params],
  );

  useEffect(() => {
    fetchUserMessages();
  }, [fetchUserMessages]);

  const clearChat = useCallback(async () => {
    setFetchingUserChat(true);
    try {
      if (!params?.chatId) {
        return;
      }

      const response = await clearUserChat({
        chatId: params?.chatId as string,
      });

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const updatedChatUsers = allChatUsers?.map((chatUser) => {
        if (chatUser?.id === params?.chatId) {
          return {
            ...chatUser,
            lastMessage: null,
            unreadMessages: 0,
            messages: [],
          };
        }
        return chatUser;
      });

      dispatch(getChatUsers(updatedChatUsers as TChatUsers[]));
      toast.success(t('translation.chatCleared'));
      fetchUserMessages();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setFetchingUserChat(false);
      setOpenClearChatPopup(false);
    }
  }, [params, allChatUsers]);

  const filteredUserList = useMemo(() => {
    return allChatUsers?.map((obj) => ({
      ...obj,
      users: obj?.users
        .filter((item) => item?.id !== user?.id)
        .map((item) => ({
          ...item,
          userActivity:
            Array.isArray(onlineUsers) &&
            (onlineUsers || [])?.includes(item?.id)
              ? true
              : false,
        })),
    }));
  }, [allChatUsers, user, onlineUsers]);

  const currentUserDetails: TCurrentUser = useMemo(() => {
    let sender, receiver;
    const userDetails = allChatUsers?.filter(
      (item) => item?.id === userChatMessages?.id,
    );

    userDetails?.[0]?.users?.map((item) => {
      if (item?.id === user?.id) {
        sender = {
          ...item,
          userActivity:
            Array.isArray(onlineUsers) &&
            (onlineUsers || [])?.includes(item?.id)
              ? true
              : false,
        };
      } else {
        receiver = {
          ...item,
          userActivity:
            Array.isArray(onlineUsers) &&
            (onlineUsers || [])?.includes(item?.id)
              ? true
              : false,
        };
      }
    });

    return {
      ...userChatMessages,
      senderDetails: sender,
      receiverDetails: receiver,
    } as TCurrentUser;
  }, [filteredUserList, userChatMessages, onlineUsers]);

  const handleSearchChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      fetchAllDoctorReader(value || '');
    },
    200,
  );

  const confirmClearChat = () => setOpenClearChatPopup(true);

  const filteredMessages = useMemo(() => {
    const updatedMessages = messages?.map((message) => {
      const deliveredMessage = userMessageStatus?.find(
        (item) => item?.id === message?.id,
      );
      if (deliveredMessage) {
        return {
          ...message,
          messageStatus:
            deliveredMessage?.messageStatus ||
            message?.messageStatus ||
            MESSAGE_STATUS.SENT,
        };
      }
      return message;
    });
    return [...(updatedMessages || [])];
  }, [userMessageStatus, messages]);

  useEffect(() => {
    if (socket?.connected) {
      socket.on(
        SOCKET_EVENTS.ON_RECIEVE_NEW_MESSAGE,
        (response: any, ack: any) => {
          try {
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
            if (
              responseData?.message?.senderId ===
              currentUserDetails?.receiverDetails?.id
            ) {
              setMessages((prev) => [...prev, newMessage]);
            }

            const updatedChatUsers = allChatUsers?.map((chatUser) => {
              const unread = chatUser?.unreadMessages || 0;
              if (chatUser?.id === responseData?.message?.chatId) {
                return {
                  ...chatUser,
                  lastMessage: {
                    ...newMessage,
                  },
                  unreadMessages:
                    responseData?.message?.chatId !== params?.chatId &&
                    !newMessage?.readAt
                      ? unread + 1
                      : unread,
                };
              }
              return chatUser;
            });

            dispatch(getChatUsers(updatedChatUsers as TChatUsers[]));

            const encyptedData = encryptData({
              data: {
                in_same_chat: responseData?.message?.chatId === params?.chatId,
                chat_id: params?.chatId,
              },
              publicKey: user?.chatEncryptionKey,
            });

            ack(encyptedData);
          } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage || t('translation.somethingWentWrong'));
          }
        },
      );

      return () => {
        socket.off(SOCKET_EVENTS.ON_RECIEVE_NEW_MESSAGE);
      };
    }
  }, [user, currentUserDetails, params, socket, allChatUsers]);

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setShowPicker(false);
    const textarea = inputRef.current;
    const { emoji } = emojiObject;
    if (textarea) {
      const cursorPosition = textarea.selectionStart || 0;
      const value = form?.watch('content') || '';
      const textBeforeCursor = value.substring(0, cursorPosition);
      const textAfterCursor = value.substring(cursorPosition);
      const newValue = textBeforeCursor + emoji + textAfterCursor;
      form?.setValue('content', newValue);
      const newCursorPosition = cursorPosition + emoji.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }
  };

  const handleFileSelect = async (type: string, accept: string) => {
    const files = await openUploadDialog(type, accept);
    handleFileUpload(files?.[0], type);
  };

  const handleFileUpload = useCallback(
    async (file: File | null, type: string) => {
      if (!file) {
        form.setValue('content', '');
        form.setValue('contentType', MESSAGE_CONTENT_TYPE.TEXT);
        return;
      }
      try {
        setSendingMessage(true);
        const response = await uploadFile(file as File);
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          try {
            setSendingMessage(false);
            const responseData = response?.data?.data?.original;
            onSubmit({
              content: responseData?.key,
              contentType: type as MESSAGE_CONTENT_TYPE,
            } as TSendMessage);
          } finally {
            setSendingMessage(false);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setSendingMessage(false);
      }
    },
    [],
  );

  const handleSubmitFunction = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (form?.watch('content')) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleChangeValue = useCallback(
    (name: FieldPath<TSendMessage>, value: string) =>
      form.setValue(name, value),
    [],
  );

  const onSubmit = useCallback(
    async (values: TSendMessage) => {
      try {
        setSendingMessage(true);
        const response = await sendMessageTodayTeam({
          contentType: values?.contentType,
          content: values?.content,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          toast.success(t('translation.messageSentSuccess'));
          fetchChatUsersWithUnreadMessages();
          fetchUserMessages();
          setOpen(false);
          form?.setValue('content', '');
          inputRef.current?.focus();
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
        setSendingMessage(false);
      } finally {
        setSendingMessage(false);
      }
    },
    [fetchChatUsersWithUnreadMessages, fetchUserMessages, allChatUsers],
  );

  const getChatId = useCallback(
    async (userId?: string) => {
      if (!userId) {
        return;
      }
      setLoading(true);
      try {
        const response = await getUserChatId({ userId: userId });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }

        const chatUser = allDoctorReaders?.find((item) => item?.id === userId);
        const loggedInUser = {
          firstName: user?.firstName || '',
          id: user?.id || '',
          lastName: user?.lastName || '',
          profilePicture: user?.profilePicture || '',
          email: user?.email || '',
          callingCode: user?.callingCode || '',
          mobileNumber: user?.mobileNumber || '',
          role: user?.role || '',
        };
        router.push(`/chat-messages/${response?.data?.data?.chatId}`);

        dispatch(setIsUserFromClinic(true));

        if (chatUser) {
          const userData = {
            id: response?.data?.data?.chatId,
            createdAt: new Date().toISOString(),
            unreadMessages: 0,
            messages: [],
            updatedAt: new Date().toISOString(),
            users: [loggedInUser, chatUser] as TUsers[],
          };
          const newUsers = [...(allChatUsers || [])];
          newUsers?.push(userData);
          const filteredArr = newUsers?.reduce((acc, current) => {
            const x = acc?.find((item: TChatUsers) => item?.id === current?.id);
            if (!x) {
              return acc?.concat([current] as any);
            } else {
              return acc;
            }
          }, []);
          dispatch(getChatUsers(filteredArr));
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setLoading(false);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      }
    },
    [allDoctorReaders, allChatUsers],
  );

  return (
    <>
      <Head>
        <title>{t('translation.chatPageHead')}</title>
      </Head>
      <div className='max-ms: !overflow-hidden px-[16px] py-[24px] ms:px-[20px] md:px-[20px] '>
        <Card className='w-full p-3'>
          <FlexBox classname='flex justify-between items-center'>
            <FlexBox classname='!flex'>
              <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Icon
                  name='communication-preferances'
                  width={18}
                  height={18}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>{t('translation.messages')}</TypographyH2>
            </FlexBox>
            <Button className='text-[16px]' onClick={() => setOpen(true)}>
              Message everyone
            </Button>
          </FlexBox>
        </Card>
        <FlexBox flex classname='gap-5 mt-5 '>
          {(activeTab === 1 || showAll) && (
            <Card
              className={`${!showAll ? 'flex-1 !px-[30px]' : 'w-[30%] !p-0'} h-[72vh] `}
            >
              <CardContent className='!my-4 h-full overflow-y-scroll !px-0'>
                <div className='md:px-4'>
                  <div className='relative flex-1 md:flex-none'>
                    <Input
                      label={''}
                      placeholder={t('translation.searchHerePlaceholder')}
                      onChange={(event) => handleSearchChange(event)}
                      className='min-h-[36px] !rounded-[6px] !border-lightGray bg-transparent py-[0.4rem] ps-[1.8rem] !text-[12px] ring-transparent placeholder:font-normal focus:bg-lightPrimary'
                    />
                    <span className='absolute left-[9px] top-[9px]'>
                      <Icon name='search' width={16} height={16} />
                    </span>
                    {allDoctorReaders && allDoctorReaders?.length > 0 && (
                      <ul className='absolute left-0 right-0 top-10  z-40 max-h-[30vh] min-h-[50px] overflow-auto rounded border border bg-white py-2 text-darkGray shadow-lg max-ms:w-full'>
                        {allDoctorsLoading ? (
                          <div className='h-fulf flex min-h-[100px] justify-center'>
                            <Loader screen={40} size={25} />
                          </div>
                        ) : (
                          allDoctorReaders.map((chatUser, index) => {
                            const getProfilePicture =
                              getImageUrl(
                                user?.s3BucketUrl,
                                chatUser?.profilePicture,
                              ) || '../../assets/default-user.svg';
                            return (
                              <>
                                <li
                                  onClick={() => getChatId(chatUser?.id)}
                                  key={chatUser?.id}
                                  className='cursor-pointer p-2 hover:bg-lightPrimary'
                                >
                                  <div className='flex items-center space-x-4 px-4 rtl:space-x-reverse'>
                                    <div className='flex-shrink-0'>
                                      <div className='relative'>
                                        <Image
                                          className='h-[48px] w-[48px] rounded-full'
                                          src={getProfilePicture}
                                          alt='Neil image'
                                          height={48}
                                          width={48}
                                        />
                                      </div>
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                      <FlexBox flex justify='between'>
                                        <TypographyP
                                          size={16}
                                          noBottom
                                          classname='!text-darkGray truncate font-medium capitalize'
                                        >
                                          {`${chatUser?.firstName || ''} ${chatUser?.lastName || ''}`}
                                        </TypographyP>
                                      </FlexBox>
                                      <TypographyP
                                        size={12}
                                        noBottom
                                        classname='!text-gray truncate font-medium capitalize'
                                      >
                                        {chatUser?.role}
                                      </TypographyP>
                                    </div>
                                  </div>
                                </li>
                                {index != allDoctorReaders?.length - 1 && (
                                  <Separator className='mx-auto w-[90%] bg-lightGray' />
                                )}
                              </>
                            );
                          })
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                {loading ? (
                  <div className='flex h-full justify-center'>
                    <Loader screen={40} size={25} />
                  </div>
                ) : (
                  <div className='mt-4'>
                    <UsersGroupList
                      lists={filteredUserList || []}
                      user={user}
                      currentId={params?.chatId as string}
                      setActiveTab={setActiveTab}
                      messages={filteredMessages}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {(activeTab === 2 || showAll) && (
            <Card
              className={`${activeTab === 3 ? 'w-[40%]' : 'flex-1'}  h-[72vh] w-[70%] !px-0`}
            >
              <CardContent className='h-full !px-0 !py-4 '>
                <UserChat
                  loading={messagesLoading}
                  confirmClearChat={confirmClearChat}
                  currentUser={currentUserDetails}
                  chatId={params?.chatId as string}
                  setMessages={setMessages}
                  messages={filteredMessages}
                  setActiveTab={setActiveTab}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === 3 && (
            <Card
              className={`${!showAll ? 'flex-1' : 'w-[30%]'} h-[72vh] w-[30%] !px-0`}
            >
              <CardContent className='!my-4 overflow-y-scroll px-0'>
                <UserProfile
                  currentUser={currentUserDetails?.receiverDetails}
                  setActiveTab={setActiveTab}
                  showAll={showAll}
                />
              </CardContent>
            </Card>
          )}
        </FlexBox>
      </div>

      <AlertDialog open={openClearChatPopup}>
        <CustomAlertBox
          loading={fetchingUserChat}
          setOpen={setOpenClearChatPopup}
          handleConfirm={clearChat}
          title={t('translation.sureToClearChat')}
        />
      </AlertDialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:h-[80%] sm:max-w-[80%]'>
          <DialogHeader>
            <DialogTitle>{t('translation.messageToEveryone')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className='relative mt-auto flex items-end px-4 pb-0 pt-4'
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <div className='w-full rounded-[8px] border border-lightGray'>
                <div className='flex py-[3px] pr-[8px]'>
                  <textarea
                    ref={inputRef}
                    placeholder='Type a message...'
                    rows={1}
                    className={cn(
                      'w-full resize-none rounded-[8px] border-0 p-3 text-[16px] outline-none focus:outline-none',
                    )}
                    value={form?.watch('content')}
                    disabled={sendingMessage}
                    onChange={(e) => {
                      setShowPicker(false);
                      handleChangeValue('content', e.target.value);
                    }}
                    onKeyDown={handleSubmitFunction}
                  />
                  <Button
                    className='mt-[5px] min-w-7 text-white'
                    type='submit'
                    loading={sendingMessage}
                    center
                    disabled={!form?.watch('content') || sendingMessage}
                  >
                    {' '}
                    <Icon name='send-icon' />
                  </Button>
                </div>
                <FlexBox
                  flex
                  classname='bg-backgroundGray mt-0.5 pt-[10px] pb-2 rounded-[8px] gap-[10px] px-5'
                >
                  <div
                    onClick={() => setShowPicker((prev) => !prev)}
                    className='cursor-pointer'
                  >
                    <Icon name='emojis' />
                  </div>
                  <div
                    className='cursor-pointer'
                    onClick={() =>
                      handleFileSelect(
                        MESSAGE_CONTENT_TYPE.IMAGE,
                        'image/png,image/jpg,image/jpeg',
                      )
                    }
                  >
                    <Icon name='photo-upload' />
                  </div>
                  <div
                    className='cursor-pointer'
                    onClick={() =>
                      handleFileSelect(
                        MESSAGE_CONTENT_TYPE.VIDEO,
                        'video/mp4,video/x-m4v,video/*',
                      )
                    }
                  >
                    <Icon name='video-upload' />{' '}
                  </div>
                  <div
                    className='cursor-pointer'
                    onClick={() =>
                      handleFileSelect(
                        MESSAGE_CONTENT_TYPE.FILE,
                        '.xlsx, .xls, .pdf,.dcm,.DCM',
                      )
                    }
                  >
                    <Icon name='file-upload' />
                  </div>
                </FlexBox>
                {showPicker && (
                  <EmojiPicker
                    style={{
                      position: 'absolute',
                      bottom: '60px',
                      left: '20px',
                    }}
                    onEmojiClick={onEmojiClick}
                  />
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatMessages;

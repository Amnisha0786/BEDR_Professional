'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { EmojiClickData } from 'emoji-picker-react';
import { MoveLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FieldPath, useForm } from 'react-hook-form';
import decamelizeKeys from 'decamelize-keys';
import camelcaseKeys from 'camelcase-keys';
import EmojiPicker from 'emoji-picker-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import Icon from '../custom-components/custom-icon';
import { Button } from '../ui/button';
import Loader from '../custom-loader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  TChatUsers,
  TCurrentUser,
  TMessage,
  TSendMessage,
  TSocketResponse,
} from '@/models/types/messages';
import useUserProfile from '@/hooks/useUserProfile';
import { getImageUrl } from '@/lib/common/getImageUrl';
import {
  MESSAGE_CONTENT_TYPE,
  MESSAGE_STATUS,
  USER_ACTIVITY,
} from '@/enums/chat';
import { userChatMessageSchema } from '@/models/validations/chat';
import { cn, getErrorMessage } from '@/lib/utils';
import { getLastSeen } from '@/lib/common/get-last-seen';
import { openUploadDialog } from '@/lib/common/openUploadDialog';
import { uploadFile } from '@/app/api/create-patient-request';
import { COLORS } from '@/lib/constants/color';
import { decryptData, encryptData } from '@/lib/common/secure-request';
import { useAppDispatch } from '@/lib/hooks';
import { fetchStatusForMessageUsers } from '@/lib/messageStatus/messageStatusSlice';
import useChatUsers from '@/hooks/useChatUsers';
import { getChatUsers } from '@/lib/chatUsers/chatUsersSlice';
import FilePreview from '../file-preview';
import DicomView from '../dicom-preview';
import { getDicomFileToken } from '@/app/api/file-in-progress';
import useSocket from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';

type TProps = {
  loading: boolean;
  confirmClearChat: () => void;
  currentUser: TCurrentUser;
  chatId: string;
  messages: TMessage[];
  setMessages: Dispatch<SetStateAction<TMessage[]>>;
  setActiveTab?: Dispatch<SetStateAction<number>>;
};

const UserChat = ({
  loading,
  confirmClearChat = () => {},
  currentUser,
  chatId,
  setMessages = () => [],
  messages = [],
  setActiveTab = () => 2,
}: TProps) => {
  const { t } = useTranslation();
  const user = useUserProfile();
  const allChatUsers = useChatUsers();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const socket = useSocket();
  const div = useRef<HTMLDivElement | null>(null);
  const sendButtonRef = useRef<HTMLButtonElement | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [openFilePreview, setOpenFilePreview] = useState(false);
  const [flieToPreview, setFileToPreview] = useState('');
  const [previewingDicom, setPreviewingDicom] = useState<string>();

  useEffect(() => {
    if (messagesEndRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const defaultValues = {
    content: '',
    contentType: MESSAGE_CONTENT_TYPE.TEXT,
    chatId: chatId || '',
    senderId: user?.id || '',
    receiverId: currentUser?.receiverDetails?.id || '',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'instant',
      block: 'end',
    });
  };

  const form = useForm<TSendMessage>({
    resolver: yupResolver(userChatMessageSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  useEffect(() => {
    form.reset({
      content: form.getValues()?.content || '',
      contentType: MESSAGE_CONTENT_TYPE.TEXT,
      chatId: chatId || '',
      senderId: user?.id || '',
      receiverId: currentUser?.receiverDetails?.id || '',
    });
  }, [chatId, user, currentUser]);

  useEffect(() => {
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.CHAT_MARK_AS_READ, (response) => {
        if (!response?.data || !user?.chatDecryptionKey) {
          return;
        }
        const decrypted = decryptData({
          data: response?.data,
          privateKey: user?.chatDecryptionKey,
          message: response?.message,
          status: response?.status,
        });
        const responseData = camelcaseKeys(decrypted?.data);
        dispatch(fetchStatusForMessageUsers(responseData));
      });
      return () => {
        socket.off(SOCKET_EVENTS.CHAT_MARK_AS_READ);
      };
    }
  }, [user, socket]);

  useEffect(() => {
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.CHAT_MARK_AS_DELIVERED, (response) => {
        if (!response?.data || !user?.chatDecryptionKey) {
          return;
        }
        const decrypted = decryptData({
          data: camelcaseKeys(response?.data),
          privateKey: user?.chatDecryptionKey,
          message: response?.message,
          status: response?.status,
        });
        const responseData = camelcaseKeys(decrypted?.data);
        dispatch(fetchStatusForMessageUsers(responseData));
      });
      return () => {
        socket.off(SOCKET_EVENTS.CHAT_MARK_AS_DELIVERED);
      };
    }
  }, [user, socket]);

  const onSubmit = useCallback(
    async (values: TSendMessage) => {
      if (!user?.chatEncryptionKey || !user?.chatDecryptionKey) {
        return;
      }

      sendButtonRef.current?.setAttribute('disabled', 'disabled');

      const encrypted = encryptData({
        data: decamelizeKeys(values),
        publicKey: user?.chatEncryptionKey,
      });

      socket &&
        socket.emit(
          SOCKET_EVENTS.SEND_NEW_MESSAGE,
          encrypted,
          async (response: TSocketResponse) => {
            try {
              setSendingMessage(true);
              const decrypted = decryptData({
                data: response?.data,
                privateKey: user?.chatDecryptionKey,
                message: response?.message,
                status: response?.status,
              });
              const responseData = camelcaseKeys(decrypted?.data);

              const newMessage = {
                ...values,
                sender: values?.senderId,
                receiver: values?.receiverId,
                createdAt: new Date(),
                id: responseData?.messageId,
              };

              setMessages(
                (previousMessages) =>
                  [...previousMessages, newMessage] as TMessage[],
              );

              const updatedChatUsers = allChatUsers?.map((chatUser) => {
                if (chatUser?.id === chatId) {
                  return {
                    ...chatUser,
                    lastMessage: {
                      ...newMessage,
                    },
                  };
                }
                return chatUser;
              });

              dispatch(getChatUsers(updatedChatUsers as TChatUsers[]));

              form?.reset({ content: '' });
              inputRef.current?.focus();
            } catch (error) {
              const errorMessage = getErrorMessage(error);
              toast.error(errorMessage || t('translation.somethingWentWrong'));
            } finally {
              setSendingMessage(false);
              sendButtonRef.current?.removeAttribute('disabled');
            }
          },
        );
    },
    [user, allChatUsers, socket],
  );

  const handleSubmitFunction = (e: any) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      if (form?.watch('content')) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };

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

  const getReceiverProfileUrl = useMemo(
    () =>
      getImageUrl(
        user?.s3BucketUrl,
        currentUser?.receiverDetails?.profilePicture,
      ) || '../../assets/default-user.svg',
    [user, currentUser],
  );

  const generateDicomFileToken = useCallback(
    async (dicomKey: string) => {
      const newWindow = window.open('', '_blank');
      if (!dicomKey) {
        return;
      }
      setPreviewingDicom(dicomKey);
      try {
        const response = await getDicomFileToken({ dicomFileKey: dicomKey });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        const dicomToken = response?.data?.data?.dicomFileToken;
        if (newWindow) {
          newWindow.location.href = `${user?.dicomViewerDomain}?token=${dicomToken}`;
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setPreviewingDicom(undefined);
      }
    },
    [user],
  );

  const renderMessage = (message: TMessage, getUrl?: string) => {
    if (message?.contentType === MESSAGE_CONTENT_TYPE.IMAGE && getUrl) {
      return (
        <>
          <Image
            src={getUrl}
            width={300}
            height={300}
            alt='image'
            className='h-[300px] max-w-[300px] cursor-pointer object-cover'
            onClick={() => {
              setOpenFilePreview(true);
              setFileToPreview(getUrl);
            }}
          />
        </>
      );
    } else if (message?.contentType === MESSAGE_CONTENT_TYPE.VIDEO && getUrl) {
      return (
        <video
          controls
          className='max-h-[300px] w-[300px] bg-white'
          aria-label='Video player'
          onClick={(e) => e.preventDefault()}
          autoPlay={false}
        >
          <source src={getUrl} type='video/mp4' className='h-full w-full' />
        </video>
      );
    } else if (message?.contentType === MESSAGE_CONTENT_TYPE.FILE && getUrl) {
      if (getUrl?.toLowerCase()?.includes('.dcm')) {
        return (
          <FlexBox flex centerContent classname='gap-.5 items-start'>
            <div className='mt-[3px]'>
              <Icon
                name='attachment'
                color='transparent'
                width={20}
                height={20}
              />
            </div>
            <DicomView
              onSuccess={() => generateDicomFileToken(message?.content)}
              loading={message?.content === previewingDicom}
            >
              <TypographyP
                noBottom
                size={16}
                classname='font-normal cursor-pointer underline'
              >
                {message?.content?.includes('-')
                  ? message?.content?.split('-')?.[1]
                  : message?.content || ''}
              </TypographyP>
            </DicomView>
          </FlexBox>
        );
      }
      return (
        <FlexBox flex centerContent classname='gap-.5 items-start'>
          <div className='mt-[3px]'>
            <Icon
              name='attachment'
              color='transparent'
              width={20}
              height={20}
            />
          </div>
          <TypographyP
            onClick={() => {
              window.open(getUrl, '_blank');
            }}
            noBottom
            size={16}
            classname='font-normal break-all underline cursor-pointer'
          >
            {message?.content?.includes('-')
              ? message?.content?.split('-')?.[1]
              : message?.content || ''}
          </TypographyP>
        </FlexBox>
      );
    } else {
      return (
        <TypographyP
          noBottom
          size={16}
          classname='self-start font-normal break-all'
        >
          {message?.content || ''}
        </TypographyP>
      );
    }
  };

  const userMessageComponent = (message: TMessage, getUrl?: string) => {
    return (
      <FlexBox
        flex
        classname={`p-[10px] bg-lightPrimary flex-col rounded-[4px] gap-1  items-end ${message?.contentType !== MESSAGE_CONTENT_TYPE.TEXT && 'flex-col'}`}
      >
        {renderMessage(message, getUrl)}
        <FlexBox flex centerItems>
          <TypographyP noBottom classname=' font-normal !text-[10px]'>
            {getLastSeen(message?.createdAt)}
          </TypographyP>
        </FlexBox>
      </FlexBox>
    );
  };

  const yourMessageComponent = (message: TMessage, getUrl?: string) => {
    const getMessageStatusIcon = () => {
      let iconName = '',
        height = 16,
        width = 16;
      if (message?.messageStatus == MESSAGE_STATUS.READ) {
        iconName = 'double-tick';
      } else if (message?.messageStatus == MESSAGE_STATUS.DELIVERED) {
        iconName = 'double-gray-tick';
      } else {
        iconName = 'single-tick';
        height = 9;
        width = 12;
      }
      return { iconName, height, width };
    };

    const { iconName, height, width } = getMessageStatusIcon();
    return (
      <FlexBox
        flex
        classname={`p-[10px] bg-backgroundGray rounded-[4px] gap-1 flex-col items-end ${message?.contentType !== MESSAGE_CONTENT_TYPE.TEXT && 'flex-col'}`}
      >
        {renderMessage(message, getUrl)}
        <FlexBox flex centerItems>
          <TypographyP
            noBottom
            classname={`font-normal !text-[10px] ${iconName === 'single-tick' && 'mr-[2px]'}`}
          >
            {getLastSeen(message?.createdAt)}
          </TypographyP>
          <Icon name={iconName} height={height} width={width} />
        </FlexBox>
      </FlexBox>
    );
  };

  const handleChangeValue = useCallback(
    (name: FieldPath<TSendMessage>, value: string) =>
      form.setValue(name, value),
    [],
  );

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
              chatId: chatId || '',
              senderId: user?.id || '',
              receiverId: currentUser?.receiverDetails?.id || '',
            });
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
    [currentUser],
  );

  if (loading) {
    return (
      <div className='flex h-full justify-center'>
        <Loader screen={40} size={25} />
      </div>
    );
  }

  return (
    <div className='h-full'>
      <div className='flex h-[12%] items-center space-x-4 border-b border-backgroundGray px-4 pb-4'>
        <FlexBox
          centerContent
          centerItems
          flex
          classname='!pt-0 bg-lightPrimary rounded-full h-5 w-5 px-1 md:hidden cursor-pointer'
          onClick={() => router.push('/chat-messages')}
        >
          <MoveLeft color={COLORS.PRIMARY} size={16} />
        </FlexBox>
        <div className='flex-shrink-0'>
          <div className='relative'>
            <Image
              className='h-[48px] w-[48px] rounded-full'
              src={getReceiverProfileUrl}
              alt='Neil image'
              height={48}
              width={48}
            />
            <span
              className={`absolute bottom-0 left-[34px] h-3 w-3 rounded-full border-0 border-white ${currentUser?.receiverDetails?.userActivity && 'bg-online'}`}
            ></span>
          </div>
        </div>

        <div className='min-w-0 flex-1'>
          <FlexBox flex centerItems justify='between'>
            <div>
              <TypographyP
                size={18}
                noBottom
                classname='!text-darkGray  font-semibold capitalize'
              >
                {`${currentUser?.receiverDetails?.firstName || ''} ${currentUser?.receiverDetails?.lastName || ''}`}
              </TypographyP>

              <TypographyP noBottom size={12} classname=' font-normal'>
                {currentUser?.receiverDetails?.userActivity
                  ? USER_ACTIVITY.ONLINE
                  : USER_ACTIVITY?.OFFLINE}
              </TypographyP>
            </div>
            <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
              <DropdownMenuTrigger
                asChild
                className={`focus!bg-white outline-none hover:bg-white`}
              >
                <Image
                  src='../../assets/vertical-ellipse.svg'
                  alt='vertical-ellipse'
                  width={28}
                  height={28}
                  className='cursor-pointer'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-12 !gap-5 border-none'>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setActiveTab(3);
                    }}
                    className={`cursor-pointer !border-b !border-lightGray text-[16px] font-normal text-gray focus:bg-primary focus:text-white`}
                  >
                    {t('translation.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`cursor-pointer border-none text-[16px] font-normal text-gray focus:bg-primary focus:text-white`}
                    onClick={confirmClearChat}
                  >
                    {t('translation.clearChat')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </FlexBox>
        </div>
      </div>
      <FlexBox
        flex
        classname='!justify-between flex-col h-[88%] overflow-y-scroll'
      >
        <div className='h-[70%] flex-1 overflow-y-auto'>
          {messages?.map((message, index) => {
            const getUrl = user
              ? getImageUrl(user?.s3BucketUrl, message?.content)
              : undefined;
            return (
              <div key={index} ref={div}>
                {message?.sender === user?.id ? (
                  <div className='ml-auto px-4 py-1' id={'container'}>
                    <FlexBox flex classname='flex gap-[10px] justify-end'>
                      <FlexBox flex classname='flex-col gap-2 md:max-w-[50%]'>
                        <FlexBox flex classname='flex-col gap-2 '>
                          {yourMessageComponent(message, getUrl)}
                        </FlexBox>
                      </FlexBox>
                    </FlexBox>
                  </div>
                ) : (
                  <div className='px-4 py-1'>
                    <FlexBox flex classname='flex gap-[10px]'>
                      <FlexBox flex classname='flex-col gap-2 md:max-w-[50%]'>
                        <FlexBox flex classname='flex-col gap-2 '>
                          {userMessageComponent(message, getUrl)}
                        </FlexBox>
                      </FlexBox>
                    </FlexBox>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

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
                  sendingMessage && 'cursor-not-allowed opacity-80',
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
                ref={sendButtonRef}
              >
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
                style={{ position: 'absolute', bottom: '60px', left: '20px' }}
                onEmojiClick={onEmojiClick}
              />
            )}
          </div>
        </form>
      </FlexBox>
      <FilePreview
        url={flieToPreview}
        openFilePreview={openFilePreview}
        setOpenFilePreview={setOpenFilePreview}
      />
    </div>
  );
};

export default UserChat;

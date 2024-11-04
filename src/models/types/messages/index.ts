import { MESSAGE_CONTENT_TYPE } from '@/enums/chat';

export type TChatUsers = {
  createdAt: string;
  id: string;
  isEnabled?: boolean;
  unreadMessages: number;
  messages: TMessage[];
  lastMessage?: TLastMessage;
  updatedAt: string;
  users: TUsers[];
};

export type TUsers = {
  firstName: string;
  id: string;
  lastName: string;
  profilePicture: string;
  email: string;
  callingCode: string;
  mobileNumber: string;
  role: string;
  userActivity?: boolean;
};

export type TNewMessage = {
  chatId: string;
  content: string;
  contentType: string;
  messageStatus?: string;
  receiverId: string;
  senderId: string;
  id: string;
  receiver: string;
  sender: string;
};

type TLastMessage = {
  id: string;
  content: string;
  contentType: string;
  messageStatus: string;
  readAt: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TMessage = {
  content: string;
  contentType: string;
  createdAt: string;
  id: string;
  isEnabled: boolean;
  messageStatus: string;
  readAt: string;
  updatedAt: string;
  receiver: string;
  sender: string;
  chatId?: string;
  messageId?: string;
};

export type TUserChat = {
  createdAt: string;
  id: string;
  isEnabled: boolean;
  messages: TMessage[];
  updatedAt: string;
  users: string[];
};

export type TCurrentUser = {
  createdAt: string;
  id: string;
  isEnabled: boolean;
  messages: TMessage[];
  updatedAt: string;
  users: string[];
  senderDetails?: TUsers;
  receiverDetails?: TUsers;
};

export type TSendMessage = {
  content: string;
  contentType: MESSAGE_CONTENT_TYPE;
  chatId: string;
  receiverId: string;
  senderId: string;
  createdAt?: string;
};

export type TAllReaderDoctor = [
  {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicture: string;
  },
];

export type TSocketResponse = {
  data: any;
  message: string;
  status: number;
  error?: string;
};

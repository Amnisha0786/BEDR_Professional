import { MESSAGE_CONTENT_TYPE } from '@/enums/chat';
import yup from '@/lib/common/yup-email';

export const userChatMessageSchema = yup.object().shape({
  content: yup.string().required('Please type message.'),
  contentType: yup
    .string()
    .oneOf(Object.values(MESSAGE_CONTENT_TYPE))
    .required('Content type is required'),
  chatId: yup.string().required('Content type is required'),
  senderId: yup.string().required('Content type is required'),
  receiverId: yup.string().required('Content type is required'),
});

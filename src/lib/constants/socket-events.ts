export const SOCKET_EVENTS = {
  FILE_SUBMITTED_BY_OPTOMETRIST: '/file-submitted-by-optometrist',
  FILE_MOVED_TO_PATIENT_FILES: '/file-moved-to-patient-files', //
  REFERRED_PATIENT: '/patient-file-referred', //
  FILE_PICKED_BY_PROFESSIONAL: '/file-picked-by-professional', //
  ADDED_DIAGNOSIS_FORM: '/added-diagnosis-form',
  FILE_SUBMITTED_BY_DOCTOR: '/file-submitted-by-doctor',
  FILE_SUBMITTED_BY_READER: '/file-submitted-by-reader',
  FILE_REJECTED_BY_PROFESSIONAL: '/file-rejected-by-professional',
  FILE_SUBMITTED_FROM_PRACTICE: '/file-submitted-from-practice', //
  CHAT_MARK_AS_READ: '/chat/mark-messages-as-read',
  BOOKING_CREATED: '/booking-created-by-doctor-reader',
  CANCEL_BOOKING: '/booking-cancelled-by-doctor-reader',
  PAYMENT_SUCCEED_WEBHOOK: '/patient-file-payment-succeeded',
  NOTIFICATION_LIST: '/notifications-sent-to-user',
  FILE_CAPACITY_UPDATE: '/file-capacity-updated',
  UNINTENDED_FILE_CLOSED: '/unattended-file-closed',
  CHAT_MARK_AS_DELIVERED: '/chat/mark-messages-as-delivered',
  SEND_NEW_MESSAGE: '/chat/new-message',
  ON_RECIEVE_NEW_MESSAGE: '/chat/on-new-message', //
  CHAT_REFRESH: '/chat/on-new-message-to-refresh-chats', //
  GET_ONLINE_USERS: '/chat/get-online-users',
};

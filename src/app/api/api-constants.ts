export const API_URLS = {
  VERIFY_OTP: '/user/send-verification-otp',
  SIGNUP: '/user/register',
  LOGIN: '/user/login',
  LOGOUT: '/user/logout',
  FORGOT_PASSWORD: '/user/forgot-password-email',
  RESET_PASSWORD: '/user/reset-password',
  GET_NEW_ACCESS_TOKEN: '/user/new-access-token',
  GET_PRACTICES: '/practice/get-optometrist-practices',
  GET_USER_PROFILE: '/user/profile',
  UPLOAD_FILE: '/common/upload-file',
  DELETE_UPLOADED_FILE: '/common/delete-file',
  HELP_SUPPORT: '/common/submit-query',
  TERMS_CONDITIONS: '/common/get-terms-and-condition',
  AGREE_TO_TERMS_CONDITION: '/user/agree-terms-and-conditions',
  NOTIFICATIONS_SETTINGS: '/common/update-notification-settings',
  GET_NOTIFICATION_SETTINGS: '/common/get-notification-settings',
  EDIT_PROFILE: '/user/edit-profile',
  CHANGE_PASSWORD: '/user/change-password',
  PRIVACY_POLICY: '/common/get-privacy-policy',
  LIST_DOCTORS: '/common/list-doctors',
  ALERT_RESPONSE: '/doctor-reader/accept-reject-urgent-requests',
  DICOM_TOKEN: '/common/get-dicom-file-token',

  // create-patient-routes
  GET_ALL_PATIENTS: '/patient/list',
  GET_FILE_IN_PROGRESS: '/optometrist/get-in-progress-file',
  ADD_REFERRAL_FORM: '/optometrist/create-patient-request/add-referral-form',
  ADD_EYE_IMAGES: '/optometrist/create-patient-request/add-eye-images',
  COMMUNICATION_PREFERENCES:
    '/optometrist/create-patient-request/add-communication-form',
  SUBMIT_FILE: '/optometrist/create-patient-request/file-status',
  CANCEL_FILE: '/optometrist/create-patient-request/discard-file',
  GET_PENDING_FILES: '/optometrist/list-pending-files',
  OPEN_PENDING_FILE: '/optometrist/open-pending-file',

  //today's clinics routes
  GET_TODAYS_CLINICS: '/doctor-reader/get-today-clinics-records',
  OPEN_NEXT_FILE: '/doctor-reader/open-next-file',

  //file-in-progress-routes
  GET_FILE_PROGRESS: '/doctor-reader/get-in-progress-file',
  DRAFT_DIAGNOSIS_FORM: '/doctor-reader/add-diagnosis-form',
  CANCEL_FILE_WITH_REASON: '/doctor-reader/skip-file',
  COMPLETE_FILE: '/doctor-reader/submit-and-post-changes',

  //completed-files-routes
  COMPLETED_FILES: '/doctor-reader/get-completed-files',
  VIEW_PATIENT_FILE: '/common/get-patient-file-details',

  //practice optometrists-routes
  GET_PRACTICE_OPTOMETRISTS: '/practice/get-practice-optometrists',
  GET_ALL_OPTOMETRISTS: '/practice/optometrist-list',
  ADD_OPTOMETRIST: '/practice/add-optometrist',
  REMOVE_OPTOMETRIST: '/practice/remove-optometrist',

  // file-status-tracker-routes
  GET_FILE_STATUS: '/optometrist/track-files-status',
  MOVE_TO_PATIENT_FILES: '/optometrist/move-to-patient-file',
  CONFIRM_REFERRAL: '/optometrist/refer-patient',
  PRACTICE_FILE_STATUS_TRACKER: '/practice/file-status-tracker',

  // patient-files
  GET_PATIENT_FILES: '/optometrist/get-patient-files',

  // performance-data
  GET_PERFORMANCE_DATA: '/optometrist/get-performance-data',

  // optometrist-dashboard
  GET_DASHBOARD_DATA: '/optometrist/get-dashboard-data',

  // practice-dashboard
  GET_PRACTICE_DASHBOARD_DATA: '/practice/get-practice-dashboard-details',
  GET_UNREAD_FILES: '/practice/get-unread-files',
  GET_URGENT_FILES: '/practice/get-urgent-files-requiring-action',
  GET_NON_URGENT_FILES: '/practice/get-non-urgent-files-requiring-action',
  GET_RESUBMISSION_FILES: '/practice/get-files-requiring-resubmission',

  // planner
  GET_CLINICS_LIST: '/doctor-reader/clinics-list',
  READ_CLINIC_TERMS_CONDITIONS:
    '/doctor-reader/agree-clinic-terms-and-conditions',
  GET_AVAILABLE_BOOKINGS: '/doctor-reader/get-available-bookings',
  CREATE_BOOKING: '/doctor-reader/create-booking',
  CANCEL_BOOKING: '/doctor-reader/cancel-booking',
  GET_BOOKINGS: '/doctor-reader/get-bookings',

  // messages
  GET_CHAT_ID: '/common/get-user-chat',
  GET_USER_CHAT_MESSAGES: '/common/get-chat-messages',
  GET_ALL_USERS: '/common/get-all-chats',
  SEND_MESSAGE_TODAY_TEAM: 'doctor-reader/message-todays-team',
  GET_ALL_DOCTOR_AND_READERS: 'doctor-reader/get-doctors-and-readers',
  CLEAR_CHAT: '/common/clear-chat-messages',

  // ipad
  GET_FILES_LIST: '/practice/list-unpaid-files',
  SUBMIT_PATIENT_CONSENT: '/practice/create-patient-request/patient-consent',
  CREATE_CHECKOUT_SESSION: '/practice/create-payment-intent',
  SUBMIT_FILE_DATA: '/practice/create-patient-request/submit-file',
  SELECT_PATIENT: '/practice/create-patient-request/select-patient',
  GET_FILE_IN_PROGRESS_IPAD:
    '/practice/create-patient-request/get-in-progress-file',
  CANCEL_FILE_IPAD: '/practice/create-patient-request/discard-file',

  // doctor-reader payments
  GET_BANK_DETAILS: '/common/get-bank-details',
  ADD_BANK_DETAILS: '/common/add-bank-details',
  GET_PAYMENTS: '/common/get-payments',
  DELETE_BANK_ACCOUNT: '/common/delete-bank-account',
  GET_MONTHLY_PAYMENTS: '/common/get-monthly-payments',

  // notifications
  GET_NOTIFICATION: '/common/list-notifications',

  // medicine list
  GET_MEDICINE_LIST: 'optometrist/medicines-list',

  // submitted files list for ipad
  SUBMITTED_FILES: '/practice/list-submitted-files',
};

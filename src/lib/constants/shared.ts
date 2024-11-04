import { HeaderItem } from 'react-multi-date-picker';

export const DEVICE_TYPE = 'web';
export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const CALENDAR_HEADER: HeaderItem[] = [
  'MONTH_YEAR',
  'LEFT_BUTTON',
  'RIGHT_BUTTON',
];
export const IPAD_HOMEPAGE = '/ipad/practice';

export const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

export const IPAD_AUTH_ROUTES = ['/ipad/login', '/ipad'];

export const DOCTOR_ROUTES = [
  '/todays-clinics',
  '/file-in-progress',
  '/chat-messages',
  '/completed-files',
  '/planner',
  '/payments',
  '/settings',
  '/notifications',
];
export const OPTOMETRIST_ROUTES = [
  '/availability',
  '/create-patient-request',
  '/doctor-profiles',
  '/file-status-tracker',
  '/patient-files',
  '/payments',
  '/settings',
  '/notifications',
];
export const READER_ROUTES = [
  '/todays-clinics',
  '/file-in-progress',
  '/chat-messages',
  '/planner',
  '/payments',
  '/settings',
  '/notifications',
  '/todays-completed-files',
];
export const PRACTICE_ROUTES = [
  '/overview',
  '/optometrists',
  '/practice/file-status-tracker',
  '/payments',
  '/settings',
  '/notifications',
];

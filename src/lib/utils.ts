import {
  doctorsNavItems,
  navItems,
  practiceNavItems,
  readersNavItems,
} from '@/lib/constants/data';
import { LOGINS } from '@/enums/auth';
import axios from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IPAD_HOMEPAGE } from './constants/shared';

enum ENVIRONMENTS {
  DEV = 'DEV',
  PROD = 'PROD',
  TEST = 'TEST',
  STAGE = 'STAGE',
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown) => {
  let message;
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      message = 'Something went wrong!';
    } else if (error.response) {
      message = error.response?.data?.message;
    } else {
      message = error.message;
    }
  } else {
    message = String(error);
  }
  return message;
};

export const getConfig = (): string | undefined => {
  const env = process.env.NEXT_PUBLIC_ENV?.trim() || 'DEV';
  let value;
  if (env === ENVIRONMENTS.STAGE) {
    value = process.env.NEXT_PUBLIC_STAGE_API_BASE_URL;
  } else if (env === ENVIRONMENTS.PROD) {
    value = process.env.NEXT_PUBLIC_PROD_API_BASE_URL;
  } else if (env === ENVIRONMENTS.TEST) {
    value = process.env.NEXT_PUBLIC_TEST_API_BASE_URL;
  } else {
    value = process.env.NEXT_PUBLIC_DEV_API_BASE_URL;
  }
  return value;
};
export const getSocketConfig = (): string | undefined => {
  const env = process.env.NEXT_PUBLIC_ENV?.trim() || 'DEV';
  let value;
  if (env === ENVIRONMENTS.STAGE) {
    value = process.env.NEXT_PUBLIC_STAGE_SOCKET_BASE_URL;
  } else if (env === ENVIRONMENTS.PROD) {
    value = process.env.NEXT_PUBLIC_PROD_SOCKET_BASE_URL;
  } else if (env === ENVIRONMENTS.TEST) {
    value = process.env.NEXT_PUBLIC_TEST_SOCKET_BASE_URL;
  } else {
    value = process.env.NEXT_PUBLIC_DEV_SOCKET_BASE_URL;
  }
  return value;
};

export const goToDefaultRoutes = (role: string, pathname?: string) => {
  let route;
  if (role === LOGINS.OPTOMETRIST) {
    route = '/availability';
  } else if (role === LOGINS.DOCTOR || role === LOGINS.READER) {
    route = '/todays-clinics';
  } else if (pathname === '/ipad/login') {
    route = IPAD_HOMEPAGE;
  } else if (role === LOGINS.PRACTICE) {
    route = '/overview';
  } else {
    route = '/settings';
  }
  return route;
};

export const getSideBarContent = (role: string) => {
  let sideBarContent;
  if (role === LOGINS.OPTOMETRIST) {
    sideBarContent = navItems;
  } else if (role === LOGINS.DOCTOR) {
    sideBarContent = doctorsNavItems;
  } else if (role === LOGINS.READER) {
    sideBarContent = readersNavItems;
  } else {
    sideBarContent = practiceNavItems;
  }
  return sideBarContent;
};

export const onConnect = () => console.log('SOCKET-CONNECT');

export const onDisconnect = () => console.log('SOCKET-DISCONNECT');

export const onError = (error: string) => console.log(error, 'SOCKET-ERROR');

export const onConnectionError = (error: Error) =>
  console.log(error, 'SOCKET-CONNECTION-ERROR');

import { LOGINS } from '@/enums/auth';
import {
  AUTH_ROUTES,
  DOCTOR_ROUTES,
  OPTOMETRIST_ROUTES,
  PRACTICE_ROUTES,
  READER_ROUTES,
} from '../constants/shared';

export const possibleUserRoutes = (role: string) => {
  let userRoutes: string[];
  switch (role) {
    case LOGINS.DOCTOR:
      userRoutes = DOCTOR_ROUTES;
      break;
    case LOGINS.READER:
      userRoutes = READER_ROUTES;
      break;
    case LOGINS.OPTOMETRIST:
      userRoutes = OPTOMETRIST_ROUTES;
      break;
    case LOGINS.PRACTICE:
      userRoutes = PRACTICE_ROUTES;
      break;
    default:
      userRoutes = AUTH_ROUTES;
      break;
  }
  return userRoutes;
};

import { clearRedux } from '../store';
import { clearCookies, clearIpadCookies } from './manage-cookies';

export const clearDataOnLogout = (isIpadView = false) => {
  clearRedux();
  isIpadView ? clearIpadCookies() : clearCookies();
};

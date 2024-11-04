import Cookies from 'js-cookie';

const DEFAULT_EXPIRY_TIME = 7;

export const clearCookies = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  Cookies.remove('practiceId');
  Cookies.remove('practiceName');
  Cookies.remove('publicKey');
  Cookies.remove('privateKey');
  Cookies.remove('role');
};

export const clearIpadCookies = () => {
  Cookies.remove('ipadAccessToken');
  Cookies.remove('ipadRefreshToken');
  Cookies.remove('ipadPublicKey');
  Cookies.remove('ipadPrivateKey');
};

export const getValueFromCookies = (name: string) => {
  const value = Cookies.get(name);
  return value;
};

export const setValuesInCookies = (
  name: string,
  value: string,
  expiryTime?: number,
) =>
  Cookies.set(name, value, {
    // secure: true,
    expires: expiryTime || DEFAULT_EXPIRY_TIME,
  });

import { TDeviceType } from '@/app/api';

export type TLoginForm = {
  email: string;
  otp?: string;
  otpType?: string;
  password?: string;
  role: string;
  practiceId?: string;
  deviceType?: TDeviceType;
};

export type TSignupForm = {
  role: string;
  otp?: string;
  gocNumber?: string;
  gmcNumber?: string;
  icoNumber?: string;
  practiceName?: string;
  email?: string;
  practiceAddress?: string;
  mobileNumber?: string;
  password: string;
  contactPerson?: string;
  contactPersonEmail?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  postCode?: string;
  termsAndConditions: boolean;
  confirmPassword: string;
  callingCode: string;
  deviceType?: TDeviceType;
  insuranceCertificate?: any | null | undefined;
  insuranceRenewalDate?: string;
  salutation?: string;
};

export type TForgotPasswordForm = {
  email: string;
  role: string;
};

export type TVerifyOtpFrom = {
  email: string;
  oneTimePassword: string;
};

export type TResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

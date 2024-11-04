import { SETTINGS_SIDEBAR } from '@/enums/settings';

export type TSidebar = {
  title: SETTINGS_SIDEBAR;
  disabled?: boolean;
  icon?: string;
  margin?: string;
};

export type TPersonalInformationForm = {
  gocNumber?: string;
  gmcNumber?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  callingCode: string;
  email: string;
  dateOfBirth?: string;
  postCode?: string;
  role?: string;
  icoNumber?: string;
  practiceName?: string;
  practiceAddress?: string;
  contactPerson?: string;
  profilePicture?: string;
  insuranceCertificate?: any;
  hospitalName?: string;
  description?: string;
  subSpecialties?: string[];
  otherSubSpeciality?: string;
  insuranceRenewalDate?: string;
  salutation?: string;
};

export type TSettingsHelpAndSupport = {
  query: string;
  emailToYourself?: boolean;
};

export type TTermsAndConditions = {
  created_at: string;
  fileKey: string;
  id: string;
  isEnabled: boolean;
  role: string;
  updated_at: string;
};

export type TNotificationPayload = {
  fileUpdates?: boolean;
  messages?: boolean;
  regularUpdates?: boolean;
};

export type TChangePassword = {
  password: string;
  currentPassword: string;
  confirmPassword: string;
};

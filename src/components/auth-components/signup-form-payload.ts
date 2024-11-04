import dayjs from 'dayjs';

import { LOGINS } from '@/enums/auth';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import { TSignupForm } from '@/models/types/auth';
import { DEVICE_TYPE } from '@/lib/constants/shared';

export const getSignupPayload = (role: string, data: TSignupForm) => {
  let metadata;
  const commonPayload = {
    role: data?.role,
    firstName: data?.firstName?.trim(),
    lastName: data?.lastName?.trim(),
    dateOfBirth:
      data?.dateOfBirth && dayjs(data?.dateOfBirth)?.format(DATE_FORMAT),
    postCode: data?.postCode?.toUpperCase(),
    termsAndConditions: data?.termsAndConditions,
    email: data?.email?.toLowerCase() || '',
    password: data?.password,
    confirmPassword: data?.confirmPassword,
    callingCode: data?.callingCode,
    deviceType: DEVICE_TYPE,
    otpType: 'sign_up',
  };
  switch (role) {
    case LOGINS.DOCTOR:
      metadata = {
        ...commonPayload,
        gmcNumber: data?.gmcNumber?.toUpperCase(),
        insuranceCertificate: data?.insuranceCertificate,
        insuranceRenewalDate:
          data?.insuranceRenewalDate &&
          dayjs(data?.insuranceRenewalDate)?.format(DATE_FORMAT),
        icoNumber: data?.icoNumber?.toUpperCase(),
        salutation: data?.salutation,
      };
      break;
    case LOGINS.READER:
      metadata = {
        ...commonPayload,
      };
      break;
    case LOGINS.OPTOMETRIST:
      metadata = {
        ...commonPayload,
        gocNumber: data?.gocNumber?.toUpperCase(),
      };
      break;
    case LOGINS.PRACTICE:
      metadata = {
        role: data.role,
        icoNumber: data?.icoNumber?.toUpperCase(),
        practiceName: data?.practiceName,
        practiceAddress: data?.practiceAddress,
        contactPerson: data?.contactPerson,
        email: data?.contactPersonEmail?.toLowerCase() || '',
        termsAndConditions: data?.termsAndConditions,
        password: data?.password,
        confirmPassword: data?.confirmPassword,
        callingCode: data?.callingCode,
        deviceType: DEVICE_TYPE,
        otpType: 'sign_up',
      };
      break;
    default:
      metadata = undefined;
      break;
  }
  return metadata;
};

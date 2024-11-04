import dayjs from 'dayjs';

import { LOGINS } from '@/enums/auth';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import { TPersonalInformationForm } from '@/models/types/settings';

export const getEditProfilePayload = (
  role: string,
  data: TPersonalInformationForm,
) => {
  let metadata;
  const commonPayload = {
    role: data?.role,
    firstName: data?.firstName?.trim(),
    lastName: data?.lastName?.trim(),
    dateOfBirth:
      data?.dateOfBirth && dayjs(data?.dateOfBirth)?.format(DATE_FORMAT),
    postCode: data?.postCode?.toUpperCase(),
    email: data?.email?.toLowerCase() || '',
    callingCode: data?.callingCode,
    mobileNumber: data?.mobileNumber,
    profilePicture: data?.profilePicture,
  };
  switch (role) {
    case LOGINS.DOCTOR:
      metadata = {
        ...commonPayload,
        insuranceCertificate: data?.insuranceCertificate || null,
        gmcNumber: data?.gmcNumber?.toUpperCase(),
        hospitalName: data?.hospitalName || '',
        description: data?.description || '',
        insuranceRenewalDate:
          data?.insuranceRenewalDate &&
          dayjs(data?.insuranceRenewalDate)?.format(DATE_FORMAT),
        icoNumber: data?.icoNumber?.toUpperCase(),
        salutation: data?.salutation,
        subSpecialties:
          data?.subSpecialties?.length && data?.otherSubSpeciality
            ? [...data.subSpecialties, data?.otherSubSpeciality]
            : data?.subSpecialties,
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
        callingCode: data?.callingCode,
        mobileNumber: data?.mobileNumber,
        profilePicture: data?.profilePicture,
      };
      break;
    default:
      metadata = undefined;
      break;
  }
  return metadata;
};

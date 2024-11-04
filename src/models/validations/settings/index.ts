import yup from '@/lib/common/yup-email';
import { LOGINS } from '@/enums/auth';
import { mobileNumberValidator } from '@/lib/common/mobile-validation';
import {
  dateOfBirthValidator,
  validateDate,
} from '@/lib/common/dob-validation';
import {
  regex_name,
  regex_post_code,
  regex_password,
  regex_practice_address,
  regex_last_name,
  regex_gmc_number,
  regex_ico_number,
  regex_goc_number,
} from '@/lib/constants/regex';
import i18next from '@/localization/index';

const t = i18next.t;

export const personalInformationSettingsSchema = yup.object().shape({
  gocNumber: yup.string().when('role', {
    is: (role: string) => role === LOGINS.OPTOMETRIST,
    then: () =>
      yup
        .string()
        .required(t('translation.enterValidGocNumber'))
        .matches(regex_goc_number, t('translation.enterValidGocNumber')),
    otherwise: () => yup.string().optional(),
  }),
  gmcNumber: yup.string().when('role', {
    is: (role: string) => role === LOGINS.DOCTOR,
    then: () =>
      yup
        .string()
        .required(t('translation.enterValidGmcNumber'))
        .matches(regex_gmc_number, t('translation.enterValidGmcNumber')),
    otherwise: () => yup.string().optional(),
  }),
  icoNumber: yup.string().when('role', {
    is: (role: string) => role === LOGINS.PRACTICE || role === LOGINS.DOCTOR,
    then: () =>
      yup
        .string()
        .required(t('translation.enterValidIcoNumber'))
        .matches(regex_ico_number, t('translation.enterValidIcoNumber')),
    otherwise: () => yup.string().optional(),
  }),
  insuranceCertificate: yup.mixed().when('role', {
    is: (role: string) => role === LOGINS.DOCTOR,
    then: () =>
      yup
        .mixed()
        .required(t('translation.uploadInsuranceCertificate'))
        .test(
          'is-file',
          t('translation.uploadInsuranceCertificate'),
          (file) => {
            if (file) {
              return true;
            } else {
              return false;
            }
          },
        ),
    otherwise: () => yup.mixed().nullable().optional(),
  }),
  insuranceRenewalDate: yup
    .string()
    .typeError(t('translation.enterValidDate'))
    .when('role', {
      is: (role: string) => role === LOGINS.DOCTOR,
      then: () =>
        yup
          .string()
          .test('valid-date', t('translation.enterValidDate'), validateDate)
          .required(t('translation.enterValidDate')),
      otherwise: () => yup.string().optional(),
    }),
  salutation: yup.string().when('role', {
    is: (role: string) => role === LOGINS.DOCTOR,
    then: () => yup.string().required(t('translation.pleaseSelectSalutation')),
    otherwise: () => yup.string().optional(),
  }),
  firstName: yup.string().when('role', {
    is: (role: string) => role !== LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .trim()
        .required(t('translation.enterValidFirstName'))
        .matches(regex_name, t('translation.enterValidFirstName')),
    otherwise: () => yup.string().optional(),
  }),
  lastName: yup.string().when('role', {
    is: (role: string) => role !== LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .trim()
        .required(t('translation.enterValidLastName'))
        .matches(regex_last_name, t('translation.enterValidLastName')),
    otherwise: () => yup.string().optional(),
  }),
  mobileNumber: yup.string().when('role', {
    is: (role: string) => role === LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .required(t('translation.enterValidLandlineNumber'))
        .test(
          'is-valid-mobile-number',
          t('translation.enterValidLandlineNumber'),
          mobileNumberValidator,
        ),
    otherwise: () =>
      yup
        .string()
        .required(t('translation.enterValidMobileNumber'))
        .test(
          'is-valid-mobile-number',
          t('translation.enterValidMobileNumber'),
          mobileNumberValidator,
        ),
  }),
  callingCode: yup.string().required('Please select calling code.'),
  dateOfBirth: yup
    .string()
    .typeError(t('translation.enterValidDateOfBirth'))
    .when('role', {
      is: (role: string) => role !== LOGINS.PRACTICE,
      then: () =>
        yup
          .string()
          .test(
            'valid-date',
            t('translation.enterValidDateOfBirth'),
            dateOfBirthValidator,
          )
          .required(t('translation.enterValidDateOfBirth')),
      otherwise: () => yup.string().optional(),
    }),
  postCode: yup.string().when('role', {
    is: (role: string) => role !== LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .trim()
        .required(t('translation.enterValidPostcode'))
        .matches(regex_post_code, t('translation.enterValidPostcode')),
    otherwise: () => yup.string().optional(),
  }),
  practiceName: yup.string().when('role', {
    is: (role: string) => role === LOGINS.PRACTICE,
    then: () =>
      yup.string().trim().required(t('translation.enterPracticeName')),
    otherwise: () => yup.string().optional(),
  }),
  practiceAddress: yup.string().when('role', {
    is: (role: string) => role === LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .trim()
        .required(t('translation.enterPracticeAddress'))
        .matches(
          regex_practice_address,
          'translation.enterValidPracticeAddress',
        ),
    otherwise: () => yup.string().optional(),
  }),
  contactPerson: yup.string().when('role', {
    is: (role: string) => role === LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .trim()
        .required(t('translation.enterPracticeContactPerson'))
        .matches(regex_name, t('translation.enterValidContactPerson')),
    otherwise: () => yup.string().optional(),
  }),
  email: yup
    .string()
    .required(t('translation.enterValidEmail'))
    .email(t('translation.enterValidEmail')),
  hospitalName: yup.string().optional(),
  description: yup.string().optional(),
  subSpecialties: yup.array().optional(),
});

export const helpAndSupportSettingsSchema = yup.object().shape({
  query: yup.string().required(t('translation.pleaseEnterYourQuery')),
  emailToYourself: yup.boolean().optional(),
});

export const notificationsSchema = yup.object().shape({
  fileUpdates: yup.boolean().optional(),
  messages: yup.boolean().optional(),
  regularUpdates: yup.boolean().optional(),
});

export const changePasswordFormSchema = yup.object().shape({
  currentPassword: yup.string().required(t('translation.enterCurrentPassword')),
  password: yup
    .string()
    .required(t('translation.pleaseEnterNewPassword'))
    .matches(regex_password, t('translation.yourPasswordMustBe')),
  confirmPassword: yup
    .string()
    .required(t('translation.pleaseConfirmNewPassword'))
    .oneOf([yup.ref('password')], t('translation.passwordsDoNotMatch')),
});

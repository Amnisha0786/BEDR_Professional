import yup from '@/lib/common/yup-email';
import { LOGINS } from '@/enums/auth';
import { mobileNumberValidator } from '@/lib/common/mobile-validation';
import i18next from '@/localization/index';
import {
  dateOfBirthValidator,
  validateDate,
} from '@/lib/common/dob-validation';
import {
  regex_name,
  regex_password,
  regex_post_code,
  regex_practice_address,
  regex_last_name,
  regex_gmc_number,
  regex_ico_number,
  regex_goc_number,
} from '@/lib/constants/regex';

const t = i18next.t;

export const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .required(t('translation.enterValidEmail'))
    .email(t('translation.enterValidEmail')),
  password: yup
    .string()
    .required(t('translation.enterThePassword'))
    .matches(/\S+/i, t('translation.enterThePassword')),
  role: yup.string().required(t('translation.selectLoginAs')),
  practiceId: yup.string().optional(),
});

export const optometristLoginSchema = yup.object().shape({
  email: yup
    .string()
    .required(t('translation.enterValidEmail'))
    .email(t('translation.enterValidEmail')),
  role: yup.string().required(t('translation.selectLoginAs')),
  password: yup.string().when('role', {
    is: (role: string) => role === LOGINS.OPTOMETRIST,
    then: () => yup.string().optional(),
    otherwise: () =>
      yup
        .string()
        .required(t('translation.enterThePassword'))
        .matches(/\S+/i, t('translation.enterThePassword')),
  }),
});

export const signupFormSchema = yup.object().shape({
  role: yup.string().required(t('translation.selectSignupAs')),
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
  contactPersonEmail: yup.string().when('role', {
    is: (role: string) => role === LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .required(t('translation.enterValidEmail'))
        .email(t('translation.enterValidEmail')),
    otherwise: () => yup.string().optional(),
  }),
  email: yup.string().when('role', {
    is: (role: string) => role !== LOGINS.PRACTICE,
    then: () =>
      yup
        .string()
        .required(t('translation.enterValidEmail'))
        .email(t('translation.enterValidEmail')),
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
          t('translation.enterValidPracticeAddress'),
        ),
    otherwise: () => yup.string().optional(),
  }),
  salutation: yup.string().when('role', {
    is: (role: string) => role === LOGINS.DOCTOR,
    then: () => yup.string().required(t('translation.pleaseSelectSalutation')),
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
  password: yup
    .string()
    .required(t('translation.enterThePassword'))
    .matches(regex_password, t('translation.yourPasswordMustBe')),
  confirmPassword: yup
    .string()
    .required(t('translation.enterConfirmPassword'))
    .oneOf([yup.ref('password')], t('translation.passwordsDoNotMatch')),
  termsAndConditions: yup
    .boolean()
    .oneOf([true], t('translation.acceptTerms'))
    .required(t('translation.acceptTerms')),
  callingCode: yup.string().required(t('translation.enterCallingCode')),
});

export const forgotPasswordFormSchema = yup.object().shape({
  role: yup.string().required(t('translation.selectLoginAs')),
  email: yup
    .string()
    .required(t('translation.enterValidEmail'))
    .email(t('translation.enterValidEmail')),
});

export const verifyOtpFormSchema = yup.object().shape({
  email: yup
    .string()
    .required(t('translation.enterValidEmail'))
    .email(t('translation.enterValidEmail')),
  oneTimePassword: yup
    .string()
    .matches(/\S+/i, t('translation.enterTheOtp'))
    .required(t('translation.enterTheOtp')),
});

export const resetPasswordFormSchema = yup.object().shape({
  password: yup
    .string()
    .required(t('translation.pleaseEnterNewPassword'))
    .matches(regex_password, t('translation.yourPasswordMustBe')),
  confirmPassword: yup
    .string()
    .required(t('translation.pleaseConfirmNewPassword'))
    .oneOf([yup.ref('password')], t('translation.passwordsDoNotMatch')),
});

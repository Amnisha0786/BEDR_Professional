import yup from '@/lib/common/yup-email';
import {
  REFERRAL_FORM,
  VISION_AFFECTED,
  VISUAL_IMPAIRMENT,
  YES_NO,
} from '@/enums/create-patient';
import i18next from '@/localization';
import { mobileNumberValidator } from '@/lib/common/mobile-validation';
import { dateOfBirthValidator } from '@/lib/common/dob-validation';
import {
  regex_last_name,
  regex_name,
  regex_optional_name,
  regex_post_code,
} from '@/lib/constants/regex';

const t = i18next.t;

export const registerNewPatient = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required(t('translation.enterValidFirstName'))
    .matches(regex_name, t('translation.enterValidFirstName')),
  lastName: yup
    .string()
    .trim()
    .required(t('translation.enterValidLastName'))
    .matches(regex_last_name, t('translation.enterValidLastName')),
  email: yup
    .string()
    .required(t('translation.enterValidEmail'))
    .email(t('translation.enterValidEmail')),
  mobileNumber: yup
    .string()
    .required(t('translation.enterValidMobileNumber'))
    .test(
      'is-valid-mobile-number',
      t('translation.enterValidMobileNumber'),
      mobileNumberValidator,
    ),
  dateOfBirth: yup
    .string()
    .typeError(t('translation.enterValidDateOfBirth'))
    .test(
      'valid-date',
      t('translation.enterValidDateOfBirth'),
      dateOfBirthValidator,
    )
    .required(t('translation.enterValidDateOfBirth')),
  postCode: yup
    .string()
    .trim()
    .required(t('translation.enterValidPostcode'))
    .matches(regex_post_code, t('translation.enterValidPostcode')),
  ethnicity: yup.string().required(t('translation.pleaseSelectEthnicity')),
  sex: yup.string().required(t('translation.pleaseSelectGender')),
  callingCode: yup.string().required(t('translation.enterCallingCode')),
});

export const referralFormSchema = yup.object().shape({
  visionScaleType: yup.string().required(t('translation.pleaseSelectScale')),
  rightEyeVision: yup
    .number()
    .typeError(t('translation.pleaseEnterValidRightVision'))
    .required(t('translation.pleaseEnterRightVision')),
  leftEyeVision: yup
    .number()
    .typeError(t('translation.pleaseEnterValidLeftVision'))
    .required(t('translation.pleaseEnterLeftVision')),
  affectedVision: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(Object.values(VISION_AFFECTED))
        .required(t('translation.pleaseSelectIfVisionAffected')),
    )
    .test(
      'is-valid-affected-vision',
      t('translation.pleaseSelectIfVisionAffected'),
      (values) => {
        if (!values || values?.length === 0) {
          return false;
        }
        if (
          values.includes(VISION_AFFECTED.no) ||
          values.includes(VISION_AFFECTED.total_loss)
        ) {
          return values.length === 1;
        }
        return true;
      },
    )
    .required(t('translation.pleaseSelectIfVisionAffected')),
  affectedEye: yup
    .string()
    .required(t('translation.pleaseSelectWhichEyeAffected')),
  durationOfSymptoms: yup
    .string()
    .required(t('translation.pleaseSelectDuration')),
  visualImpairment: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(Object.values(VISUAL_IMPAIRMENT))
        .required(t('translation.pleaseSelectAny')),
    )
    .test(
      'is-valid-visual-impairement',
      t('translation.pleaseSelectAny'),
      (values) => {
        if (!values || values?.length === 0) {
          return false;
        }
        if (values.includes(VISUAL_IMPAIRMENT.none)) {
          return values.length === 1;
        }
        return true;
      },
    )
    .required(t('translation.pleaseSelectAny')),
  pain: yup.string().required(t('translation.pleaseSelectHowMuchPain')),
  redness: yup.string().required(t('translation.pleaseSelectIfRedness')),
  pastEyeHistory: yup.array().when('otherPastEyeHistory', {
    is: (otherPastEyeHistory: string) => {
      otherPastEyeHistory?.trim()?.length > 0;
    },
    then: () => yup.mixed().optional(),
    otherwise: () =>
      yup
        .mixed()
        .test(
          'validate-past-eye',
          t('translation.pleaseSelectPastEyeHistory'),
          (
            value: any,
            context: { parent: { otherPastEyeHistory: string } },
          ) => {
            const otherPastEyeHistory =
              context.parent.otherPastEyeHistory || '';
            if (
              (Array.isArray(value) && value?.length > 0) ||
              otherPastEyeHistory?.trim()?.length > 0
            ) {
              return true;
            } else {
              return false;
            }
          },
        )
        .required(t('translation.pleaseSelectPastEyeHistory')),
  }),
  currentTreatmentForEyes: yup
    .string()
    .required(t('translation.pleaseSelectCurrentTreatment')),
  medicalHistory: yup.array().when('otherMedicalHistory', {
    is: (otherMedicalHistory: string) => {
      otherMedicalHistory?.trim()?.length > 0;
    },
    then: () => yup.mixed().optional(),
    otherwise: () =>
      yup
        .mixed()
        .test(
          'validate-medical-history',
          t('translation.pleaseSelectMedicalHistory'),
          (
            value: any,
            context: { parent: { otherMedicalHistory: string } },
          ) => {
            const otherMedicalHistory =
              context.parent.otherMedicalHistory || '';
            if (
              (Array.isArray(value) && value?.length > 0) ||
              otherMedicalHistory?.trim()?.length > 0
            ) {
              return true;
            } else {
              return false;
            }
          },
        )
        .required(t('translation.pleaseSelectMedicalHistory')),
  }),
  otherMedicalHistory: yup.string().optional(),
  otherPastEyeHistory: yup.string().optional(),
  familyHistory: yup.array().optional(),
  durationBetween_3To_52Weeks: yup.number().when('durationOfSymptoms', {
    is: (durationOfSymptoms: string) =>
      durationOfSymptoms === REFERRAL_FORM.Between_3and52,
    then: () =>
      yup
        .number()
        .typeError(t('translation.pleaseSelectValidDuration'))
        .min(3, t('translation.pleaseEnterValue'))
        .max(52, t('translation.pleaseEnterValue')),
    otherwise: () => yup.string().optional(),
  }),
  lifestyle: yup.array().optional(),
  remarks: yup.string().optional(),
  intraocularPressure: yup.object().shape({
    rightEye: yup
      .number()
      .typeError(t('translation.pleaseEnterValidIop'))
      .min(0, t('translation.pleaseEnterValidIop'))
      .required(t('translation.pleaseEnterIopRight')),
    leftEye: yup
      .number()
      .typeError(t('translation.pleaseEnterValidIntraocularPressure'))
      .min(0, t('translation.pleaseEnterValidIntraocularPressure'))
      .required(t('translation.pleaseEnterIntraocularPressure')),
  }),
  whatTreatment: yup.string().when('currentTreatmentForEyes', {
    is: (currentTreatmentForEyes: string) =>
      currentTreatmentForEyes === YES_NO.yes,
    then: () =>
      yup.string().required(t('translation.pleaseEnterCurrentTreatment')),
    otherwise: () => yup.string().optional(),
  }),
});

export const leftEyeImagesFormSchema = yup.object().shape({
  fundusImage: yup.string().optional(),
  octVideo: yup.string().optional(),
  thicknessMap: yup.string().optional(),
  opticDiscImage: yup.string().optional(),
  visualFieldTest: yup.string().optional(),
  dicomFile: yup.string().optional(),
  discOctVideo: yup.string().optional(),
  discThicknessProfile: yup.string().optional(),
  discDicomFile: yup.string().optional(),
  addAnotherImage: yup.string().optional(),
});

export const rightEyeImagesFormSchema = yup.object().shape({
  fundusImage: yup.string().optional(),
  octVideo: yup.string().optional(),
  thicknessMap: yup.string().optional(),
  opticDiscImage: yup.string().optional(),
  visualFieldTest: yup.string().optional(),
  discOctVideo: yup.string().optional(),
  discThicknessProfile: yup.string().optional(),
  discDicomFile: yup.string().optional(),
  addAnotherImage: yup.string().optional(),
});

export const communicationPreferencesFormSchema = yup.object().shape({
  receivingDiagnosisMedium: yup
    .string()
    .required(t('translation.selectAnOption')),
  notificationMedium: yup.string().required(t('translation.selectAnOption')),
  email: yup.string().optional().email(t('translation.enterValidEmail')),
  name: yup
    .string()
    .optional()
    .test('valid_name', t('translation.validName'), (value) => {
      if (value) {
        return regex_optional_name.test(value);
      } else {
        return true;
      }
    }),
});

export const ipadNewPatientSearchSchema = yup.object().shape({
  firstName: yup
    .string()
    .optional()
    .test('valid_name', t('translation.enterValidFirstName'), (value) => {
      if (value) {
        return regex_name.test(value);
      } else {
        return true;
      }
    }),
  lastName: yup
    .string()
    .optional()
    .test('valid_name', t('translation.enterValidLastName'), (value) => {
      if (value) {
        return regex_last_name.test(value);
      } else {
        return true;
      }
    }),
  dateOfBirth: yup
    .string()
    .optional()
    .typeError(t('translation.enterValidDateOfBirth'))
    .test('valid-date', t('translation.enterValidDateOfBirth'), (value) => {
      if (value) {
        return dateOfBirthValidator(value);
      } else {
        return true;
      }
    }),
});

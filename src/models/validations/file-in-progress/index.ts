import yup from '@/lib/common/yup-email';
import { ACTION_TO_BE_TAKEN, REASON_TO_CANCEL } from '@/enums/file-in-progress';
import { AFFECTED_EYE } from '@/enums/create-patient';
import { getValueFromCookies } from '@/lib/common/manage-cookies';
import { LOGINS } from '@/enums/auth';
import i18next from '@/localization';

const t = i18next.t;
const role = getValueFromCookies('role');

export const draftDiagnosisFormSchema = yup.object().shape({
  affectedEye: yup
    .string()
    .oneOf(
      Object.values(AFFECTED_EYE),
      t('translation.pleaseSelectValidAffectedEye'),
    )
    .required(t('translation.pleaseSelectAffectedEye')),
  rightEyeDiagnosis: yup
    .string()
    .when(['otherRightEyeDiagnosis', 'affectedEye'], {
      is: (otherRightEyeDiagnosis: string, affectedEye: string) => {
        affectedEye === AFFECTED_EYE.LEFT ||
          otherRightEyeDiagnosis?.trim()?.length > 0;
      },
      then: () => yup.string().optional(),
      otherwise: () =>
        yup.string().test(
          'validate-right-eye-diagnosis',
          t('translation.pleaseSelectAffectedEyeDiagnosis'),
          (
            value: string | undefined,
            context: {
              parent: { otherRightEyeDiagnosis: string; affectedEye: string };
            },
          ) => {
            const otherRightEyeDiagnosis =
              context.parent.otherRightEyeDiagnosis || '';
            if (
              value ||
              otherRightEyeDiagnosis?.trim()?.length > 0 ||
              context.parent.affectedEye === AFFECTED_EYE.LEFT
            ) {
              return true;
            } else {
              return false;
            }
          },
        ),
    }),
  leftEyeDiagnosis: yup
    .string()
    .when(['otherLeftEyeDiagnosis', 'affectedEye'], {
      is: (otherLeftEyeDiagnosis: string, affectedEye: string) => {
        affectedEye === AFFECTED_EYE.RIGHT ||
          otherLeftEyeDiagnosis?.trim()?.length > 0;
      },
      then: () => yup.string().optional(),
      otherwise: () =>
        yup.string().test(
          'validate-left-eye-diagnosis',
          t('translation.pleaseSelectAffectedEyeDiagnosis'),
          (
            value: string | undefined,
            context: {
              parent: { otherLeftEyeDiagnosis: string; affectedEye: string };
            },
          ) => {
            const otherLeftEyeDiagnosis =
              context.parent.otherLeftEyeDiagnosis || '';

            if (
              value ||
              otherLeftEyeDiagnosis?.trim()?.length > 0 ||
              context.parent.affectedEye === AFFECTED_EYE.RIGHT
            ) {
              return true;
            } else {
              return false;
            }
          },
        ),
    }),
  otherOpthalmicConditions: yup.array().when('otherInputOpthalmicConditions', {
    is: (otherInputOpthalmicConditions: string) => {
      otherInputOpthalmicConditions?.trim()?.length > 0;
    },
    then: () => yup.mixed().optional(),
    otherwise: () =>
      yup
        .mixed()
        .test(
          'validate-other-opthalmic-conditions',
          t('translation.pleaseSelectValidOpthalmicConditions'),
          (
            value: unknown,
            context: { parent: { otherInputOpthalmicConditions: string } },
          ) => {
            const otherInputOpthalmicConditions =
              context.parent.otherInputOpthalmicConditions || '';
            if (
              (Array.isArray(value) && value?.length > 0) ||
              otherInputOpthalmicConditions?.trim()?.length > 0
            ) {
              return true;
            } else {
              return false;
            }
          },
        )
        .required(t('translation.pleaseSelectOtherOpthalmicConditions')),
  }),
  otherInputOpthalmicConditions: yup.string().optional(),
  diagnosisReason: yup.string().optional(),
  actionToBeTakenForLeftEye: yup.string().when(['affectedEye'], {
    is: (affectedEye: string) => {
      affectedEye === AFFECTED_EYE.RIGHT;
    },
    then: () => yup.string().optional(),
    otherwise: () =>
      yup.string().test(
        'validate-left-eye-diagnosis',
        t('translation.pleaseSelectActionToBeTaken'),
        (
          value: string | undefined,
          context: {
            parent: { affectedEye: string };
          },
        ) => {
          if (value || context.parent.affectedEye === AFFECTED_EYE.RIGHT) {
            return true;
          } else {
            return false;
          }
        },
      ),
  }),
  actionToBeTakenForRightEye: yup.string().when(['affectedEye'], {
    is: (affectedEye: string) => {
      affectedEye === AFFECTED_EYE.LEFT;
    },
    then: () => yup.string().optional(),
    otherwise: () =>
      yup.string().test(
        'validate-right-eye-diagnosis',
        t('translation.pleaseSelectActionToBeTaken'),
        (
          value: string | undefined,
          context: {
            parent: { affectedEye: string };
          },
        ) => {
          if (value || context.parent.affectedEye === AFFECTED_EYE.LEFT) {
            return true;
          } else {
            return false;
          }
        },
      ),
  }),
});

export const closeFileFormSchema = yup.object().shape({
  reasonToSkip: yup
    .string()
    .required(t('translation.pleaseSelectReasonToCloseFile')),
  issueWith: yup.string().when('reasonToSkip', {
    is: (reasonToSkip: string) =>
      reasonToSkip === REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE,
    then: () => yup.string().required(t('translation.pleaseSelectOneOption')),
    otherwise: () => yup.string().optional(),
  }),
  affectedEye: yup.string().when('reasonToSkip', {
    is: (reasonToSkip: string) =>
      reasonToSkip === REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE,
    then: () => yup.string().required(t('translation.pleaseSelectAffectedEye')),
    otherwise: () => yup.string().optional(),
  }),
  issueDescription: yup.string().when('reasonToSkip', {
    is: (reasonToSkip: string) =>
      reasonToSkip === REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE,
    then: () =>
      yup.string().required(t('translation.pleaseSelectIssueDescription')),
    otherwise: () => yup.string().optional(),
  }),
});

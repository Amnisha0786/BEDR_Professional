import yup from '@/lib/common/yup-email';
import { regex_optional_name } from '@/lib/constants/regex';
import i18next from '@/localization/index';

const t = i18next.t;

export const expressContentAllowSchema = yup.object().shape({
  useAnonymisedDataConsent: yup.boolean().optional(),
  agreeTermsAndConditions: yup.boolean().optional()
});
export const diagnosisReportShare = yup.object().shape({
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

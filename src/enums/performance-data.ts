import i18next from '@/localization/index';

const t = i18next.t;

export enum PERFORMANCE_DATA_FOR {
  YESTERDAY = 'yesterday',
  MONTH = 'month',
  YEAR = 'year',
}

export const PERFORMANCE_TABS = [
  {
    label: t('translation.yesterdayLabel'),
    value: PERFORMANCE_DATA_FOR.YESTERDAY,
  },
  {
    label: t('translation.monthView'),
    value: PERFORMANCE_DATA_FOR.MONTH,
  },
  {
    label: t('translation.yearView'),
    value: PERFORMANCE_DATA_FOR.YEAR,
  },
];

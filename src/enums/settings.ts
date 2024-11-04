import i18next from '@/localization/index';

const t = i18next.t;

export enum SETTINGS_SIDEBAR {
  PERSONAL_INFORMATION = 'Personal Information',
  CHANGE_PASSWORD = 'Change Password',
  NOTOFICATIONS = 'Notifications',
  HELP_SUPPORT = 'Help & Support',
  TERMS_CONDITIONS = 'Terms & Conditions',
  LOGOUT = 'Log out',
  INSURANCE_CERTIFICATE = 'Insurance certificate',
}

export enum SUB_SPECIALISM {
  MEDICAL_RETINA = 'medical_retina',
  VITREO_RETINA = 'vitreo_retinal',
  GLAUCOMA = 'glaucoma',
  CATARACT = 'cataract',
  CORNEAL = 'corneal',
  MEDICAL_OPTHALMOLOGY = 'medical_ophthalmology_including_uveitis',
  OCULOPLASTICS = 'oculoplastics',
}

export const SUB_SPECIALITIES = [
  {
    label: t('translation.medicalRetina'),
    value: SUB_SPECIALISM.MEDICAL_RETINA,
  },
  {
    label: t('translation.vitreoRetinal'),
    value: SUB_SPECIALISM.VITREO_RETINA,
  },
  { label: t('translation.glaucoma'), value: SUB_SPECIALISM.GLAUCOMA },
  { label: t('translation.cataract'), value: SUB_SPECIALISM.CATARACT },
  { label: t('translation.corneal'), value: SUB_SPECIALISM.CORNEAL },
  {
    label: t('translation.medicalOphthalmology'),
    value: SUB_SPECIALISM.MEDICAL_OPTHALMOLOGY,
  },
  {
    label: t('translation.oculoplastics'),
    value: SUB_SPECIALISM.OCULOPLASTICS,
  },
];

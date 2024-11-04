import { STEPPER } from '@/enums/create-patient';
import { FileInProgressSteps, NavItem, StepItem } from '@/models/types/shared';
import { TSidebar } from '@/models/types/settings';
import { SETTINGS_SIDEBAR } from '@/enums/settings';
import { ETHNICITY, GENDER } from '@/enums/auth';
import { FILE_IN_PROGRESS_STEPS } from '@/enums/file-in-progress';
import i18next from '../../localization/index';
import { SALUTAION } from '@/enums/shared';

const t = i18next.t;

export const navItems: NavItem[] = [
  {
    title: 'Availability',
    href: '/availability',
    icon: 'availablity',
    label: 'Availability',
  },
  {
    title: 'Create Patient Request',
    href: '/create-patient-request',
    icon: 'create-patient',
    label: 'Create Patient Request',
  },
  {
    title: 'Doctor Profiles',
    href: '/doctor-profiles',
    icon: 'doctor-profiles',
    label: 'Doctor Profiles',
  },
  {
    title: 'File Status Tracker',
    href: '/file-status-tracker',
    icon: 'file-tracker',
    label: 'File Status Tracker',
  },
  {
    title: 'Patient Files',
    href: '/patient-files',
    icon: 'patient-files',
    label: 'Patient Files',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'settings',
    label: 'Settings',
  },
];

export const doctorsNavItems: NavItem[] = [
  {
    title: 'Today’s Clinics',
    href: '/todays-clinics',
    icon: 'todays-clinic',
    label: 'Today’s Clinics',
  },
  {
    title: 'File in Progress',
    href: '/file-in-progress',
    icon: 'file-in-progress',
    label: 'File in Progress',
  },
  {
    title: 'Messages',
    href: '/chat-messages',
    icon: 'messages',
    label: 'Messages',
  },
  {
    title: 'Completed Files',
    href: '/completed-files',
    icon: 'completed-files',
    label: 'Completed Files',
  },
  {
    title: 'Planner',
    href: '/planner',
    icon: 'availablity',
    label: 'Planner',
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: 'doctor-payments',
    label: 'Payments',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'settings',
    label: 'Settings',
  },
];

export const readersNavItems: NavItem[] = [
  {
    title: 'Today’s Clinics',
    href: '/todays-clinics',
    icon: 'todays-clinic',
    label: 'Today’s Clinics',
  },
  {
    title: 'File in Progress',
    href: '/file-in-progress',
    icon: 'file-in-progress',
    label: 'File in Progress',
  },
  {
    title: 'Messages',
    href: '/chat-messages',
    icon: 'messages',
    label: 'Messages',
  },
  {
    title: `Today’s Completed Files`,
    href: '/todays-completed-files',
    icon: 'completed-files',
    label: 'Today’s Completed Files',
  },
  {
    title: 'Planner',
    href: '/planner',
    icon: 'availablity',
    label: 'Planner',
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: 'doctor-payments',
    label: 'Payments',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'settings',
    label: 'Settings',
  },
];

export const practiceNavItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/overview',
    icon: 'overview',
    label: 'Overview',
  },
  {
    title: 'Optometrists',
    href: '/optometrists',
    icon: 'optometrists',
    label: 'Optometrists',
  },
  {
    title: 'File Status Tracker',
    href: '/practice/file-status-tracker',
    icon: 'file-tracker',
    label: 'File Status Tracker',
  },
  {
    title: 'Payments',
    href: '/payments',
    icon: 'doctor-payments',
    label: 'Payments',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'settings',
    label: 'Settings',
  },
];

export const commonSettingsSidebar: TSidebar[] = [
  {
    title: SETTINGS_SIDEBAR.PERSONAL_INFORMATION,
    icon: 'settings-info',
    margin: 'pt-[1px]',
  },
  {
    title: SETTINGS_SIDEBAR.CHANGE_PASSWORD,
    icon: 'change-password',
    margin: 'pt-[1.5px]',
  },
  {
    title: SETTINGS_SIDEBAR.NOTOFICATIONS,
    icon: 'notification',
    margin: 'pt-[1.5px]',
  },
  {
    title: SETTINGS_SIDEBAR.HELP_SUPPORT,
    icon: 'question',
    margin: 'pt-[1.5px]',
  },
  {
    title: SETTINGS_SIDEBAR.TERMS_CONDITIONS,
    icon: 'terms',
    margin: 'pt-[1.5px]',
  },
  {
    title: SETTINGS_SIDEBAR.LOGOUT,
    icon: 'log-out',
    margin: 'pt-[1.5px]',
  },
];

export const settingsSidebarItems: TSidebar[] = [...commonSettingsSidebar];

export const stepItems: StepItem[] = [
  {
    title: STEPPER.REFERRAL_FORM,
    icon: 'referral-form',
    label: 'Referral Form',
    padding: 'pt-[1px]',
  },
  {
    title: STEPPER.RIGHT_EYE_IMAGES,
    icon: 'right-eye',
    label: 'Right Eye Images',
    padding: 'pt-[1px]',
  },
  {
    title: STEPPER.LEFT_EYE_IMAGES,
    icon: 'left-eye',
    label: 'Left Eye Images',
    padding: 'pt-[1px]',
  },
  {
    title: STEPPER.COMMUNICATION_PREFERANCES,
    icon: 'communication',
    label: 'Communication Preferences',
    padding: 'pt-[3px]',
  },
  {
    title: STEPPER.SUBMIT_FILE,
    icon: 'submit-file',
    label: 'Submit File',
  },
];

export const commonSteps: FileInProgressSteps[] = [
  {
    title: FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES,
    icon: 'right-eye',
    label: FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES,
    icon: 'left-eye',
    label: FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM,
  },
];

export const rejectedFilesSteps: FileInProgressSteps[] = [
  {
    title: FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES,
    icon: 'right-eye',
    label: FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES,
    icon: 'left-eye',
    label: FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES,
  },
];

export const fileInProgressSteps: FileInProgressSteps[] = [
  ...commonSteps,
  {
    title: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  },
];

export const completedFilesSteps: FileInProgressSteps[] = [
  ...commonSteps,
  {
    title: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  },
];

export const viewFileSteps: FileInProgressSteps[] = [
  {
    title: FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
    disabled: true,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES,
    icon: 'right-eye',
    label: FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES,
    disabled: true,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES,
    icon: 'left-eye',
    label: FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES,
    disabled: true,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM,
    disabled: true,
  },
  {
    title: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  },
];

export const viewOnlyPatientFileSteps: FileInProgressSteps[] = [
  {
    title: STEPPER.REFERRAL_FORM,
    icon: 'referral-form',
    label: STEPPER.REFERRAL_FORM,
  },
  {
    title: STEPPER.RIGHT_EYE_IMAGES,
    icon: 'right-eye',
    label: STEPPER.RIGHT_EYE_IMAGES,
  },
  {
    title: STEPPER.LEFT_EYE_IMAGES,
    icon: 'left-eye',
    label: STEPPER.LEFT_EYE_IMAGES,
  },
  {
    title: STEPPER.COMMUNICATION_PREFERANCES,
    icon: 'communication',
    label: STEPPER.COMMUNICATION_PREFERANCES,
  },
  {
    title: STEPPER.PATIENT_CONSENT,
    icon: 'consent',
    label: STEPPER.PATIENT_CONSENT,
    disabled: true,
  },
  {
    title: STEPPER.PAYMENT,
    icon: 'payments',
    label: STEPPER.PAYMENT,
    disabled: true,
  },
  {
    title: STEPPER.SUBMIT_FILE,
    icon: 'submit-file',
    label: STEPPER.SUBMIT_FILE,
    disabled: true,
  },
];

export const viewPatientFileSteps: FileInProgressSteps[] = [
  {
    title: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  },
  {
    title: STEPPER.REFERRAL_FORM,
    icon: 'referral-form',
    label: STEPPER.REFERRAL_FORM,
  },
  {
    title: STEPPER.RIGHT_EYE_IMAGES,
    icon: 'right-eye',
    label: STEPPER.RIGHT_EYE_IMAGES,
  },
  {
    title: STEPPER.LEFT_EYE_IMAGES,
    icon: 'left-eye',
    label: STEPPER.LEFT_EYE_IMAGES,
  },
  {
    title: STEPPER.COMMUNICATION_PREFERANCES,
    icon: 'communication',
    label: STEPPER.COMMUNICATION_PREFERANCES,
  },
  {
    title: STEPPER.PATIENT_CONSENT,
    icon: 'consent',
    label: STEPPER.PATIENT_CONSENT,
    disabled: true,
  },
  {
    title: STEPPER.PAYMENT,
    icon: 'payments',
    label: STEPPER.PAYMENT,
    disabled: true,
  },
  {
    title: STEPPER.SUBMIT_FILE,
    icon: 'submit-file',
    label: STEPPER.SUBMIT_FILE,
    disabled: true,
  },
];

export const viewAndUpdateFileSteps: FileInProgressSteps[] = [
  {
    title: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
    icon: 'referral-form',
    label: FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  },
  {
    title: STEPPER.REFERRAL_FORM,
    icon: 'referral-form',
    label: STEPPER.REFERRAL_FORM,
  },
  {
    title: STEPPER.RIGHT_EYE_IMAGES,
    icon: 'right-eye',
    label: STEPPER.RIGHT_EYE_IMAGES,
  },
  {
    title: STEPPER.LEFT_EYE_IMAGES,
    icon: 'left-eye',
    label: STEPPER.LEFT_EYE_IMAGES,
  },
  {
    title: STEPPER.COMMUNICATION_PREFERANCES,
    icon: 'communication',
    label: STEPPER.COMMUNICATION_PREFERANCES,
  },
  {
    title: STEPPER.PATIENT_CONSENT,
    icon: 'consent',
    label: STEPPER.PATIENT_CONSENT,
    disabled: true,
  },
  {
    title: STEPPER.PAYMENT,
    icon: 'payments',
    label: STEPPER.PAYMENT,
    disabled: true,
  },
  {
    title: STEPPER.SUBMIT_FILE,
    icon: 'submit-file',
    label: STEPPER.SUBMIT_FILE,
    disabled: false,
  },
];

export const allCompletedStepsForOpto = [
  FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  STEPPER.REFERRAL_FORM,
  STEPPER.LEFT_EYE_IMAGES,
  STEPPER.RIGHT_EYE_IMAGES,
  STEPPER.COMMUNICATION_PREFERANCES,
  STEPPER.PATIENT_CONSENT,
  STEPPER.PAYMENT,
  STEPPER.SUBMIT_FILE,
];

export const allCompletedSteps = [
  FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
  FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES,
  FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES,
  FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM,
  FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
];

export const Loginas = [
  { label: t('translation.optometrist'), value: 'optometrist' },
  { label: t('translation.doctor'), value: 'doctor' },
  { label: t('translation.reader'), value: 'reader' },
  { label: t('translation.practice'), value: 'practice' },
];

export const optometristPracticesOptions = [
  {
    label: "Optometrist's Practice name 1",
    value: "Optometrist's Practice name 1",
  },
  {
    label: "Optometrist's Practice name 2",
    value: "Optometrist's Practice name 2",
  },
  {
    label: "Optometrist's Practice name 3",
    value: "Optometrist's Practice name 3",
  },
  {
    label: "Optometrist's Practice name 4",
    value: "Optometrist's Practice name 4",
  },
];

export const createPatientSteps: STEPPER[] = [
  STEPPER.PATIENT_CONSENT,
  STEPPER.REFERRAL_FORM,
  STEPPER.LEFT_EYE_IMAGES,
  STEPPER.RIGHT_EYE_IMAGES,
  STEPPER.COMMUNICATION_PREFERANCES,
  STEPPER.PAYMENT,
  STEPPER.SUBMIT_FILE,
];

export const ethnicityOptions = [
  { label: 'Caucasian', value: ETHNICITY.caucasian },
  { label: 'East Asian', value: ETHNICITY.east_asian },
  { label: 'African', value: ETHNICITY.african },
  {
    label: 'Mixed Caucasian/East Asian',
    value: ETHNICITY.mixed_caucasian_east_asian,
  },
  {
    label: 'Mixed Caucasian/African',
    value: ETHNICITY.mixed_caucasian_african,
  },
  {
    label: 'Mixed East Asian/African',
    value: ETHNICITY.mixed_east_asian_east_asian,
  },
  {
    label: 'Mixed Caucasian/Other non-relevant ethnicity',
    value: ETHNICITY.mixed_caucasian_other_non_relevant_ethnicity,
  },
  {
    label: 'Mixed East Asian/Other non-relevant ethnicity',
    value: ETHNICITY.mixed_east_asian_other_non_relevant_ethnicity,
  },
  {
    label: 'Mixed African/Other non-relevant ethnicity',
    value: ETHNICITY.mixed_african_other_non_relevant_ethnicity,
  },
  { label: 'Non-relevant ethnicity', value: ETHNICITY.non_relevant_ethnicity },
];

export const genderOptions = [
  { label: 'Female', value: GENDER.female },
  { label: 'Male', value: GENDER.male },
];

export const salutationOptions = [
  {
    label: t('translation.mr'),
    value: SALUTAION.MR,
  },
  {
    label: t('translation.mrs'),
    value: SALUTAION.MRS,
  },
  {
    label: t('translation.miss'),
    value: SALUTAION.MISS,
  },
  {
    label: t('translation.ms'),
    value: SALUTAION.MS,
  },
];

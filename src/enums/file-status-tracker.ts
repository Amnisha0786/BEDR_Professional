import { ACTION_TO_BE_TAKEN } from './file-in-progress';

export enum POSSIBLE_STATUS {
  SUBMITTED = 'submitted',
  DRAFT = 'draft',
  URGENT_REFERRAL = 'urgent_referral',
  NON_URGENT_REFERRAL = 'non_urgent_referral',
  CARE_DELEGATED = 'care_delegated_to_optometrist',
  REASSURE = 'reassure_and_discharge',
  SOMETHING_WRONG_WITH_FILE = 'rejected_due_to_something_wrong_with_file',
  MEDIA_OPACITY = 'rejected_due_to_media_opacity',
  REFERRED = 'referred',
  PENDING_APPROVAL = 'pending_approval',
  IN_REVIEW_BY_DOCTOR = 'in_review_by_doctor',
  IN_REVIEW_BY_READER = 'in_review_by_reader',
  SUBMITTED_BY_OPTO = 'submitted_by_optometrist',
  APPROVED = 'approved',
}

export const REFERRED_FILES = [
  ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
  ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
];

export const VIEW_ONLY_FILES_STATUS = [
  POSSIBLE_STATUS.SUBMITTED,
  POSSIBLE_STATUS.PENDING_APPROVAL,
  POSSIBLE_STATUS.IN_REVIEW_BY_DOCTOR,
  POSSIBLE_STATUS.IN_REVIEW_BY_READER,
  POSSIBLE_STATUS.SUBMITTED_BY_OPTO,
  POSSIBLE_STATUS.APPROVED,
];

export const FILE_STATUSES = [
  {
    label: 'Submitted',
    value: POSSIBLE_STATUS.SUBMITTED,
  },
  {
    label: 'Submitted',
    value: POSSIBLE_STATUS.PENDING_APPROVAL,
  },
  {
    label: 'Submitted',
    value: POSSIBLE_STATUS.IN_REVIEW_BY_DOCTOR,
  },
  {
    label: 'Submitted',
    value: POSSIBLE_STATUS.IN_REVIEW_BY_READER,
  },
  {
    label: 'Awaiting submission',
    value: POSSIBLE_STATUS.DRAFT,
  },
  {
    label: 'Urgent referral pending',
    value: POSSIBLE_STATUS.URGENT_REFERRAL,
  },
  {
    label: 'Non-urgent referral pending',
    value: POSSIBLE_STATUS.NON_URGENT_REFERRAL,
  },
  {
    label: 'Care delegated to optom',
    value: POSSIBLE_STATUS.CARE_DELEGATED,
  },
  {
    label: 'Reassure & discharge',
    value: POSSIBLE_STATUS.REASSURE,
  },
  {
    label: 'Rejected: resubmit',
    value: POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE,
  },
  {
    label: 'Rejected: media opacity',
    value: POSSIBLE_STATUS.MEDIA_OPACITY,
  },
  {
    label: 'Referred',
    value: POSSIBLE_STATUS.REFERRED,
  },
  {
    label: 'Pending',
    value: POSSIBLE_STATUS.SUBMITTED_BY_OPTO,
  },
];

export const MOVE_FILES_LIST = [
  POSSIBLE_STATUS.CARE_DELEGATED,
  POSSIBLE_STATUS.REASSURE,
  POSSIBLE_STATUS.REFERRED,
  POSSIBLE_STATUS.MEDIA_OPACITY,
];

export const VIEW_FILE_LIST = [
  POSSIBLE_STATUS.MEDIA_OPACITY,
  POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE,
  POSSIBLE_STATUS.DRAFT,
];

export const VIEW_REPORT_LIST = [
  ...VIEW_FILE_LIST,
  POSSIBLE_STATUS.CARE_DELEGATED,
  POSSIBLE_STATUS.REASSURE,
  POSSIBLE_STATUS.REFERRED,
  POSSIBLE_STATUS.URGENT_REFERRAL,
  POSSIBLE_STATUS.NON_URGENT_REFERRAL,
  POSSIBLE_STATUS.APPROVED,
];

export const REMOVE_FROM_FILE_STATUS_TRACKER_COUNT = [
  POSSIBLE_STATUS.SUBMITTED,
  POSSIBLE_STATUS.PENDING_APPROVAL,
  POSSIBLE_STATUS.IN_REVIEW_BY_DOCTOR,
  POSSIBLE_STATUS.IN_REVIEW_BY_READER,
  POSSIBLE_STATUS.DRAFT,
];

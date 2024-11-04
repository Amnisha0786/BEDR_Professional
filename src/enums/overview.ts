import {
  CLOSE_FILE,
  ISSUE_DESCRIPTION,
  SOMETHING_WRONG_WITH,
} from './file-in-progress';

export enum OVERVIEW_FILE_NAME {
  URGENT_ACTION = 'urgent-referrals-requiring-action',
  NON_URGENT_ACTION = 'non-rgent-referrals-requiring-action',
  UNREAD_ACTION = 'unread-diagnosis-reports',
  FILE_RESUBMISSION = 'files-requiring-new-images-for-resubmission',
}

export const ISSUE = [
  {
    label: CLOSE_FILE.FUNDUS_IMAGE,
    value: SOMETHING_WRONG_WITH.FUNDUS_IMAGE,
  },
  {
    label: CLOSE_FILE.OCT_VIDEO,
    value: SOMETHING_WRONG_WITH.OCT_VIDEO,
  },
  {
    label: CLOSE_FILE.OPTIC_DISC_IMAGE,
    value: SOMETHING_WRONG_WITH.OPTIC_DISC_IMAGE,
  },
  {
    label: CLOSE_FILE.VISUAL_TEST_FIELD,
    value: SOMETHING_WRONG_WITH.VISUAL_TEST_FIELD,
  },
  {
    label: CLOSE_FILE.IOP,
    value: SOMETHING_WRONG_WITH.IOP,
  },
  {
    label: CLOSE_FILE.THICKNESS_MAP,
    value: SOMETHING_WRONG_WITH.THICKNESS_MAP,
  },
];

export const DESCRIPTION = [
  {
    label: 'is missing',
    value: ISSUE_DESCRIPTION.IS_MISSING,
  },
  {
    label: 'is unclear',
    value: ISSUE_DESCRIPTION.IS_POOR_QUALITY,
  },
];

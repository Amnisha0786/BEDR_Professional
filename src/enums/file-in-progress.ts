export enum FILE_IN_PROGRESS_STEPS {
  REFERRAL_FORM = 'Referral Form',
  LEFT_EYE_IMAGES = 'Left Eye Images',
  RIGHT_EYE_IMAGES = 'Right Eye Images',
  DRAFT_DIAGNOSIS_FORM = 'Draft Diagnosis Form',
  DIAGNOSIS_REPORT = 'Diagnosis Report',
}

export enum COLOR_CODING {
  BLUE = 'blue',
  RED = 'red',
  GREEN = 'green',
  YELLOW = 'yellow',
}

export enum DIAGNOSIS {
  NONE = 'none',
  WETAMD = 'wetamd',
  PROLIFERATIVE = 'proliferative_diabetic_retinopath',
  NON_PROLIFERATIVE = 'severe_non_proliferative_diabetic_retinopath',
  MILD_TO_MODERATE = 'mild_or_moderate_diabetic_retinopath',
  RVO = 'rvo',
  DIABETIC_MASCULAR_OEDEMA = 'diabetic_macular_oedema',
  GLAUCOMA = 'glaucoma',
  EARLY_DRYMD = 'early_dryamd',
  INTERMEDIATE_DRYMD = 'intermediate_dryamd',
  ADVANCED_DRYMD = 'advanced_dry_amd',
  NAD = 'nothing_abnormal_detected',
}

export enum ACTION_TO_BE_TAKEN {
  URGENT_REFERRAL = 'urgent_referral',
  ROUTINE_REFERRAL = 'non_urgent_referral',
  CARE = 'care_delegated_to_optometrist',
  DISCHARGE = 'reassure_and_discharge',
}

export enum ADVICE_TO_OPTOMETRIST {
  WAIT_SEE = 'wait_and_see',
  PATIENT_TO_RETURN = 'patient_to_return_urgently',
  REASSURE = 'reassure',
}

export enum READER_CONFIDENCE {
  SURE = 'true',
  NOT_SURE = 'false',
}

export enum DRAFT_DIAGNOSIS_FORM {
  RIGHT_EYE_ONLY = 'Right eye only',
  LEFT_EYE_ONLY = 'Left eye only',
  BOTH_EYES = 'Both eyes',
  WETAMD = 'WetAMD',
  PROLIFERATIVE = 'Proliferative Diabetic Retinopathy',
  NON_PROLIFERATIVE = 'Severe Non-Proliferative Diabetic Retinopathy',
  MILD_TO_MODERATE = 'Mild or Moderate Diabetic Retinopathy',
  RVO = 'RVO',
  DIABETIC_MASCULAR_OEDEMA = 'Diabetic Macular Oedema',
  GLAUCOMA = 'Glaucoma',
  EARLY_DRYMD = 'Early DryAMD',
  INTERMEDIATE_DRYMD = 'Intermediate DryAMD',
  NAD = 'Nothing Abnormal Detected',
  ADVANCED_DRYMD = 'Advanced DryAMD',
  DIABETIC_RETINOPATHY = 'Diabetic retinopathy',
  CATARACT = 'Cataract',
  GEOGRAPHIC_ATROPHY = 'Geographic Atrophy',
  OTHER = 'Other',
  NONE = 'None',
  URGENT_REFERRAL = 'Urgent referral',
  ROUTINE_REFERRAL = 'Non-Urgent referral',
  CARE = 'Care delegated to optometrist',
  DISCHARGE = 'Reassure and discharge',
  WAIT_SEE = 'Wait and see',
  PATIENT_TO_RETURN = 'Patient to return urgently in event of change in vision',
  REASSURE = 'Reassure',
  BOOK_PATIENT = 'Book patient for a OCT/OCTA ',
  SURE = 'Sure',
  NOT_SURE = 'Not sure',
}

export enum CLOSE_FILE {
  RUN_OUT_OF_TIME = "I've run out of time",
  SOMETHING_WRONG_WITH_FILE = 'There is something wrong with the file',
  OUTSIDE_AREA_OF_EXPERTISE = 'This diagnosis is outside my area of expertise',
  MEDIA_OPACITY = 'Patient cannot be diagnosed because of media opacity',
  FUNDUS_IMAGE = 'Fundus image',
  OCT_VIDEO = 'OCT video',
  THICKNESS_MAP = 'Thickness map',
  IOP = 'IOP',
  OPTIC_DISC_IMAGE = 'Optic disc image',
  VISUAL_TEST_FIELD = 'Visual field test',
  RIGHT_EYE = 'Right eye',
  LEFT_EYE = 'Left eye',
  BOTH_EYES = 'Both eyes',
  IS_MISSING = 'Is missing',
  IS_POOR_QUALITY = 'Is poor quality',
}

export enum ISSUE_DESCRIPTION {
  IS_MISSING = 'is_missing',
  IS_POOR_QUALITY = 'is_poor_quality',
}

export enum SOMETHING_WRONG_WITH {
  FUNDUS_IMAGE = 'fundus_image',
  OCT_VIDEO = 'oct_video',
  THICKNESS_MAP = 'thickness_map',
  IOP = 'iop',
  OPTIC_DISC_IMAGE = 'optic_disc_image',
  VISUAL_TEST_FIELD = 'visual_field_test',
}

export enum REASON_TO_CANCEL {
  DUE_TO_RUN_OUT_OF_TIME = 'skipped_due_to_run_out_of_time',
  DUE_TO_OTSIDE_AREA_OF_EXPERTISE = 'skipped_due_to_outside_area_of_expertise',
  DUE_TO_SOMETHING_WRONG_WITH_FILE = 'rejected_due_to_something_wrong_with_file',
  DUE_TO_DESKTOP_ONLY_VIEW = 'rejected_due_to_file_can_be_viewed_on_desktop_only',
  DUE_TO_MEDIA_OPACITY = 'rejected_due_to_media_opacity',
}

const COMMON_DIAGNOSIS_OPTIONS = [
  { label: DRAFT_DIAGNOSIS_FORM.WETAMD, value: DIAGNOSIS.WETAMD },
  {
    label: DRAFT_DIAGNOSIS_FORM.PROLIFERATIVE,
    value: DIAGNOSIS.PROLIFERATIVE,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.NON_PROLIFERATIVE,
    value: DIAGNOSIS.NON_PROLIFERATIVE,
  },

  {
    label: DRAFT_DIAGNOSIS_FORM.MILD_TO_MODERATE,
    value: DIAGNOSIS.MILD_TO_MODERATE,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.RVO,
    value: DIAGNOSIS.RVO,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.DIABETIC_MASCULAR_OEDEMA,
    value: DIAGNOSIS.DIABETIC_MASCULAR_OEDEMA,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.GLAUCOMA,
    value: DIAGNOSIS.GLAUCOMA,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.EARLY_DRYMD,
    value: DIAGNOSIS.EARLY_DRYMD,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.ADVANCED_DRYMD,
    value: DIAGNOSIS.ADVANCED_DRYMD,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.INTERMEDIATE_DRYMD,
    value: DIAGNOSIS.INTERMEDIATE_DRYMD,
  },
];

export const COMMON_ACTION_TO_BE_TAKEN_OPTIONS = [
  {
    label: DRAFT_DIAGNOSIS_FORM.URGENT_REFERRAL,
    value: ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.ROUTINE_REFERRAL,
    value: ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
  },
  {
    label: DRAFT_DIAGNOSIS_FORM.CARE,
    value: ACTION_TO_BE_TAKEN.CARE,
  },

  {
    label: DRAFT_DIAGNOSIS_FORM.DISCHARGE,
    value: ACTION_TO_BE_TAKEN.DISCHARGE,
  },
];

export const DIAGNOSIS_OPTIONS = [
  ...COMMON_DIAGNOSIS_OPTIONS,
  {
    label: DRAFT_DIAGNOSIS_FORM.NAD,
    value: DIAGNOSIS.NAD,
  },
];

export const OTHER_OPTHALMIC_CONDITIONS = [
  { label: DRAFT_DIAGNOSIS_FORM.NONE, value: DIAGNOSIS.NONE },
  ...COMMON_DIAGNOSIS_OPTIONS,
];

export const LEFT_EYE_TABS_OPTIONS = [
  {
    title: 'Fundus and OCT scan',
    value: 'fundusImage',
    mutipleValue: 'octVideo',
  },
  { title: 'Retinal Thickness Map', value: 'thicknessMap' },
  { title: 'Optic Disc Image', value: 'opticDiscImage' },
  { title: 'Visual Field Test', value: 'visualFieldTest' },
  { title: 'Dicom File(retina)', value: 'dicomFile' },
  { title: 'OCT Video(disc)', value: '', mutipleValue: 'discOctVideo' },
  { title: 'Thickness Profile', value: 'discThicknessProfile' },
  { title: 'Dicom File(disc)', value: 'discDicomFile' },
  { title: 'Other Image', value: 'addAnotherImage' },
];

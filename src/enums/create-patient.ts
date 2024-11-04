export enum STEPPER {
  PATIENT_CONSENT = 'Patient Consent',
  REFERRAL_FORM = 'Referral Form',
  LEFT_EYE_IMAGES = 'Left Eye Images',
  RIGHT_EYE_IMAGES = 'Right Eye Images',
  COMMUNICATION_PREFERANCES = 'Communication Preferences',
  SUBMIT_FILE = 'Submit File',
  PAYMENT = 'Payment',
  REFERRAL_CONFIRM = 'Referral Confirmed',
}

export enum VISION_TYPE {
  log_mar = 'log_mar',
  snellen = 'snellen',
  corrected_vision = 'corrected_vision',
}

export enum VISION_AFFECTED {
  no = 'no',
  blurred = 'blurred',
  patch_curtain = 'patch_curtain',
  distortion = 'distortion',
  total_loss = 'total_loss',
  sudden_onset_loss_of_vision = 'sudden_onset_loss_of_vision',
  double_vision_ghosting = 'double_vision_ghosting',
}

export enum AFFECTED_EYE {
  RIGHT = 'right',
  LEFT = 'left',
  BOTH_EYES = 'both_eyes',
  NA = 'n_a',
}

export enum SYMPTOMS_DURATION {
  under_one_week = 'under_one_week',
  one_to_two_weeks = 'one_to_two_weeks',
  more_than_52_weeks = 'more_than_52_weeks',
}

export enum POSSIBLE_SYMPTOMS_DURATION {
  under_one_week = 'under_one_week',
  one_to_two_weeks = 'one_to_two_weeks',
  more_than_52_weeks = 'more_than_52_weeks',
  NA = 'n_a',
}

export enum VISUAL_IMPAIRMENT {
  none = 'none',
  floaters = 'floaters',
  flashes = 'flashes',
  sensitive_to_light = 'sensitive_to_light',
  previous_occurence = 'previous_occurence',
}

export enum PAIN {
  none = 'none',
  mild = 'mild',
  moderate = 'moderate',
  severe = 'severe',
}

export enum YES_NO {
  yes = 'yes',
  no = 'no',
}

export enum PAST_EYE_HISTORY {
  none = 'none',
  cataract = 'cataract',
  glaucoma = 'glaucoma',
  diabetic_retinopath = 'diabetic_retinopath',
  dryamd = 'dryamd',
  wetamd = 'wetamd',
}

export enum MEDICAL_FAMILY_HISTORY {
  n_a = 'n_a',
  hypertension = 'hypertension',
  dvt = 'dvt',
  stroke = 'stroke',
  memory_loss = 'memory_loss',
  diabetes = 'diabetes',
}

export enum LIFESTYLE {
  smoker = 'smoker',
  former_smoker = 'former_smoker',
  drugs = 'drugs',
  alcohol = 'alcohol',
}

export enum NOTIFICATION_MEDIUM {
  email = 'email',
  text_message = 'text_message',
  email_and_text_message = 'email_and_text_message',
}
export enum RECEIVING_DIAGNOSIS_MEDIUM {
  email = 'email',
  app = 'app',
  email_and_app = 'email_and_app',
}

export enum REFERRAL_FORM {
  LogMAR = 'LogMAR',
  Snellen = 'Snellen',
  Corrected_Vision = 'Corrected Vision',

  No = 'No',
  Blurred = 'Blurred',
  Patch_Curtain = 'Patch/Curtain',
  Distortion = 'Distortion',
  Total_loss = 'Total loss',
  Sudden_onset_loss_of_vision = 'Sudden onset loss of vision',
  Double_vision_ghosting = 'Double vision/ghosting',

  Right_eye = 'Right eye',
  Left_eye = 'Left eye',
  Both_eyes = 'Both eyes',

  Less_than_week = '<1 week',
  Weeks = '1-2 weeks',
  Greater_than_52weeks = '>52 weeks',
  Between_3and52 = '3-52 weeks',

  None = 'None',
  Floaters = 'Floaters',
  Flashes = 'Flashes',
  Sensitive_to_light = 'Sensitive to light',
  Previous_occurrence = 'Previous occurrence',

  Mild = 'Mild',
  Moderate = 'Moderate',
  Severe = 'Severe',

  Yes = 'Yes',
  Cataract = 'Cataract',
  Glaucoma = 'Glaucoma',
  Diabetic_retinopathy = 'Diabetic retinopathy',
  DryAMD = 'DryAMD',
  WetAMD = 'WetAMD',

  NA = 'N/A',
  Hypertension = 'Hypertension',
  DVT = 'DVT',
  Stroke = 'Stroke',
  Memory_loss = 'Memory loss',
  Diabetes = 'Diabetes',

  Smoker = 'Smoker',
  Former_smoker = 'Former smoker',
  Drugs = 'Drugs',
  Alcohol = 'Alcohol',
  Other = 'Other',
  Allergies = 'Allergies',
}

export const visionAffectedOptions = [
  { label: REFERRAL_FORM.No, value: VISION_AFFECTED.no },
  {
    label: REFERRAL_FORM.Blurred,
    value: VISION_AFFECTED.blurred,
  },
  {
    label: REFERRAL_FORM.Patch_Curtain,
    value: VISION_AFFECTED.patch_curtain,
  },
  {
    label: REFERRAL_FORM.Distortion,
    value: VISION_AFFECTED.distortion,
  },
  { label: REFERRAL_FORM.Total_loss, value: VISION_AFFECTED.total_loss },
  {
    label: REFERRAL_FORM.Sudden_onset_loss_of_vision,
    value: VISION_AFFECTED.sudden_onset_loss_of_vision,
  },
  {
    label: REFERRAL_FORM.Double_vision_ghosting,
    value: VISION_AFFECTED.double_vision_ghosting,
  },
];

export const doAnyOfTheseApply = [
  { label: REFERRAL_FORM.None, value: VISUAL_IMPAIRMENT.none },
  { label: REFERRAL_FORM.Floaters, value: VISUAL_IMPAIRMENT.floaters },
  { label: REFERRAL_FORM.Flashes, value: VISUAL_IMPAIRMENT.flashes },
  {
    label: REFERRAL_FORM.Sensitive_to_light,
    value: VISUAL_IMPAIRMENT.sensitive_to_light,
  },
  {
    label: REFERRAL_FORM.Previous_occurrence,
    value: VISUAL_IMPAIRMENT.previous_occurence,
  },
];

export const pastEyeHistoryOptions = [
  { label: REFERRAL_FORM.None, value: PAST_EYE_HISTORY.none },
  { label: REFERRAL_FORM.Cataract, value: PAST_EYE_HISTORY.cataract },
  { label: REFERRAL_FORM.Glaucoma, value: PAST_EYE_HISTORY.glaucoma },
  {
    label: REFERRAL_FORM.Diabetic_retinopathy,
    value: PAST_EYE_HISTORY.diabetic_retinopath,
  },
  {
    label: REFERRAL_FORM.DryAMD,
    value: PAST_EYE_HISTORY.dryamd,
  },
  {
    label: REFERRAL_FORM.WetAMD,
    value: PAST_EYE_HISTORY.wetamd,
  },
];

export const medicalFamilyHistoryOptions = [
  { label: REFERRAL_FORM.NA, value: MEDICAL_FAMILY_HISTORY.n_a },
  {
    label: REFERRAL_FORM.Hypertension,
    value: MEDICAL_FAMILY_HISTORY.hypertension,
  },
  { label: REFERRAL_FORM.DVT, value: MEDICAL_FAMILY_HISTORY.dvt },
  {
    label: REFERRAL_FORM.Stroke,
    value: MEDICAL_FAMILY_HISTORY.stroke,
  },
  {
    label: REFERRAL_FORM.Memory_loss,
    value: MEDICAL_FAMILY_HISTORY.memory_loss,
  },
  {
    label: REFERRAL_FORM.Diabetes,
    value: MEDICAL_FAMILY_HISTORY.diabetes,
  },
];

export const lifestyleOptions = [
  { label: REFERRAL_FORM.Smoker, value: LIFESTYLE.smoker },
  {
    label: REFERRAL_FORM.Former_smoker,
    value: LIFESTYLE.former_smoker,
  },
  { label: REFERRAL_FORM.Drugs, value: LIFESTYLE.drugs },
  {
    label: REFERRAL_FORM.Alcohol,
    value: LIFESTYLE.alcohol,
  },
];

export enum COMMUNICATION_PREFERENCES {
  MAIL = 'Email',
  TEXT = 'Text message',
  IN_THE_APP = 'In the app',
  BOTH = 'By email and in the app',
  MAIL_TEXT = 'By email and text',
}

export enum REQUEST_FILE_STATUS {
  IN_PROGRESS = 'in_progress',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  SUBMITTED_BY_OPTOM = 'submitted_by_optometrist',
  SUBMITTED_BY_IPAD = 'submitted_by_practice',
}

export const AVI_MIME_TYPES = [
  'video/avi',
  'video/msvideo',
  'video/x-msvideo',
  'application/x-troff-msvideo',
  'video/quicktime',
  'video/x-quicktime',
  'image/mov',
  'audio/aiff',
  'audio/x-midi',
  'audio/x-wav',
];

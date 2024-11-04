import {
  LIFESTYLE,
  PAIN,
  SYMPTOMS_DURATION,
  VISION_AFFECTED,
  VISUAL_IMPAIRMENT,
  YES_NO,
} from '@/enums/create-patient';
import { COLOR_CODING } from '@/enums/file-in-progress';
import {
  TIntraocularPressure,
  TReferralForm,
} from '@/models/types/create-patient-forms';
import { TColorObj } from '@/models/types/file-in-progress';

export const getReferralFormColorCoding = (
  key: keyof TReferralForm,
  value: string[] | string | TIntraocularPressure,
) => {
  const colorObj: TColorObj = {
    rightEyeVision: COLOR_CODING.BLUE,
    leftEyeVision: COLOR_CODING.BLUE,
    visionScaleType: {
      log_mar: COLOR_CODING.BLUE,
      snellen: COLOR_CODING.BLUE,
    },
    isCorrectedVision: COLOR_CODING.BLUE,
    affectedVision: {
      no: COLOR_CODING.GREEN,
      blurred: COLOR_CODING.BLUE,
      patch_curtain: COLOR_CODING.RED,
      distortion: COLOR_CODING.RED,
      total_loss: COLOR_CODING.RED,
      sudden_onset_loss_of_vision: COLOR_CODING.RED,
      double_vision_ghosting: COLOR_CODING.RED,
    },
    visualImpairment: {
      none: COLOR_CODING?.GREEN,
      floaters: COLOR_CODING?.BLUE,
      flashes: COLOR_CODING?.RED,
      sensitive_to_light: COLOR_CODING?.YELLOW,
      previous_occurence: COLOR_CODING?.BLUE,
    },
    durationOfSymptoms: COLOR_CODING.BLUE,
    pastEyeHistory: {
      none: COLOR_CODING.BLUE,
      cataract: COLOR_CODING.BLUE,
      glaucoma: COLOR_CODING.BLUE,
      diabetic_retinopath: COLOR_CODING.BLUE,
      dryamd: COLOR_CODING.BLUE,
      wetamd: COLOR_CODING.BLUE,
    },
    medicalHistory: {
      n_a: COLOR_CODING.BLUE,
      hypertension: COLOR_CODING.BLUE,
      dvt: COLOR_CODING.BLUE,
      stroke: COLOR_CODING.BLUE,
      memory_loss: COLOR_CODING.BLUE,
      diabetes: COLOR_CODING.BLUE,
    },
    familyHistory: {
      n_a: COLOR_CODING.BLUE,
      hypertension: COLOR_CODING.BLUE,
      dvt: COLOR_CODING.BLUE,
      stroke: COLOR_CODING.BLUE,
      memory_loss: COLOR_CODING.BLUE,
      diabetes: COLOR_CODING.BLUE,
    },
    lifestyle: {
      smoker: COLOR_CODING.RED,
      former_smoker: COLOR_CODING.RED,
      drugs: COLOR_CODING.BLUE,
      alcohol: COLOR_CODING.BLUE,
    },
    intraocularPressure: {
      leftEye: COLOR_CODING.BLUE,
      rightEye: COLOR_CODING.BLUE,
    },
    affectedEye: COLOR_CODING.BLUE,
    redness: COLOR_CODING.BLUE,
    pain: COLOR_CODING.RED,
    currentTreatmentForEyes: COLOR_CODING.BLUE,
  };

  switch (key) {
    case 'affectedVision':
      if (Array.isArray(value)) {
        value?.map((item) => {
          switch (item) {
            case VISION_AFFECTED.no:
              colorObj.affectedVision.no = COLOR_CODING.GREEN;
              break;
            case VISION_AFFECTED.blurred:
              colorObj.affectedVision.blurred = COLOR_CODING.BLUE;
              break;
            case VISION_AFFECTED.distortion:
              colorObj.affectedVision.distortion = COLOR_CODING.RED;
              break;
            case VISION_AFFECTED.patch_curtain:
              colorObj.affectedVision.patch_curtain = COLOR_CODING.RED;
              break;
            case VISION_AFFECTED.total_loss:
              colorObj.affectedVision.total_loss = COLOR_CODING.RED;
              break;
            case VISION_AFFECTED.double_vision_ghosting:
              colorObj.affectedVision.double_vision_ghosting = COLOR_CODING.RED;
              break;
            case VISION_AFFECTED.sudden_onset_loss_of_vision:
              colorObj.affectedVision.double_vision_ghosting = COLOR_CODING.RED;
              break;
          }
        });
        return colorObj['affectedVision'];
      }
      break;
    case 'durationOfSymptoms':
      if (typeof value === 'string') {
        switch (value) {
          case SYMPTOMS_DURATION.under_one_week:
            colorObj.durationOfSymptoms = COLOR_CODING.RED;
            break;
          case SYMPTOMS_DURATION.one_to_two_weeks:
            colorObj.durationOfSymptoms = COLOR_CODING.RED;
            break;
          case SYMPTOMS_DURATION.more_than_52_weeks:
            colorObj.durationOfSymptoms = COLOR_CODING.BLUE;
            break;
          default:
            colorObj.durationOfSymptoms = COLOR_CODING.BLUE;
            break;
        }
        return colorObj['durationOfSymptoms'];
      }
      break;
    case 'affectedEye':
      if (typeof value === 'string') {
        switch (value) {
          case SYMPTOMS_DURATION?.under_one_week:
            colorObj.affectedEye = COLOR_CODING.BLUE;
            break;
          case SYMPTOMS_DURATION.one_to_two_weeks:
            colorObj.affectedEye = COLOR_CODING.BLUE;
            break;
          case SYMPTOMS_DURATION.more_than_52_weeks:
            colorObj.affectedEye = COLOR_CODING.BLUE;
            break;
        }
        return colorObj['affectedEye'];
      }
      break;
    case 'pain':
      if (typeof value === 'string') {
        switch (value) {
          case PAIN.none:
            colorObj.pain = COLOR_CODING.GREEN;
            break;
          case PAIN.mild:
            colorObj.pain = COLOR_CODING.YELLOW;
            break;
          case PAIN.moderate:
            colorObj.pain = COLOR_CODING.RED;
            break;
          case PAIN.severe:
            colorObj.pain = COLOR_CODING.RED;
            break;
        }
        return colorObj['pain'];
      }
      break;
    case 'redness':
      if (typeof value === 'string') {
        switch (value) {
          case YES_NO.yes:
            colorObj.redness = COLOR_CODING.RED;
            break;
          case YES_NO.no:
            colorObj.redness = COLOR_CODING.GREEN;
            break;
        }
        return colorObj['redness'];
      }
      break;
    case 'currentTreatmentForEyes':
      if (typeof value === 'string') {
        switch (value) {
          case YES_NO.yes:
            colorObj.currentTreatmentForEyes = COLOR_CODING.BLUE;
            break;
          case YES_NO.no:
            colorObj.currentTreatmentForEyes = COLOR_CODING.BLUE;
            break;
        }
        return colorObj['currentTreatmentForEyes'];
      }
      break;
    case 'visualImpairment':
      if (Array.isArray(value)) {
        value?.map((item) => {
          switch (item) {
            case VISUAL_IMPAIRMENT.none:
              colorObj.visualImpairment.none = COLOR_CODING.GREEN;
              break;
            case VISUAL_IMPAIRMENT.flashes:
              colorObj.visualImpairment.flashes = COLOR_CODING.RED;
              break;
            case VISUAL_IMPAIRMENT.floaters:
              colorObj.visualImpairment.floaters = COLOR_CODING.BLUE;
              break;
            case VISUAL_IMPAIRMENT.sensitive_to_light:
              colorObj.visualImpairment.sensitive_to_light =
                COLOR_CODING.YELLOW;
              break;
            case VISUAL_IMPAIRMENT.previous_occurence:
              colorObj.visualImpairment.previous_occurence = COLOR_CODING.BLUE;
              break;
          }
        });
        return colorObj['visualImpairment'];
      }
      break;
    case 'intraocularPressure':
      if (typeof value !== 'string' && !Array.isArray(value)) {
        if (value?.leftEye || value?.rightEye) {
          const numberValueForLeftEye = value?.leftEye
            ? Number(value?.leftEye)
            : 0;
          const numberValueForRightEye = value?.rightEye
            ? Number(value?.rightEye)
            : 0;
          if (value?.leftEye) {
            if (numberValueForLeftEye < 7) {
              colorObj.intraocularPressure.leftEye = COLOR_CODING.RED;
            } else if (
              numberValueForLeftEye >= 7 &&
              numberValueForLeftEye <= 20
            ) {
              colorObj.intraocularPressure.leftEye = COLOR_CODING.BLUE;
            } else if (
              numberValueForLeftEye >= 21 &&
              numberValueForLeftEye <= 24
            ) {
              colorObj.intraocularPressure.leftEye = COLOR_CODING.YELLOW;
            } else if (numberValueForLeftEye > 24) {
              colorObj.intraocularPressure.leftEye = COLOR_CODING.RED;
            }
          }
          if (value?.rightEye) {
            if (numberValueForRightEye < 7) {
              colorObj.intraocularPressure.rightEye = COLOR_CODING.RED;
            } else if (
              numberValueForRightEye >= 7 &&
              numberValueForRightEye <= 20
            ) {
              colorObj.intraocularPressure.rightEye = COLOR_CODING.BLUE;
            } else if (
              numberValueForRightEye >= 21 &&
              numberValueForRightEye <= 24
            ) {
              colorObj.intraocularPressure.rightEye = COLOR_CODING.YELLOW;
            } else if (numberValueForRightEye > 24) {
              colorObj.intraocularPressure.rightEye = COLOR_CODING.RED;
            }
          }
          return colorObj['intraocularPressure'];
        }
      }
      break;
    case 'pastEyeHistory':
      if (Array.isArray(value)) {
        value?.map((item) => {
          switch (item) {
            default:
              colorObj.pastEyeHistory.none = COLOR_CODING.BLUE;
              colorObj.pastEyeHistory.cataract = COLOR_CODING.BLUE;
              colorObj.pastEyeHistory.glaucoma = COLOR_CODING.BLUE;
              colorObj.pastEyeHistory.diabetic_retinopath = COLOR_CODING.BLUE;
              colorObj.pastEyeHistory.dryamd = COLOR_CODING.BLUE;
              colorObj.pastEyeHistory.wetamd = COLOR_CODING.BLUE;
              break;
          }
        });
        return colorObj['pastEyeHistory'];
      }
      break;
    case 'medicalHistory':
      if (Array.isArray(value)) {
        value?.map((item) => {
          switch (item) {
            default:
              colorObj.medicalHistory.n_a = COLOR_CODING.BLUE;
              colorObj.medicalHistory.hypertension = COLOR_CODING.BLUE;
              colorObj.medicalHistory.dvt = COLOR_CODING.BLUE;
              colorObj.medicalHistory.stroke = COLOR_CODING.BLUE;
              colorObj.medicalHistory.memory_loss = COLOR_CODING.BLUE;
              colorObj.medicalHistory.diabetes = COLOR_CODING.BLUE;
              break;
          }
        });
        return colorObj['medicalHistory'];
      }
      break;
    case 'familyHistory':
      if (Array.isArray(value)) {
        value?.map((item) => {
          switch (item) {
            default:
              colorObj.familyHistory.n_a = COLOR_CODING.BLUE;
              colorObj.familyHistory.hypertension = COLOR_CODING.BLUE;
              colorObj.familyHistory.dvt = COLOR_CODING.BLUE;
              colorObj.familyHistory.stroke = COLOR_CODING.BLUE;
              colorObj.familyHistory.memory_loss = COLOR_CODING.BLUE;
              colorObj.familyHistory.diabetes = COLOR_CODING.BLUE;
              break;
          }
        });
        return colorObj['familyHistory'];
      }
      break;
    case 'lifestyle':
      if (Array.isArray(value)) {
        value?.map((item) => {
          switch (item) {
            case LIFESTYLE.smoker:
              colorObj.lifestyle.smoker = COLOR_CODING.RED;
              break;
            case LIFESTYLE.former_smoker:
              colorObj.lifestyle.former_smoker = COLOR_CODING.RED;
              break;
            case LIFESTYLE.drugs:
              colorObj.lifestyle.drugs = COLOR_CODING.BLUE;
              break;
            case LIFESTYLE.alcohol:
              colorObj.lifestyle.alcohol = COLOR_CODING.BLUE;
              break;
          }
        });
        return colorObj['lifestyle'];
      }
      break;
    default:
      colorObj?.[key as keyof TColorObj];
  }
  return colorObj?.[key as keyof TColorObj];
};

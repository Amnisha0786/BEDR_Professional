import {
  MEDICAL_FAMILY_HISTORY,
  PAST_EYE_HISTORY,
  POSSIBLE_SYMPTOMS_DURATION,
  REFERRAL_FORM,
  STEPPER,
  VISION_TYPE,
  YES_NO,
} from '@/enums/create-patient';
import {
  TCommunicationPreferencesForm,
  TLeftEyeImagesForm,
  TLeftEyeImagesFormProgress,
  TReferralForm,
  TRegisterNewPatientForm,
  TRightEyeImagesForm,
} from '@/models/types/create-patient-forms';

export const getMetaData = (
  currentStep: string,
  data?: any,
):
  | TRegisterNewPatientForm
  | TReferralForm
  | TLeftEyeImagesForm
  | TRightEyeImagesForm
  | TCommunicationPreferencesForm
  | TLeftEyeImagesFormProgress
  | undefined => {
  let metadata;
  switch (currentStep) {
    case STEPPER.REFERRAL_FORM:
      metadata = {
        id: data?.referralForm?.id,
        rightEyeVision: data?.referralForm?.rightEyeVision,
        leftEyeVision: data?.referralForm?.leftEyeVision,
        isCorrectedVision: data?.referralForm?.isCorrectedVision
          ? VISION_TYPE.corrected_vision
          : undefined,
        visionScaleType:
          data?.referralForm?.visionScaleType || VISION_TYPE.snellen,
        affectedVision: data?.referralForm?.affectedVision,
        affectedEye: data?.referralForm?.affectedEye,
        durationOfSymptoms:
          data?.referralForm?.durationOfSymptoms &&
          (Object.values(POSSIBLE_SYMPTOMS_DURATION)?.includes(
            data?.referralForm?.durationOfSymptoms,
          )
            ? data?.referralForm?.durationOfSymptoms
            : REFERRAL_FORM.Between_3and52),
        durationBetween_3To_52Weeks: !Object.values(
          POSSIBLE_SYMPTOMS_DURATION,
        )?.includes(data?.referralForm?.durationOfSymptoms)
          ? data?.referralForm?.durationOfSymptoms
          : undefined,
        intraocularPressure: {
          rightEye: data?.referralForm?.rightEyeIntraocularPressure,
          leftEye: data?.referralForm?.leftEyeIntraocularPressure,
        },
        visualImpairment: data?.referralForm?.visualImpairment,
        pain: data?.referralForm?.pain,
        redness: data?.referralForm?.redness,
        pastEyeHistory:
          data?.referralForm?.pastEyeHistory &&
          data?.referralForm?.pastEyeHistory?.filter((item: PAST_EYE_HISTORY) =>
            Object.values(PAST_EYE_HISTORY)?.includes(item),
          ),
        otherPastEyeHistory:
          data?.referralForm?.pastEyeHistory &&
          data?.referralForm?.pastEyeHistory?.filter(
            (item: PAST_EYE_HISTORY) =>
              !Object.values(PAST_EYE_HISTORY)?.includes(item),
          )?.[0],
        whatTreatment: data?.referralForm?.treatment,

        currentTreatmentForEyes: !data?.referralForm?.treatment
          ? undefined
          : Object.values(YES_NO)?.includes(data?.referralForm?.treatment)
            ? (data?.referralForm?.treatment as string)
            : (YES_NO.yes as string),
        medicalHistory:
          data?.referralForm?.medicalHistory &&
          data?.referralForm?.medicalHistory?.filter(
            (item: MEDICAL_FAMILY_HISTORY) =>
              Object.values(MEDICAL_FAMILY_HISTORY)?.includes(item),
          ),
        otherMedicalHistory:
          data?.referralForm?.medicalHistory &&
          data?.referralForm?.medicalHistory?.filter(
            (item: MEDICAL_FAMILY_HISTORY) =>
              !Object.values(MEDICAL_FAMILY_HISTORY)?.includes(item),
          )?.[0],
        familyHistory:
          data?.referralForm?.familyHistory &&
          data?.referralForm?.familyHistory?.filter(
            (item: MEDICAL_FAMILY_HISTORY) =>
              Object.values(MEDICAL_FAMILY_HISTORY)?.includes(item),
          ),
        otherFamilyHistory:
          data?.referralForm?.familyHistory &&
          data?.referralForm?.familyHistory?.filter(
            (item: MEDICAL_FAMILY_HISTORY) =>
              !Object.values(MEDICAL_FAMILY_HISTORY)?.includes(item),
          )?.[0],
        lifestyle: data?.referralForm?.lifestyle,
        allergy: data?.referralForm?.allergy,
        remarks: data?.referralForm?.remarks,
      };
      break;
    case STEPPER.LEFT_EYE_IMAGES:
      metadata = {
        id: data?.leftEyeImages?.id ?? '',
        fundusImage: data?.leftEyeImages?.fundusImage ?? '',
        octVideo: data?.leftEyeImages?.octVideo ?? '',
        thicknessMap: data?.leftEyeImages?.thicknessMap ?? '',
        intraocularPressure: data?.leftEyeImages?.intraocularPressure || 0,
        opticDiscImage: data?.leftEyeImages?.opticDiscImage ?? '',
        dicomFile: data?.leftEyeImages?.dicomFile ?? '',
        visualFieldTest: data?.leftEyeImages?.visualFieldTest ?? '',
        discOctVideo: data?.leftEyeImages?.discOctVideo ?? '',
        discThicknessProfile: data?.leftEyeImages?.discThicknessProfile ?? '',
        discDicomFile: data?.leftEyeImages?.discDicomFile ?? '',
        addAnotherImage: data?.leftEyeImages?.addAnotherImage ?? '',
      };
      break;
    case STEPPER.RIGHT_EYE_IMAGES:
      metadata = {
        id: data?.rightEyeImages?.id,
        fundusImage: data?.rightEyeImages?.fundusImage ?? '',
        octVideo: data?.rightEyeImages?.octVideo ?? '',
        thicknessMap: data?.rightEyeImages?.thicknessMap ?? '',
        opticDiscImage: data?.rightEyeImages?.opticDiscImage ?? '',
        visualFieldTest: data?.rightEyeImages?.visualFieldTest ?? '',
        dicomFile: data?.rightEyeImages?.dicomFile ?? '',
        discOctVideo: data?.rightEyeImages?.discOctVideo ?? '',
        discThicknessProfile: data?.rightEyeImages?.discThicknessProfile ?? '',
        discDicomFile: data?.rightEyeImages?.discDicomFile ?? '',
        addAnotherImage: data?.rightEyeImages?.addAnotherImage ?? '',
      };
      break;
    case STEPPER.COMMUNICATION_PREFERANCES:
      metadata = {
        receivingDiagnosisMedium:
          data?.communicationForm?.receivingDiagnosisMedium,
        name: data?.communicationForm?.name || '',
        email: data?.communicationForm?.email || '',
        callingCode: data?.communicationForm?.callingCode || '+44',
        mobileNumber: data?.communicationForm?.mobileNumber
          ? `${data?.communicationForm?.callingCode || '+44'}${data?.communicationForm?.mobileNumber || ''}`
          : undefined,
        notificationMedium: data?.communicationForm?.notificationMedium,
      };
      break;
    default:
      metadata = undefined;
      break;
  }

  return metadata;
};

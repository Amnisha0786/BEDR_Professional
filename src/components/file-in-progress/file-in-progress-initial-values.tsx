import {
  DIAGNOSIS,
  FILE_IN_PROGRESS_STEPS,
  READER_CONFIDENCE,
} from '@/enums/file-in-progress';
import { TGetInProgressFileDetails } from '@/models/types/file-in-progress';

export const getFileInProgressInitialValues = (
  currentStep: string,
  data?: TGetInProgressFileDetails,
) => {
  let metadata;
  const diagnosisForm = data?.diagnosisForm;
  const isRightEyeDiagnosis = Object.values(DIAGNOSIS)?.includes(
    diagnosisForm?.rightEyeDiagnosis as DIAGNOSIS,
  );
  const isLeftEyeDiagnosis = Object.values(DIAGNOSIS)?.includes(
    diagnosisForm?.leftEyeDiagnosis as DIAGNOSIS,
  );

  const readerConfidence = () => {
    if (diagnosisForm?.isReaderConfident === undefined) {
      return undefined;
    } else if (diagnosisForm?.isReaderConfident) {
      return READER_CONFIDENCE.SURE;
    } else {
      return READER_CONFIDENCE.NOT_SURE;
    }
  };
  switch (currentStep) {
    case FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM:
      metadata = {
        id: diagnosisForm?.patientFileId,
        affectedEye: diagnosisForm?.affectedEye,
        rightEyeDiagnosis: isRightEyeDiagnosis
          ? diagnosisForm?.rightEyeDiagnosis
          : undefined,
        otherRightEyeDiagnosis: !isRightEyeDiagnosis
          ? diagnosisForm?.rightEyeDiagnosis
          : '',
        leftEyeDiagnosis: isLeftEyeDiagnosis
          ? diagnosisForm?.leftEyeDiagnosis
          : undefined,
        otherLeftEyeDiagnosis: !isLeftEyeDiagnosis
          ? diagnosisForm?.leftEyeDiagnosis
          : '',
        otherOpthalmicConditions:
          diagnosisForm?.otherOpthalmicConditions &&
          diagnosisForm?.otherOpthalmicConditions?.filter((item: DIAGNOSIS) =>
            Object.values(DIAGNOSIS)?.includes(item),
          ),
        otherInputOpthalmicConditions:
          diagnosisForm?.otherOpthalmicConditions &&
          diagnosisForm?.otherOpthalmicConditions?.filter(
            (item: DIAGNOSIS) => !Object.values(DIAGNOSIS)?.includes(item),
          )?.[0],
        diagnosisReason: diagnosisForm?.diagnosisReason,
        actionToBeTakenForLeftEye: diagnosisForm?.actionToBeTakenForLeftEye,
        actionToBeTakenForRightEye: diagnosisForm?.actionToBeTakenForRightEye,
        isReaderConfident: readerConfidence(),
        remarks: diagnosisForm?.remarks,
        otherDiagnosisDescription: diagnosisForm?.otherDiagnosisDescription,
      };
      break;

    default:
      metadata = undefined;
      break;
  }

  return metadata;
};

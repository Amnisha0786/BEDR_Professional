import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';
import { TDraftDiagnosisFormPayload } from '@/models/types/file-in-progress';

type TCancelFileWithReason = {
  patientFileId: string;
  reasonToSkip: string;
  issueWith?: string;
  affectedEye?: string;
  issueDescription?: string;
};

type TCompleteFilePayload = {
  patientFileId: string;
  diagnosisFormHtml: string;
};

type TDicomTokenPayload = {
  dicomFileKey: string;
};

export const getFileProgress = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_FILE_PROGRESS,
    data: {},
  });
};

export const addDraftDiagnosisForm = async (
  data: TDraftDiagnosisFormPayload,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.DRAFT_DIAGNOSIS_FORM,
    data,
  });
};

export const closeFileWithReason = async (data: TCancelFileWithReason) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CANCEL_FILE_WITH_REASON,
    data,
  });
};

export const completeFile = async (data: TCompleteFilePayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.COMPLETE_FILE,
    data,
  });
};

export const getDicomFileToken = async (data: TDicomTokenPayload) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.DICOM_TOKEN,
    data,
  });
};

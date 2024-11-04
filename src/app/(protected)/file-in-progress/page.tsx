'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import InnerSidebarLayout from '@/components/common-layout/inner-sidebar-layout';
import { FILE_IN_PROGRESS_STEPS } from '@/enums/file-in-progress';
import ReferralFormProgress from '@/components/file-in-progress/referral-form-progress';
import { getFileProgress } from '@/app/api/file-in-progress';
import { getErrorMessage } from '@/lib/utils';
import { getMetaData } from '@/components/create-patient-steps/create-patient-initial-values';
import { STEPPER } from '@/enums/create-patient';
import {
  TLeftEyeImagesFormProgress,
  TReferralForm,
} from '@/models/types/create-patient-forms';
import DraftDiagnosisForm from '@/components/file-in-progress/draft-diagnosis-form';
import {
  TDraftDiagnosisForm,
  TGetInProgressFileDetails,
} from '@/models/types/file-in-progress';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { fileInProgressSteps } from '@/lib/constants/data';
import CloseFileWithReason from '@/components/file-in-progress/close-file-with-reason/close-file-with-reason';
import DiagnosisReport from '@/components/file-in-progress/diagnosis-report';
import LeftEyeImagesProgress from '@/components/file-in-progress/left-eye-images-progress';
import RightEyeImagesProgress from '@/components/file-in-progress/right-eye-images-progress';
import { getFileInProgressInitialValues } from '@/components/file-in-progress/file-in-progress-initial-values';
import Loader from '@/components/custom-loader';
import { Card } from '@/components/ui/card';
import NoDataFound from '@/components/custom-components/custom-no-data-found';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import useSocket from '@/hooks/useSocket';
import { LOGINS } from '@/enums/auth';
import useAccessToken from '@/hooks/useAccessToken';
import useUserProfile from '@/hooks/useUserProfile';

const FileInProgress = () => {
  const router = useRouter();
  const socket = useSocket();
  const userAccessToken = useAccessToken();
  const user = useUserProfile();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [diagnosisFormData, setDiagnosisFormData] =
    useState<TDraftDiagnosisForm>();
  const [fileProgressDetails, setFileProgressDetails] =
    useState<TGetInProgressFileDetails>();

  const [currentStep, setCurrentStep] = useState<string>(
    FILE_IN_PROGRESS_STEPS.REFERRAL_FORM,
  );
  const [diagnosisReportHtml, setDiagnosisReportHtml] = useState<string>();

  const fetchfileInProgress = useCallback(async (hideLoading = false) => {
    try {
      if (!hideLoading) {
        setLoading(true);
      }
      const response = await getFileProgress();
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      setFileProgressDetails(response.data?.data);
      setDiagnosisReportHtml(
        response.data?.data?.diagnosisForm?.diagnosisFormHtml,
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchfileInProgress();
  }, [fetchfileInProgress]);

  useEffect(() => {
    if (fileProgressDetails?.reviewedBy?.id !== user?.id) {
      setCurrentStep(FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT);
    } else {
      setCurrentStep(FILE_IN_PROGRESS_STEPS.REFERRAL_FORM);
    }
  }, [loading]);

  const referralDetails = useMemo(() => {
    return getMetaData(STEPPER.REFERRAL_FORM, fileProgressDetails);
  }, [fileProgressDetails]);

  const leftEyeDetails = useMemo(() => {
    return getMetaData(STEPPER.LEFT_EYE_IMAGES, fileProgressDetails);
  }, [fileProgressDetails]);

  const rightEyeDetails = useMemo(() => {
    return getMetaData(STEPPER.RIGHT_EYE_IMAGES, fileProgressDetails);
  }, [fileProgressDetails]);

  const setInitialValues = useCallback(() => {
    switch (currentStep) {
      case FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM:
        if (fileProgressDetails?.diagnosisForm) {
          const defaultData = getFileInProgressInitialValues(
            FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM,
            fileProgressDetails,
          );
          if (
            userAccessToken?.role === LOGINS.READER &&
            defaultData?.isReaderConfident === undefined
          ) {
            setDiagnosisFormData({
              ...defaultData,
              isReaderConfident: 'false',
            } as TDraftDiagnosisForm);
          } else {
            setDiagnosisFormData(defaultData as TDraftDiagnosisForm);
          }
        }
        break;
    }
  }, [fileProgressDetails, currentStep]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  const renderStepComponent = useCallback(() => {
    switch (currentStep) {
      case FILE_IN_PROGRESS_STEPS.REFERRAL_FORM:
        return (
          <ReferralFormProgress
            setCurrentStep={setCurrentStep}
            referralFormData={referralDetails as TReferralForm}
            patientDetails={fileProgressDetails?.patient}
          />
        );
        break;
      case FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES:
        return (
          <LeftEyeImagesProgress
            setCurrentStep={setCurrentStep}
            leftEyeImagesFormData={leftEyeDetails as TLeftEyeImagesFormProgress}
          />
        );
        break;
      case FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES:
        return (
          <RightEyeImagesProgress
            setCurrentStep={setCurrentStep}
            rightEyeImagesFormData={rightEyeDetails}
          />
        );
        break;
      case FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM:
        return (
          <DraftDiagnosisForm
            setCurrentStep={setCurrentStep}
            diagnosisFormData={diagnosisFormData}
            setDiagnosisFormData={setDiagnosisFormData}
            fileId={fileProgressDetails?.id}
            setDiagnosisReportHtml={setDiagnosisReportHtml}
          />
        );
      case FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT:
        return (
          <DiagnosisReport
            fileId={fileProgressDetails?.id}
            diagnosisReportHtml={diagnosisReportHtml}
            readerConfidence={
              fileProgressDetails?.diagnosisForm?.isReaderConfident
            }
            fileStatus={fileProgressDetails?.fileStatus}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    referralDetails,
    fileProgressDetails,
    diagnosisFormData,
    diagnosisReportHtml,
  ]);

  const steps = useMemo(() => {
    let stepsArray = [...fileInProgressSteps];

    if (fileProgressDetails?.idNumber) {
      stepsArray = [
        {
          title: 'Patient ID',
          value: fileProgressDetails?.idNumber || '',
          textOnly: true,
        },
        ...stepsArray,
      ];
    }
    return stepsArray;
  }, [fileProgressDetails?.idNumber]);

  useEffect(() => {
    steps?.filter((item) => {
      if (item?.title === FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT) {
        if (!diagnosisReportHtml) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      }
    });
  }, [steps, diagnosisReportHtml]);

  useEffect(() => {
    const socketEventApis = () => {
      fetchfileInProgress(true);
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.ADDED_DIAGNOSIS_FORM, socketEventApis);
      socket.on(SOCKET_EVENTS.UNINTENDED_FILE_CLOSED, socketEventApis);
      return () => {
        socket.off(SOCKET_EVENTS.ADDED_DIAGNOSIS_FORM, socketEventApis);
        socket.off(SOCKET_EVENTS.UNINTENDED_FILE_CLOSED, socketEventApis);
      };
    }
  }, [socket, fetchfileInProgress]);

  if (loading) {
    return <Loader size={30} />;
  }

  return (
    <div className='mx-5 mb-5 mt-[30px]'>
      <Card className='w-full p-3'>
        <FlexBox flex centerItems classname='justify-between'>
          <FlexBox flex>
            <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='assets/file.svg'
                alt='file'
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>
              {t('translation.fileInProgress')}
            </TypographyH2>
          </FlexBox>
          {fileProgressDetails?.id && (
            <CloseFileWithReason fileId={fileProgressDetails?.id} />
          )}
        </FlexBox>
      </Card>
      {fileProgressDetails ? (
        <InnerSidebarLayout
          items={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          hideCheckMark={true}
        >
          {renderStepComponent()}
        </InnerSidebarLayout>
      ) : (
        <Card className='mt-3 min-h-[300px] w-full p-6'>
          <NoDataFound
            title={'There is no file in progress at the moment'}
            buttonText={'Open new file'}
            onClickButton={() => router.push('/todays-clinics')}
          />
        </Card>
      )}
    </div>
  );
};

export default FileInProgress;

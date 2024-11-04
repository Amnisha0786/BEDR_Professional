'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { toast } from 'sonner';

import { viewPatientFile } from '@/app/api/completed-files';
import InnerSidebarLayout from '@/components/common-layout/inner-sidebar-layout';
import { getMetaData } from '@/components/create-patient-steps/create-patient-initial-values';
import NoDataFound from '@/components/custom-components/custom-no-data-found';
import Loader from '@/components/custom-loader';
import DiagnosisReport from '@/components/file-in-progress/diagnosis-report';
import { getFileInProgressInitialValues } from '@/components/file-in-progress/file-in-progress-initial-values';
import LeftEyeImagesProgress from '@/components/file-in-progress/left-eye-images-progress';
import ReferralFormProgress from '@/components/file-in-progress/referral-form-progress';
import RightEyeImagesProgress from '@/components/file-in-progress/right-eye-images-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { STEPPER } from '@/enums/create-patient';
import { FILE_IN_PROGRESS_STEPS } from '@/enums/file-in-progress';
import {
  allCompletedStepsForOpto,
  viewOnlyPatientFileSteps,
  viewPatientFileSteps,
} from '@/lib/constants/data';
import { getErrorMessage } from '@/lib/utils';
import {
  TCommunicationPreferencesForm,
  TLeftEyeImagesFormProgress,
  TReferralForm,
} from '@/models/types/create-patient-forms';
import { TGetInProgressFileDetails } from '@/models/types/file-in-progress';
import Communicationpreferances from '@/components/create-patient-steps/communication-preferances';
import { POSSIBLE_STATUS } from '@/enums/file-status-tracker';

const ViewFile = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>(
    searchParams?.get('viewOnly')
      ? FILE_IN_PROGRESS_STEPS.REFERRAL_FORM
      : FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  );
  const [patientFileDetails, setPatientFileDetails] =
    useState<TGetInProgressFileDetails>();

  useEffect(() => {
    if (window !== undefined) {
      const element = document.getElementById('focusedDiv');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [currentStep])

  const viewPatientFileDetails = useCallback(async () => {
    try {
      if (!params?.fileId) {
        return;
      }
      setLoading(true);
      const response = await viewPatientFile({
        patientFileId: params?.fileId as string,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      setPatientFileDetails(response?.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    viewPatientFileDetails();
  }, [viewPatientFileDetails]);

  const referralDetails = useMemo(() => {
    return getMetaData(STEPPER.REFERRAL_FORM, patientFileDetails);
  }, [patientFileDetails]);

  const leftEyeDetails = useMemo(() => {
    return getMetaData(STEPPER.LEFT_EYE_IMAGES, patientFileDetails);
  }, [patientFileDetails]);

  const rightEyeDetails = useMemo(() => {
    return getMetaData(STEPPER.RIGHT_EYE_IMAGES, patientFileDetails);
  }, [patientFileDetails]);

  const diagnosisFormData = useMemo(() => {
    return getFileInProgressInitialValues(currentStep, patientFileDetails);
  }, [currentStep, patientFileDetails]);

  const communicationDetails = useMemo(() => {
    return getMetaData(STEPPER.COMMUNICATION_PREFERANCES, patientFileDetails);
  }, [patientFileDetails]);

  const renderStepComponent = useCallback(() => {
    switch (currentStep) {
      case FILE_IN_PROGRESS_STEPS.REFERRAL_FORM:
        return (
          <ReferralFormProgress
            noColor={true}
            setCurrentStep={setCurrentStep}
            referralFormData={referralDetails as TReferralForm}
            patientDetails={patientFileDetails?.patient}
          />
        );
      case FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES:
        return (
          <LeftEyeImagesProgress
            setCurrentStep={setCurrentStep}
            leftEyeImagesFormData={leftEyeDetails as TLeftEyeImagesFormProgress}
            goToCommunication={true}
          />
        );
      case FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES:
        return (
          <RightEyeImagesProgress
            setCurrentStep={setCurrentStep}
            rightEyeImagesFormData={rightEyeDetails}
          />
        );
      case STEPPER.COMMUNICATION_PREFERANCES:
        return (
          <Communicationpreferances
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={allCompletedStepsForOpto}
            communicationPreferences={
              communicationDetails as TCommunicationPreferencesForm
            }
            viewOnly={true}
            goToReferral={
              searchParams?.get('viewOnly') ||
                patientFileDetails?.fileStatus ===
                POSSIBLE_STATUS.MEDIA_OPACITY ||
                patientFileDetails?.fileStatus ===
                POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE
                ? true
                : false
            }
          />
        );
      case FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT:
        return (
          <DiagnosisReport
            diagnosisReportHtml={
              patientFileDetails?.diagnosisForm?.diagnosisFormHtmlForOptometrist
            }
            viewOnly={true}
          />
        );
      default:
        return null;
    }
  }, [currentStep, referralDetails, patientFileDetails, diagnosisFormData]);

  useEffect(() => {
    if (
      patientFileDetails?.fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY ||
      patientFileDetails?.fileStatus ===
      POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE
    ) {
      setCurrentStep(STEPPER.REFERRAL_FORM);
    }
  }, [patientFileDetails]);

  const steps = useMemo(() => {
    let stepsArray =
      searchParams?.get('viewOnly') ||
        patientFileDetails?.fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY ||
        patientFileDetails?.fileStatus ===
        POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE
        ? [...viewOnlyPatientFileSteps]
        : [...viewPatientFileSteps];
    if (patientFileDetails?.idNumber) {
      stepsArray = [
        {
          title: 'Patient ID',
          value: patientFileDetails?.idNumber || '',
          textOnly: true,
        },
        ...stepsArray,
      ];
    }
    return stepsArray;
  }, [patientFileDetails, searchParams]);

  if (loading) {
    return <Loader size={30} />;
  }

  return (
    <div className='mx-5 mb-5 mt-[30px]'>
      <Card className='w-full p-3'>
        <FlexBox flex centerItems classname='justify-between'>
          <FlexBox flex>
            <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='../../../assets/referral.svg'
                alt={t('translation.patientFilesAlt')}
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>
              {t('translation.patientFilesTitle')}
            </TypographyH2>
          </FlexBox>
          <Button
            variant='outline'
            onClick={() =>
              searchParams?.get('viewOnly')
                ? router.push('/file-status-tracker')
                : router.push('/patient-files')
            }
            className='text-[14px]'
          >
            {t('translation.backToFiles')}
          </Button>
        </FlexBox>
      </Card>
      {patientFileDetails ? (
        <InnerSidebarLayout
          items={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          completedSteps={allCompletedStepsForOpto}
        >
          <div id='focusedDiv' className='text-[1px] invisible'></div>
          {renderStepComponent()}
        </InnerSidebarLayout>
      ) : (
        <Card className='mt-3 min-h-[300px] w-full p-6'>
          <NoDataFound
            title={'There is no file yet. Please move files here.'}
            buttonText={'Move files'}
            onClickButton={() => router.push('/file-status-tracker')}
          />
        </Card>
      )}
    </div>
  );
};

export default ViewFile;

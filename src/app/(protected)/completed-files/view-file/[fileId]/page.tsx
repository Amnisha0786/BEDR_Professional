'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

import { viewPatientFile } from '@/app/api/completed-files';
import InnerSidebarLayout from '@/components/common-layout/inner-sidebar-layout';
import { getMetaData } from '@/components/create-patient-steps/create-patient-initial-values';
import NoDataFound from '@/components/custom-components/custom-no-data-found';
import Loader from '@/components/custom-loader';
import DiagnosisReport from '@/components/file-in-progress/diagnosis-report';
import DraftDiagnosisForm from '@/components/file-in-progress/draft-diagnosis-form';
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
  allCompletedSteps,
  completedFilesSteps,
  rejectedFilesSteps,
} from '@/lib/constants/data';
import { getErrorMessage } from '@/lib/utils';
import {
  TLeftEyeImagesFormProgress,
  TReferralForm,
} from '@/models/types/create-patient-forms';
import {
  TDraftDiagnosisForm,
  TGetInProgressFileDetails,
} from '@/models/types/file-in-progress';
import { POSSIBLE_STATUS } from '@/enums/file-status-tracker';

const ViewFile = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>(
    FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  );
  const [patientFileDetails, setPatientFileDetails] =
    useState<TGetInProgressFileDetails>();

  const params = useParams();
  const router = useRouter();

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
        toast.error('Something went wrong!');
        return;
      }
      setPatientFileDetails(response?.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Something went wrong!');
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

  const renderStepComponent = useCallback(() => {
    switch (currentStep) {
      case FILE_IN_PROGRESS_STEPS.REFERRAL_FORM:
        return (
          <ReferralFormProgress
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
            goToReferral={
              patientFileDetails?.fileStatus ===
                POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE ||
              patientFileDetails?.fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY
            }
          />
        );
      case FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES:
        return (
          <RightEyeImagesProgress
            setCurrentStep={setCurrentStep}
            rightEyeImagesFormData={rightEyeDetails}
          />
        );
      case FILE_IN_PROGRESS_STEPS.DRAFT_DIAGNOSIS_FORM:
        return (
          <DraftDiagnosisForm
            setCurrentStep={setCurrentStep}
            diagnosisFormData={diagnosisFormData as TDraftDiagnosisForm}
            fileId={patientFileDetails?.id}
            viewOnly={true}
          />
        );
      case FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT:
        return (
          <DiagnosisReport
            fileId={patientFileDetails?.id}
            viewOnly={true}
            diagnosisReportHtml={
              patientFileDetails?.diagnosisForm?.diagnosisFormHtml
            }
          />
        );
      default:
        return null;
    }
  }, [currentStep, referralDetails, patientFileDetails, diagnosisFormData]);

  useEffect(() => {
    if (
      patientFileDetails?.fileStatus ===
        POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE ||
      patientFileDetails?.fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY
    ) {
      setCurrentStep(FILE_IN_PROGRESS_STEPS.REFERRAL_FORM);
    }
  }, [patientFileDetails]);

  const steps = useMemo(() => {
    let stepsArray =
      patientFileDetails?.fileStatus ===
        POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE ||
      patientFileDetails?.fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY
        ? [...rejectedFilesSteps]
        : [...completedFilesSteps];
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
  }, [patientFileDetails]);

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
                src='../../../assets/completed.svg'
                alt='completed files'
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>Completed Files</TypographyH2>
          </FlexBox>
          <Button
            variant='outline'
            onClick={() => router.push('/completed-files')}
            className='text-[14px]'
          >
            Back to files
          </Button>
        </FlexBox>
      </Card>
      {patientFileDetails ? (
        <InnerSidebarLayout
          items={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          completedSteps={allCompletedSteps}
        >
          {renderStepComponent()}
        </InnerSidebarLayout>
      ) : (
        <Card className='mt-3 min-h-[300px] w-full p-6'>
          <NoDataFound
            title={'There is no file yet. Please open a new file.'}
            buttonText={'Open new file'}
            onClickButton={() => router.push('/todays-clinics')}
          />
        </Card>
      )}
    </div>
  );
};

export default ViewFile;

'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import ReferralFormProgress from '@/components/file-in-progress/referral-form-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { STEPPER } from '@/enums/create-patient';
import {
  FILE_IN_PROGRESS_STEPS,
  REASON_TO_CANCEL,
} from '@/enums/file-in-progress';
import {
  viewAndUpdateFileSteps,
  viewOnlyPatientFileSteps,
} from '@/lib/constants/data';
import { getErrorMessage } from '@/lib/utils';
import {
  TCommunicationPreferencesForm,
  TLeftEyeImagesForm,
  TReferralForm,
  TRightEyeImagesForm,
} from '@/models/types/create-patient-forms';
import { TGetInProgressFileDetails } from '@/models/types/file-in-progress';
import Communicationpreferances from '@/components/create-patient-steps/communication-preferances';
import LeftEyeImages from '@/components/create-patient-steps/left-eye-images';
import RightEyeImages from '@/components/create-patient-steps/right-eye-images';
import Submitfile from '@/components/create-patient-steps/submit-file';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TypographyP } from '@/components/ui/typography/p';
import { FILE_STATUS } from '@/enums/todays-clinics';
import ReferralForm from '@/components/create-patient-steps/referral-form';
import { POSSIBLE_STATUS } from '@/enums/file-status-tracker';

const rejectedIssue: any = {
  fundus_image: 'fundus image',
  oct_video: 'oct video',
  thickness_map: 'thickness map',
  optic_disc_image: 'optic disc image',
  visual_field_test: 'visual field test',
};

const issueDescription: any = {
  is_missing: 'missing',
  is_poor_quality: 'poor quality',
};

const issueAffectedEye: any = {
  right: 'right',
  left: 'left',
  both_eyes: 'both',
  n_a: 'n/a',
};

const ViewFile = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [leftEyeImagesFormData, setLeftEyeImagesFormData] =
    useState<TLeftEyeImagesForm>();
  const [rightEyeImagesFormData, setRightEyeImagesFormData] =
    useState<TRightEyeImagesForm>();
  const [referralFormData, setReferralFormData] = useState<TReferralForm>();
  const [patientFileDetails, setPatientFileDetails] =
    useState<TGetInProgressFileDetails>();
  const [currentStep, setCurrentStep] = useState<string>(
    FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
  );
  const [communicationPreferences, setCommunicationPreferences] =
    useState<TCommunicationPreferencesForm>();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();

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
      if (response?.data?.data?.fileStatus === FILE_STATUS.DRAFT) {
        setCurrentStep(STEPPER.REFERRAL_FORM);
      }
      if (response?.data?.data?.referralForm) {
        setReferralFormData(
          getMetaData(
            STEPPER.REFERRAL_FORM,
            response?.data?.data,
          ) as TReferralForm,
        );
      }
      if (response?.data?.data?.communicationDetails) {
        setCommunicationPreferences(
          getMetaData(
            STEPPER.COMMUNICATION_PREFERANCES,
            response?.data?.data,
          ) as TCommunicationPreferencesForm,
        );
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

  useEffect(() => {
    if (
      patientFileDetails?.fileStatus ===
      REASON_TO_CANCEL?.DUE_TO_SOMETHING_WRONG_WITH_FILE
    ) {
      setOpen(true);
    }
  }, [patientFileDetails]);

  const reasonDescription = useMemo(() => {
    if (patientFileDetails?.rejectionReasons?.issueDescription) {
      return patientFileDetails?.rejectionReasons?.issueDescription;
    } else return;
  }, [patientFileDetails]);

  const reasonIssue = useMemo(() => {
    if (patientFileDetails?.rejectionReasons?.issueWith) {
      return patientFileDetails?.rejectionReasons?.issueWith;
    } else return;
  }, [patientFileDetails]);

  const reasonAffectedEye = useMemo(() => {
    if (patientFileDetails?.rejectionReasons?.affectedEye) {
      return patientFileDetails?.rejectionReasons?.affectedEye;
    } else return;
  }, [patientFileDetails]);

  const referralDetails = useMemo(() => {
    return getMetaData(STEPPER.REFERRAL_FORM, patientFileDetails);
  }, [patientFileDetails]);

  const communicationDetails = useMemo(() => {
    return getMetaData(
      STEPPER.COMMUNICATION_PREFERANCES,
      patientFileDetails,
    ) as TCommunicationPreferencesForm;
  }, [patientFileDetails]);

  const diagnosisFormData = useMemo(() => {
    return getFileInProgressInitialValues(currentStep, patientFileDetails);
  }, [currentStep, patientFileDetails]);

  useEffect(() => {
    if (communicationDetails) {
      setCommunicationPreferences({
        ...communicationDetails,
      } as TCommunicationPreferencesForm);
    }
  }, [communicationDetails]);

  const setInitialValues = useCallback(() => {
    switch (currentStep) {
      case STEPPER.LEFT_EYE_IMAGES:
        if (patientFileDetails?.leftEyeImages) {
          setLeftEyeImagesFormData(
            getMetaData(currentStep, patientFileDetails) as TLeftEyeImagesForm,
          );
        }
        break;

      case STEPPER.RIGHT_EYE_IMAGES:
        if (patientFileDetails?.rightEyeImages) {
          setRightEyeImagesFormData(
            getMetaData(currentStep, patientFileDetails) as TRightEyeImagesForm,
          );
        }
        break;
    }
  }, [patientFileDetails, currentStep]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  useEffect(() => {
    const completed = [
      FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
      STEPPER.PATIENT_CONSENT,
      STEPPER.PAYMENT,
    ];
    if (patientFileDetails?.referralForm) {
      completed.push(STEPPER.REFERRAL_FORM);
    }
    if (patientFileDetails?.leftEyeImages) {
      completed.push(STEPPER.LEFT_EYE_IMAGES);
    }
    if (patientFileDetails?.rightEyeImages) {
      completed.push(STEPPER.RIGHT_EYE_IMAGES);
    }
    if (
      patientFileDetails?.communicationForm?.notificationMedium &&
      patientFileDetails?.communicationForm?.receivingDiagnosisMedium
    ) {
      completed.push(STEPPER.COMMUNICATION_PREFERANCES);
    }
    setCompletedSteps((prev) => [...prev, ...completed]);
  }, [patientFileDetails, currentStep]);

  const renderStepComponent = useCallback(() => {
    switch (currentStep) {
      case FILE_IN_PROGRESS_STEPS.REFERRAL_FORM:
        return (
          <>
            {patientFileDetails?.fileStatus === FILE_STATUS?.DRAFT ? (
              <ReferralForm
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                completedSteps={completedSteps}
                setCompletedSteps={setCompletedSteps}
                setReferralFormData={setReferralFormData}
                referralFormData={referralFormData as TReferralForm}
                fileId={patientFileDetails?.id}
              />
            ) : (
              <ReferralFormProgress
                noColor={true}
                setCurrentStep={setCurrentStep}
                referralFormData={referralDetails as TReferralForm}
                patientDetails={patientFileDetails?.patient}
              />
            )}
          </>
        );
      case FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES:
        return (
          <LeftEyeImages
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            leftEyeImagesFormData={leftEyeImagesFormData}
            setLeftEyeImagesFormData={setLeftEyeImagesFormData}
            fileId={patientFileDetails?.id}
            setCompletedSteps={setCompletedSteps}
          />
        );
      case FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES:
        return (
          <RightEyeImages
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setCompletedSteps={setCompletedSteps}
            completedSteps={completedSteps}
            rightEyeImagesFormData={rightEyeImagesFormData}
            setRightEyeImagesFormData={setRightEyeImagesFormData}
            fileId={patientFileDetails?.id}
          />
        );
      case STEPPER.COMMUNICATION_PREFERANCES:
        return (
          <Communicationpreferances
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            communicationPreferences={communicationPreferences}
            setCommunicationPreferences={setCommunicationPreferences}
            fileId={patientFileDetails?.id}
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
      case STEPPER.SUBMIT_FILE:
        return (
          <Submitfile
            fileId={patientFileDetails?.id}
            patient={patientFileDetails?.patient}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            setCurrentStep={setCurrentStep}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    referralDetails,
    patientFileDetails,
    diagnosisFormData,
    leftEyeImagesFormData,
    rightEyeImagesFormData,
    communicationPreferences,
    completedSteps,
  ]);

  useEffect(() => {
    if (
      patientFileDetails?.fileStatus ===
        POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE ||
      patientFileDetails?.fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY
    ) {
      setCurrentStep(STEPPER.REFERRAL_FORM);
    }
  }, [patientFileDetails]);

  const steps = useMemo(() => {
    let stepsArray =
      patientFileDetails?.fileStatus ===
        POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE ||
      patientFileDetails?.fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY
        ? [...viewOnlyPatientFileSteps]
        : [...viewAndUpdateFileSteps];
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
    if (patientFileDetails?.fileStatus === FILE_STATUS.DRAFT) {
      stepsArray = stepsArray.filter(
        (step) => step.title !== FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT,
      );
    }
    return stepsArray;
  }, [patientFileDetails?.idNumber]);

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
              {t('translation.patientFile')}
            </TypographyH2>
          </FlexBox>
          <Button
            variant='outline'
            onClick={() => router.push('/file-status-tracker')}
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
          completedSteps={completedSteps}
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
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>Rejected Reason</DialogTitle>
          </DialogHeader>
          <TypographyP classname='!text-error'>
            {t('translation.fileRejectedReason', {
              description: issueDescription?.[`${reasonDescription}`],
              issue: rejectedIssue?.[`${reasonIssue}`],
              eye: issueAffectedEye?.[`${reasonAffectedEye}`],
            })}
          </TypographyP>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewFile;

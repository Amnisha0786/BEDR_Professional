'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Icon from './custom-icon';
import { stepItems } from '../../lib/constants/data';
import { cn } from '@/lib/utils';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import ReferralForm from '../create-patient-steps/referral-form';
import LeftEyeImages from '../create-patient-steps/left-eye-images';
import RightEyeImages from '../create-patient-steps/right-eye-images';
import Submitfile from '../create-patient-steps/submit-file';
import Communicationpreferances from '../create-patient-steps/communication-preferances';
import Payments from '../create-patient-steps/payments';
import {
  TCommunicationPreferencesForm,
  TGetInProgressFileData,
  TLeftEyeImagesForm,
  TReferralForm,
  TRightEyeImagesForm,
} from '@/models/types/create-patient-forms';
import { STEPPER } from '@/enums/create-patient';
import { getMetaData } from '../create-patient-steps/create-patient-initial-values';
import { COLORS } from '@/lib/constants/color';

export type TSelectPatient = {
  searchInput?: string;
  patient?: number;
};

type TStep = {
  fileId?: string;
  formData?: TGetInProgressFileData | undefined;
  fetchfileInProgress: () => void;
};

const Step = ({ fileId, formData = undefined }: TStep) => {
  const [currentStep, setCurrentStep] = useState<string>(STEPPER.REFERRAL_FORM);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>();
  const [referralFormData, setReferralFormData] = useState<TReferralForm>();
  const [leftEyeImagesFormData, setLeftEyeImagesFormData] =
    useState<TLeftEyeImagesForm>();
  const [rightEyeImagesFormData, setRightEyeImagesFormData] =
    useState<TRightEyeImagesForm>();
  const [communicationPreferences, setCommunicationPreferences] =
    useState<TCommunicationPreferencesForm>();

  const handleStepClick = useCallback(
    (title: string) => {
      if (completedSteps?.includes(title)) {
        setCurrentStep(title);
      }
    },
    [completedSteps],
  );

  useEffect(() => {
    if (window !== undefined) {
      const element = document.getElementById('focusedDiv');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [currentStep])

  useEffect(() => {
    const completed: string[] = [];
    if (formData?.referralForm) {
      completed.push(STEPPER.REFERRAL_FORM);
    }
    if (formData?.leftEyeImages) {
      completed.push(STEPPER.LEFT_EYE_IMAGES);
    }
    if (formData?.rightEyeImages) {
      completed.push(STEPPER.RIGHT_EYE_IMAGES);
    }
    if (
      formData?.communicationForm?.notificationMedium &&
      formData?.communicationForm?.receivingDiagnosisMedium
    ) {
      completed.push(STEPPER.COMMUNICATION_PREFERANCES);
    }
    setCompletedSteps((prev) => [...prev, ...completed]);
  }, [formData, currentStep]);

  const setInitialValues = useCallback(() => {
    switch (currentStep) {
      case STEPPER.REFERRAL_FORM:
        if (formData?.referralForm) {
          setReferralFormData(
            getMetaData(currentStep, formData) as TReferralForm,
          );
        }
        break;

      case STEPPER.LEFT_EYE_IMAGES:
        if (formData?.leftEyeImages) {
          setLeftEyeImagesFormData(
            getMetaData(currentStep, formData) as TLeftEyeImagesForm,
          );
        }
        break;

      case STEPPER.RIGHT_EYE_IMAGES:
        if (formData?.rightEyeImages) {
          setRightEyeImagesFormData(
            getMetaData(currentStep, formData) as TRightEyeImagesForm,
          );
        }
        break;

      case STEPPER.COMMUNICATION_PREFERANCES:
        if (
          formData?.communicationForm?.notificationMedium &&
          formData?.communicationForm?.receivingDiagnosisMedium
        ) {
          setCommunicationPreferences(
            getMetaData(currentStep, formData) as TCommunicationPreferencesForm,
          );
        }
        break;
    }
  }, [formData, currentStep]);

  useEffect(() => {
    if (
      formData?.communicationForm?.name ||
      formData?.communicationForm?.email
    ) {
      setCommunicationPreferences({
        ...communicationPreferences,
        name: formData?.communicationForm?.name || '',
        email: formData?.communicationForm?.email || '',
      } as TCommunicationPreferencesForm);
    }
  }, [formData]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  const renderStepComponent = useCallback(() => {
    switch (currentStep) {
      case STEPPER.REFERRAL_FORM:
        return (
          <ReferralForm
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            setReferralFormData={setReferralFormData}
            referralFormData={referralFormData}
            fileId={fileId}
          />
        );
      case STEPPER.LEFT_EYE_IMAGES:
        return (
          <LeftEyeImages
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            leftEyeImagesFormData={leftEyeImagesFormData}
            setLeftEyeImagesFormData={setLeftEyeImagesFormData}
            fileId={fileId}
          />
        );
      case STEPPER.RIGHT_EYE_IMAGES:
        return (
          <RightEyeImages
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            rightEyeImagesFormData={rightEyeImagesFormData}
            setRightEyeImagesFormData={setRightEyeImagesFormData}
            fileId={fileId}
          />
        );
      case STEPPER.COMMUNICATION_PREFERANCES:
        return (
          <Communicationpreferances
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            setCommunicationPreferences={setCommunicationPreferences}
            communicationPreferences={communicationPreferences}
            fileId={fileId}
          />
        );
      case STEPPER.PAYMENT:
        return (
          <Payments
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
          />
        );
      case STEPPER.SUBMIT_FILE:
        return (
          <Submitfile
            setCompletedSteps={setCompletedSteps}
            setIsSubmitted={setIsSubmitted}
            fileId={fileId}
            patient={formData?.patient}
            completedSteps={completedSteps}
            setCurrentStep={setCurrentStep}
          />
        );
      default:
        return <div></div>;
    }
  }, [
    completedSteps,
    currentStep,
    fileId,
    referralFormData,
    leftEyeImagesFormData,
    rightEyeImagesFormData,
    communicationPreferences,
    formData,
  ]);

  return (
    <FlexBox classname='mt-5 md:gap-x-5'>
      <div className='rounded-[10px] bg-white pl-[14px] pr-[20px] md:pb-[27px] md:pl-0 md:pt-3'>
        <nav className='flex scroll-m-0 scroll-p-0 overflow-x-auto scroll-smooth md:grid md:items-start md:gap-2 md:overflow-hidden'>
          {stepItems.map((item, index) => {
            return (
              <span
                key={index}
                className={cn(
                  '!md:rounded-r-[7px] group m-[10px] flex cursor-pointer items-center rounded-[7px] p-[10px] py-[15px] font-medium  md:m-0 md:rounded-l-none md:pl-[14px]',
                  {
                    'cursor-default hover:!bg-transparent': item.disabled,
                    'hover:bg-lightPrimary': completedSteps?.includes(
                      item.title,
                    ),
                    'bg-lightPrimary': currentStep === item?.title,
                  },
                )}
                onClick={() => {
                  if (
                    !item?.disabled &&
                    !isSubmitted &&
                    completedSteps?.includes(STEPPER.REFERRAL_FORM)
                  ) {
                    handleStepClick(item?.title);
                  }
                }}
              >
                <div className='flex w-max items-center justify-center md:w-full md:justify-between'>
                  <div
                    className={`flex ${item?.title === STEPPER.COMMUNICATION_PREFERANCES ? 'items-start' : 'items-center'}`}
                  >
                    <div className={`'h-5' w-5`}>
                      <Icon
                        name={item?.icon || 'availablity'}
                        color={
                          currentStep === item?.title
                            ? COLORS.PRIMARY
                            : 'transparent'
                        }
                        className={`${item?.padding} ${
                          currentStep === item?.title
                            ? 'svgBlue'
                            : 'transparent'
                        }`}
                      />
                    </div>
                    <TypographyP
                      size={16}
                      classname={`${currentStep === item?.title && 'text-primary'} !mb-0 leading-[1.2] pr-[8px] ml-[11px]`}
                    >
                      {item.title}
                    </TypographyP>
                  </div>

                  {completedSteps?.includes(item?.title) && (
                    <div className='h-4 w-4'>
                      <Icon name={'solid-tick'} width={18} height={18} />
                    </div>
                  )}
                </div>
              </span>
            );
          })}
        </nav>
      </div>
      <div className='mt-5 w-full md:mt-0'><div className='text-[1px] invisible' id='focusedDiv'></div> {renderStepComponent()}</div>
    </FlexBox>
  );
};

export default Step;

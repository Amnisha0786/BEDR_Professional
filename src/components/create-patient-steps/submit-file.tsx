'use client';

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Card, CardFooter } from '../ui/card';
import FlexBox from '../ui/flexbox';
import Icon from '../custom-components/custom-icon';
import { TypographyH2 } from '../ui/typography/h2';
import { Button } from '../ui/button';
import FileSubmitted from './file-submitted';
import { createPatientSteps } from '../../lib/constants/data';
import { submitFile } from '@/app/api/create-patient-request';
import { REQUEST_FILE_STATUS, STEPPER } from '@/enums/create-patient';
import { getErrorMessage } from '@/lib/utils';
import { TRegisterNewPatientForm } from '@/models/types/create-patient-forms';

type Tprops = {
  setCompletedSteps?: Dispatch<SetStateAction<string[]>>;
  fileId?: string;
  patient?: TRegisterNewPatientForm;
  setIsSubmitted?: (open: boolean) => void;
  completedSteps?: string[];
  setCurrentStep: Dispatch<SetStateAction<string>>;
};

const Submitfile = ({
  setCompletedSteps,
  fileId,
  patient,
  setIsSubmitted = () => {},
  completedSteps = [],
  setCurrentStep,
}: Tprops) => {
  const [isFileSubmitted, setIsFileSubmitted] = useState(false);
  const [savingInDraft, setSavingInDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = useCallback(
    async (fileStatus: string) => {
      if (!completedSteps?.includes(STEPPER?.REFERRAL_FORM)) {
        setCurrentStep(STEPPER?.REFERRAL_FORM);
        toast.warning(t('translation.pleaseFillReferralForm'));
        return;
      }
      try {
        setSubmitting(true);
        if (!fileId) {
          return;
        }
        if (fileStatus === REQUEST_FILE_STATUS.DRAFT) {
          setSavingInDraft(true);
        }
        const response = await submitFile({
          patientFileId: fileId,
          fileStatus,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          if (fileStatus === REQUEST_FILE_STATUS.DRAFT) {
            toast.success(t('translation.fileSavedAsDraft'));
            router.push('/availability');
          } else {
            setCompletedSteps?.(createPatientSteps);
            setIsFileSubmitted(true);
            setIsSubmitted(true);
            toast.success(t('translation.fileSubmittedSuccessfully'));
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setSavingInDraft(false);
        setSubmitting(false);
      }
    },
    [fileId, completedSteps],
  );
  return isFileSubmitted ? (
    <FileSubmitted patient={patient} />
  ) : (
    <Card className='min-h-[200px] justify-start bg-white px-5 pb-5 pt-[30px] md:px-[40px] md:pb-[40px]'>
      <FlexBox classname='!flex'>
        <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
          <Icon name='file' width={17} height={17} className='m-auto' />
        </div>
        <TypographyH2 size={18}>
          {t('translation.fileIsReadyToSubmit')}
        </TypographyH2>
      </FlexBox>
      <CardFooter className='mt-8 flex flex-col items-center justify-center gap-2 !px-0 !pb-0 nm:flex-row md:flex-row md:gap-0'>
        <Button
          variant={'outline'}
          className='w-full min-w-[184px] text-lg nm:w-auto md:w-auto'
          onClick={() => handleSubmit(REQUEST_FILE_STATUS.DRAFT)}
          loading={savingInDraft}
          center
        >
          {t('translation.saveFileForLater')}
        </Button>
        <div className='flex w-full flex-col gap-2 nm:w-auto md:w-auto md:flex-row md:gap-0 '>
          <Button
            className='min-w-[140px] text-lg text-white md:ml-5'
            onClick={() => handleSubmit(REQUEST_FILE_STATUS.SUBMITTED)}
            disabled={submitting}
            loading={submitting}
            center
          >
            {t('translation.submitFile')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Submitfile;

'use client';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { Button } from '../ui/button';
import { TGetUnpaidFileData } from '@/models/types/ipad';
import PatientConsentFooterInfo from './patient-consent-footer-info';

type Tprops = {
  setStep?: Dispatch<SetStateAction<number>>;
  setSelectedSection?: Dispatch<SetStateAction<string>>;
  fileData?: TGetUnpaidFileData | null;
};

const PatientConsentContent1 = ({
  setStep = () => { },
  setSelectedSection = () => { },
  fileData = null,
}: Tprops) => {

  const { t } = useTranslation();

  return (
    <Card className=''>
      <CardHeader className='px-[30px] pb-[20px]'>
        <CardTitle className='mb-3 flex  gap-4 text-[20px] font-semibold text-darkGray'>
          {' '}
          <div className='flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
            <Image
              src={'/assets/patient-consent-file.svg'}
              alt='patient-consent'
              width={18}
              height={14}
              className='m-auto'
            />
          </div>{' '}
          {t('translation.patientsConsent')}
        </CardTitle>
        <CardDescription>
          <TypographyP primary noBottom classname='text-[20px] font-medium'>
            {t('translation.expressConsentToAllowBedr')}
          </TypographyP>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-[30px]'>
        <TypographyP size={16} primary classname='font-normal'>
          {t('translation.iHereByGiveMyExplicit')}
        </TypographyP>

        <TypographyP primary noBottom classname='text-[20px] font-medium'>
          {t('translation.processingAndSharing')}
        </TypographyP>
        <TypographyP size={16} primary classname='font-normal pl-[18px] mt-1'>
          {t('translation.consentToProcessingAndSharing')}
        </TypographyP>
        <TypographyP primary noBottom classname='text-[20px] font-medium'>
          {t('translation.administrativeStaff')}
        </TypographyP>
        <TypographyP size={16} primary classname='font-normal pl-[23px] mt-1'>
          {t('translation.iUnderstandAdministrativeStaff')}
        </TypographyP>
        <TypographyP primary noBottom classname='text-[20px] font-medium'>
          {t('translation.purposeOfDataUse')}
        </TypographyP>
        <TypographyP size={16} primary classname='font-normal pl-[24px] mt-1'>
          {t('translation.acknowledgeThatMyData')}
        </TypographyP>
        <TypographyP primary noBottom classname='text-[20px] font-medium'>
          {t('translation.myRights')}
        </TypographyP>
        <TypographyP size={16} primary classname='font-normal pl-[24px] mt-1'>
          {t('translation.iHaveRightToWithdrawMyConsent')}
        </TypographyP>
        <TypographyP size={16} primary classname='font-normal'>
          {t('translation.bySigningBelow')}
        </TypographyP>
      </CardContent>
      <CardFooter className=' mt-[21px] flex-col  px-[30px]'>
        <PatientConsentFooterInfo fileData={fileData} />
        <FlexBox flex classname='gap-5  w-full justify-end mt-[30px]'>
          <Button
            onClick={() => setSelectedSection('')}
            variant={'outlineWithoutHover'}
            className='px-[60px]'
          >
            {t('translation.back')}
          </Button>
          <Button
            onClick={() => setStep((prev) => prev + 1)}
            variant={'default'}
            className='px-[60px] text-white'
          >
            {t('translation.next')}
          </Button>
        </FlexBox>
      </CardFooter>
    </Card>
  );
};

export default PatientConsentContent1;

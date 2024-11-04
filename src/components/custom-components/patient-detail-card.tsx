'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyH4 } from '@/components/ui/typography/h4';
import { TypographyP } from '@/components/ui/typography/p';
import { TIpadPatientListDetails } from '@/models/types/create-patient-forms';

type TFilesListDetails = {
  patient?: TIpadPatientListDetails;
  key?: number;
  handleSelectPatientClick: (patient: TIpadPatientListDetails) => void;
  loading?: string;
};

const PatientDetailCard = ({
  patient,
  key,
  handleSelectPatientClick,
  loading = '',
}: TFilesListDetails) => {
  const { t } = useTranslation();

  return (
    <>
      {patient && (
        <Card className='bg-white p-4' key={key}>
          <CardHeader className='!p-[0px] !pb-0'>
            <CardTitle>
              <FlexBox classname='flex items-center justify-end'>
                <FlexBox classname='flex-col flex truncate max-md:mr-[21px]  justify-center w-full'>
                  <TypographyH2 classname='text-[14px] text-center mb-[0px]'>
                    {`${patient?.firstName || ''} ${patient?.lastName || ''}`}
                  </TypographyH2>
                  <TypographyP size={12} classname='!mb-0 truncate text-center'>
                    {patient?.email || ''}
                  </TypographyP>
                </FlexBox>
              </FlexBox>
            </CardTitle>
          </CardHeader>
          <CardContent className='px-[0px] py-[16px]'>
            <div className='min-h-[145px] bg-backgroundGray p-[15px]'>
              {patient?.idNumber && (
                <div className='mb-2 border-b border-lightGray'>
                  <label className='text-[12px] font-normal text-gray'>
                    {t('translation.idNumber')}:
                  </label>
                  <TypographyH4
                    size={14}
                    classname='!text-darkGray font-medium leading-normal'
                  >
                    {patient?.idNumber || ''}
                  </TypographyH4>
                </div>
              )}
              <div className='mb-2 border-b border-lightGray'>
                <label className='text-[12px] font-normal text-gray'>
                  {t('translation.mobileNumber')}:
                </label>
                <TypographyH4
                  size={14}
                  classname='!text-darkGray font-medium leading-normal'
                >
                  {`(${patient?.callingCode || ''}) ${patient.mobileNumber || ''}`}
                </TypographyH4>
              </div>
              <div className='mb-2 border-b border-lightGray'>
                <label className='text-[12px] font-normal text-gray'>
                  {t('translation.dob')}:
                </label>
                <TypographyH4
                  size={14}
                  classname='!text-darkGray font-medium leading-normal'
                >
                  {patient?.dateOfBirth
                    ? dayjs(patient?.dateOfBirth)?.format('DD/MM/YYYY')
                    : ''}
                </TypographyH4>
              </div>
              <div className='mb-2'>
                <label className='text-[12px] font-normal text-gray'>
                  {t('translation.postcode')}:
                </label>
                <TypographyH4
                  size={14}
                  classname='!text-darkGray font-medium leading-normal'
                >
                  {patient?.postCode || ''}
                </TypographyH4>
              </div>
            </div>
          </CardContent>
          <CardFooter className='w-full pb-[0px]'>
            <Button
              variant='outline'
              className={`w-full text-[16px] `}
              onClick={() => handleSelectPatientClick(patient)}
              loading={loading === patient?.id}
            >
              {t('translation.select')}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default PatientDetailCard;

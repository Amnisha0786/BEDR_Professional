'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const DoctorReaderReadOnlyText = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const goToPlanner = () => router.push('/planner');

  return (
    <Card className='w-full px-2 py-5 md:p-10'>
      <FlexBox flex centerContent centerItems classname='max-md:!items-start'>
        <TypographyP
          noBottom
          size={18}
          center
          classname='!text-darkGray !font-semibold'
        >
          {t('translation.doctorReaderSignupSuccess')}
          <TypographyP primary classname='mt-1'>
            {t('translation.goToPlannerDescription')}
          </TypographyP>
          <Button
            className='mt-4 min-w-[150px] text-[16px]'
            onClick={goToPlanner}
          >
            {t('translation.goToPlanner')}
          </Button>
        </TypographyP>
      </FlexBox>
    </Card>
  );
};

export default DoctorReaderReadOnlyText;

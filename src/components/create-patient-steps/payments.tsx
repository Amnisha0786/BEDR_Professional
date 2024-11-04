'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Card, CardContent } from '../ui/card';
import FlexBox from '../ui/flexbox';
import Icon from '../custom-components/custom-icon';
import { TypographyH2 } from '../ui/typography/h2';
import { STEPPER } from '@/enums/create-patient';

type Tprops = {
  currentStep: string;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  completedSteps: string[];
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
};

const Payments = ({
  currentStep,
  setCurrentStep,
  completedSteps,
  setCompletedSteps,
}: Tprops) => {
  setTimeout(() => {
    setCurrentStep(STEPPER.SUBMIT_FILE);
    setCompletedSteps([...completedSteps, currentStep]);
  }, 5000);

  return (
    <Card className='min-h-[200px] max-w-[900px] justify-start bg-white px-5 pb-5 pt-[30px] md:px-[40px] md:pb-[40px]'>
      <FlexBox classname='!flex'>
        <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
          <Icon
            name='patient-payment'
            width={17}
            height={12}
            className='m-auto'
          />
        </div>
        <TypographyH2 size={18}>Payment</TypographyH2>
      </FlexBox>
      <CardContent className=' mt-[16px] flex  !w-full flex-col justify-center px-0 !pt-0 nm:p-6  md:p-6'>
        <div className='m-auto flex h-14 w-14 justify-center rounded-full bg-primary'>
          <Icon
            name='solid-hourglass'
            width={20}
            height={20}
            className='m-auto h-8 w-8'
            color='#fff'
          />
        </div>
        <TypographyH2 center classname='mb-2 mt-4'>
          Waiting for the payment...
        </TypographyH2>
      </CardContent>
    </Card>
  );
};

export default Payments;

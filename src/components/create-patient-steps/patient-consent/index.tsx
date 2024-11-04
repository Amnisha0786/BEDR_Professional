import React from 'react';

import Icon from '@/components/custom-components/custom-icon';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import StepperFooter from '../common-stepper-footer';

const PatientConsent = () => {
  return (
    <Card className='min-h-[800px] bg-white px-[40px] pb-[40px] pt-[30px]'>
      <FlexBox classname='flex'>
        <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
          <Icon
            name='patient-consent'
            width={16}
            height={15}
            className='m-auto'
          />
        </div>
        <TypographyH2 size={18}>Patient’s Consent</TypographyH2>
      </FlexBox>
      <CardHeader className='!space-0 my-4 !p-0'>
        <TypographyP size={20} classname='!text-darkGray leading-normal'>
          Express Consent to allow BEDR to collect store and transfer personal
          and medical data obtained from you.
        </TypographyP>
      </CardHeader>
      <div>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          Personal data is information such as your name, date of birth, email
          address and phone number.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          Special category data is medical data such as your medical history and
          images, videos and scans of your retina.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          The platform (BEDR) needs to collect this information from you, store
          it securely in a file and allow an ophthalmologist to access this
          information in order to make a diagnosis.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          We will keep your information securely on your optometrist’s computer.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          We will encrypt your information so that it can only be read by your
          optometrist and the ophthalmologist/s responsible for diagnosing your
          eye condition.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          We will not provide your information to anyone other than your
          optometrist and the ophthalmologist/s who need to use it to diagnose
          your eye condition.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          We will not transfer your information overseas.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          If you are concerned about how we have dealt with your information you
          can make a complaint to The Information Commissioner.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          Please give your express consent for us to use your information as set
          out above.
        </TypographyP>
        <TypographyP size={16} classname='!text-darkGray leading-normal'>
          I, Joan Elizabeth Smith, expressly consent to BEDR Ltd collecting,
          storing and transferring my personal and special category data for the
          purpose of enabling me to get my eye condition diagnosed by an
          ophthalmologist via the platform.
        </TypographyP>
      </div>
      <CardFooter className='!mt-5 !p-0'>
        <div className='flex w-full items-center justify-between'>
          <FlexBox classname='flex flex-col'>
            <TypographyP size={14} classname='!mb-0 text-darkGray'>
              Signed:
            </TypographyP>
            <TypographyP size={16} classname='text-darkGray'>
              Joan Elizabeth Smith
            </TypographyP>
          </FlexBox>
          <FlexBox classname='flex flex-col'>
            <TypographyP size={14} classname='!mb-0 text-darkGray'>
              Date:
            </TypographyP>
            <TypographyP size={16} classname='text-darkGray'>
              25 Jan 2024
            </TypographyP>
          </FlexBox>
        </div>
      </CardFooter>
      <StepperFooter outlinedNext={true} hideBack={true} />
    </Card>
  );
};

export default PatientConsent;

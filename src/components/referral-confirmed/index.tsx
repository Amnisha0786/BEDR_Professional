'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Card } from '../ui/card';
import { TypographyH2 } from '../ui/typography/h2';
import { Button } from '../ui/button';
import i18next from '@/localization/index';

type TProps = {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
};

const t = i18next.t;

const ReferralConfirmed = ({
  title = t('translation.fileSubmittedSuccessfully'),
  buttonText = t('translation.done'),
  buttonLink = '/availability',
}: TProps) => {
  return (
    <Card className='min-h-[200px] justify-center bg-white px-5 pb-5 pt-[30px] md:px-[40px] md:pb-[40px]'>
      <div className='mb-[50px] flex flex-col justify-center'>
        <Image
          src='/assets/solid-tick.svg'
          alt='tick'
          width={56}
          height={56}
          className='m-auto h-14 w-14'
        />
        <TypographyH2 center classname='mb-2 mt-4'>
          {title}
        </TypographyH2>
      </div>
      <Link
        href={{
          pathname: buttonLink,
        }}
        className='m-auto'
      >
        <Button variant={'outline'} className='w-[190px]'>
          {buttonText}
        </Button>
      </Link>
    </Card>
  );
};

export default ReferralConfirmed;

'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Route } from 'next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TypographyH2 } from '@/components/ui/typography/h2';

const PaymentSuccess = () => {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  const returnUrl = useMemo(() => `/ipad/practice/${params?.fileId}`, [params]);

  return (
    <Card className=' m-8 min-h-[200px] justify-center bg-white px-5 pb-5 pt-[30px] md:px-[40px] md:pb-[40px]'>
      <div className='mb-[50px] flex flex-col justify-center'>
        <Image
          src='/assets/solid-tick.svg'
          alt='tick'
          width={56}
          height={56}
          className='m-auto h-14 w-14'
        />
        <TypographyH2 center classname='mb-2 mt-4'>
          {t('translation.paymentDone')}
        </TypographyH2>
      </div>
      <Button
        variant={'outline'}
        className='m-auto w-[190px]'
        onClick={() => router.push(returnUrl as Route)}
      >
        {t('translation.done')}
      </Button>
    </Card>
  );
};

export default PaymentSuccess;

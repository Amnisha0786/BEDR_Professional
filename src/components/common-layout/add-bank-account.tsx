'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const AddBankAccountCard = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const goToPayments = () => router.push('/payments');

  return (
    <Card className='mb-5 w-full px-3 py-5 md:p-8'>
      <FlexBox flex centerContent centerItems classname='max-md:!items-start'>
        <TypographyP
          noBottom
          size={18}
          center
          classname='!text-darkGray !font-semibold'
        >
          {t('translation.addBankAccountDescription')}
          <TypographyP primary classname='mt-1'>
            {t('translation.updateNow')}
          </TypographyP>
          <Button
            className='mt-4 min-w-[150px] text-[16px]'
            onClick={goToPayments}
          >
            {t('translation.linkBankAccount')}
          </Button>
        </TypographyP>
      </FlexBox>
    </Card>
  );
};

export default AddBankAccountCard;

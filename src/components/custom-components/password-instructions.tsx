'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import Icon from './custom-icon';

type TProps = {
  hideHeading?: boolean;
};

const PasswordInstructions = ({ hideHeading = false }: TProps) => {
  const { t } = useTranslation();
  return (
    <ul>
      {!hideHeading && (
        <TypographyP>{t('translation.instructionsFillPassword')}</TypographyP>
      )}
      <li className='mb-[10px] text-[14px] font-medium text-darkGray'>
        <FlexBox flex centerItems classname='gap-[10px]'>
          <div className='max-ms:w-[6%]'>
            <Icon name='list-icon' height={18} width={18} color='transparent' />
          </div>
          <div className='max-ms:w-[94%]'>{t('translation.minimumCharacters')}</div>
        </FlexBox>
      </li>
      <li className='mb-[10px] text-[14px] font-medium text-darkGray'>
        <FlexBox flex centerItems classname='gap-[10px]'>
          {' '}
          <div className='max-ms:w-[6%]'>
            <Icon name='list-icon' height={18} width={18} color='transparent' />
          </div>
          <div className='max-ms:w-[94%]'>
            {' '}
            {t('translation.mustHaveSpecialCharacter')}
          </div>
        </FlexBox>
      </li>
      <li className='mb-[10px] text-[14px] font-medium text-darkGray'>
        <FlexBox flex centerItems classname='gap-[10px]'>
          <div className='max-ms:w-[6%]'>
            <Icon name='list-icon' height={18} width={18} color='transparent' />{' '}
          </div>
          <div className='max-ms:w-[94%]'> {t('translation.oneNumber')}</div>
        </FlexBox>
      </li>
      <li className='mb-[25px] text-[14px] font-medium text-darkGray'>
        <FlexBox flex centerItems classname='gap-[10px]'>
          <div className='max-ms:w-[6%]'>
            <Icon name='list-icon' height={18} width={18} color='transparent' />{' '}
          </div>
          <div className='max-ms:w-[94%]'> {t('translation.oneCapitalLetter')} </div>
        </FlexBox>
      </li>
    </ul>
  );
};

export default PasswordInstructions;

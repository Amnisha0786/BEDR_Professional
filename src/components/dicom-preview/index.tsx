'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import Loader from '../custom-loader';
import FlexBox from '../ui/flexbox';
import { Button } from '../ui/button';
import { TypographyP } from '../ui/typography/p';

type TProps = {
  buttonClass?: string;
  buttonVariant?: 'outline' | 'ghost' | 'default';
  buttonText?: string;
  children?: React.ReactNode;
  loading: boolean;
  onSuccess: () => void;
};

const DicomView = ({
  loading = false,
  buttonClass,
  buttonVariant = 'default',
  buttonText,
  children,
  onSuccess,
}: TProps) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (loading) {
      return (
        <FlexBox flex centerItems classname='gap-2'>
          {' '}
          <TypographyP noBottom size={14} classname='text-primary'>
            {t('translation.opening')}
          </TypographyP>
          <Loader size={20} screen={300} />
        </FlexBox>
      );
    }
    return (
      <div onClick={onSuccess}>
        {children || (
          <Button
            variant={buttonVariant}
            className={cn(
              'sm:min-w-[500px] py-2 text-[16px] font-normal h-full text-white text-wrap',
              buttonClass,
            )}
          >
            {buttonText || t('translation.clickToPreviewDicom')}
          </Button>
        )}
      </div>
    );
  };

  return (
    <FlexBox
      flex
      centerContent
      centerItems
      classname='m-auto cursor-pointer'
      disable={loading}
    >
      {renderContent()}
    </FlexBox>
  );
};

export default DicomView;

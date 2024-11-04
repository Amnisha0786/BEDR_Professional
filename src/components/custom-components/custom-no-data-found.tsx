import React from 'react';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { Button } from '../ui/button';
import Icon from './custom-icon';
import i18next from '@/localization';
import { cn } from '@/lib/utils';

type TProps = {
  heading?: string;
  title: string;
  onClickButton?: () => void;
  buttonText?: string;
  className?: string;
  hideButton?: boolean;
  height?: number;
  buttonClass?: string;
};

const t = i18next.t;

const NoDataFound = ({
  heading = t('translation.noResultFound'),
  title = '',
  onClickButton,
  buttonText,
  hideButton = false,
  height,
  className = '',
  buttonClass,
}: TProps) => {
  return (
    <FlexBox
      flex
      centerContent
      centerItems
      classname={`flex-col max-w-[378px] min-h-[180px] h-[${height}px] m-auto ${className}`}
    >
      <Icon name={'no-records-found'} alt='no records' height={56} width={46} />
      <TypographyP
        primary
        noBottom
        size={20}
        center
        classname='!font-medium mt-2'
      >
        {heading}
      </TypographyP>
      <TypographyP primary noBottom size={16} center classname='!font-medium '>
        {title}
      </TypographyP>
      {!hideButton && (
        <Button
          variant={'outline'}
          className={cn('mt-[40px] text-[16px]', buttonClass)}
          onClick={onClickButton}
        >
          {buttonText || 'Go'}
        </Button>
      )}
    </FlexBox>
  );
};

export default NoDataFound;

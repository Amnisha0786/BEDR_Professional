'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

import FlexBox from '../ui/flexbox';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { COLORS } from '@/lib/constants/color';
import { TypographyP } from '../ui/typography/p';

type TProps = {
  id?: string;
  selectedOption?: number;
  setSelectedOption: Dispatch<SetStateAction<number[]>>;
  totalCount: number;
  viewOnly?: boolean;
  index: number;
};

export function DynamicDropdown({
  id = '',
  selectedOption,
  setSelectedOption,
  totalCount,
  viewOnly,
  index,
}: TProps) {
  const { t } = useTranslation();

  const handleSortChange = (value: string) => {
    setSelectedOption((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = +value;
      return updatedOptions;
    });
  };

  const renderDropdown = () => {
    if (viewOnly) {
      return (
        <div className='min-w-[120px] rounded-[4px] border border-lightPrimary'>
          {' '}
          <TypographyP
            noBottom
            size={14}
            primary
            classname=' py-1.5 px-4 truncate max-w-[160px]'
          >
            {t('translation.filesHeading', { files: selectedOption || 0 })}
          </TypographyP>
        </div>
      );
    }
    return (
      <Select onValueChange={(val) => handleSortChange(val)}>
        <SelectTrigger
          className={`peer flex-1 items-center justify-between !border-0 !font-normal outline-none focus:!text-primary ${selectedOption && '!border-primary !text-primary'}`}
          hideArrow
        >
          <FlexBox
            flex
            justify='between'
            centerItems
            classname='min-w-[120px] border border-lightPrimary rounded-[4px]'
          >
            <TypographyP
              noBottom
              size={14}
              primary
              classname=' py-1 px-4 truncate max-w-[160px]'
            >
              {t('translation.filesHeading', { files: selectedOption || 0 })}
            </TypographyP>{' '}
            <div className='rounded-r-[4px] bg-lightPrimary px-2 py-2 '>
              <ChevronDown size={16} color={COLORS.PRIMARY} />
            </div>
          </FlexBox>
        </SelectTrigger>
        <SelectContent
          id={id}
          className='min-w-[80px] border-none p-1 text-center'
        >
          {totalCount <= 0 ? (
            <TypographyP noBottom primary size={14} center>
              {t('translation.zeroFiles')}
            </TypographyP>
          ) : (
            Array.from({ length: totalCount || 0 }, (_, num: number) => (
              <SelectItem
                key={num}
                value={`${num + 1}`}
                className={`truncate p-1 text-center ${selectedOption && +selectedOption === num + 1 && 'bg-lightPrimary !text-primary hover:!text-primary'} !bg-none text-[14px] hover:!bg-lightPrimary hover:text-darkGray focus:!bg-lightPrimary focus:!text-primary`}
              >
                {num + 1}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  };

  return renderDropdown();
}

'use client';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ArrowDownUp, ChevronDown } from 'lucide-react';

import FlexBox from '../ui/flexbox';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

type TProps = {
  sortOption?: string;
  setSortOption: Dispatch<SetStateAction<string | undefined>>;
  isDisabled?: boolean;
};

export const sortOptions = [
  { label: 'Date', subLabel: '(Oldest First)', value: 'date' },
  { label: 'Last Name', subLabel: '(A - Z)', value: 'last_name' },
];

export function SortingDropdown({
  sortOption,
  setSortOption,
  isDisabled = false,
}: TProps) {
  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  useEffect(() => {
    setSortOption(sortOption);
  }, []);

  return (
    <Select onValueChange={(val) => handleSortChange(val)}>
      <SelectTrigger
        className={`peer w-[235px] items-center justify-between rounded-[4px] !font-normal outline-none focus:!text-primary ${sortOption && '!border-primary !text-primary'} disabled:pointer-events-none`}
        hideArrow
        disabled={isDisabled}
      >
        <div>
          <FlexBox flex centerItems justify='between'>
            <span className='me-1'>
              <ArrowDownUp size={15} />
            </span>
            <span className='text-[16px]'>Sort by:</span>{' '}
          </FlexBox>
        </div>
        {sortOption &&
          sortOptions?.find((item) => item?.value === sortOption)?.label}
        <ChevronDown size={16} />
      </SelectTrigger>
      <SelectContent className='w-56 border-none'>
        {sortOptions?.map((category) => (
          <SelectItem
            key={category.value}
            value={category.value}
            className={`${category.value === sortOption && 'bg-lightPrimary !text-primary hover:!text-primary'} !bg-none text-[14px] hover:!bg-lightPrimary hover:text-darkGray focus:!bg-lightPrimary focus:!text-primary`}
          >
            {`${category?.label} ${category?.subLabel}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

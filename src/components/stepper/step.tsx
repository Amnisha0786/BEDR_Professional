import React from 'react';

import { stepItems } from '../../lib/constants/data';
import { cn } from '@/lib/utils';
import { TypographyP } from '../ui/typography/p';
import Icon from '../custom-components/custom-icon';

const Step = () => {
  return (
    <div className='mt-5 rounded-[10px] bg-white pl-[14px] pr-[20px] md:w-[240px] md:py-[27px] md:pl-0'>
      <nav className='flex scroll-m-0 scroll-p-0 overflow-x-auto scroll-smooth md:grid md:items-start md:gap-2 md:overflow-hidden'>
        {stepItems.map((item, index) => {
          return (
            <span
              key={index}
              className={cn(
                '!md:rounded-r-[7px] group m-[10px] flex items-center rounded-[7px] py-[15px] font-medium hover:bg-lightPrimary md:m-0 md:rounded-l-none md:pl-[28px]',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
            >
              <div className='flex w-[200px] items-center justify-center md:w-auto md:justify-start'>
                <div className='h-5 w-5'>
                  <Icon
                    name={item?.icon || 'availablity'}
                    width={30}
                    height={22}
                    color={'transparent'}
                    className={'transparent'}
                  />
                </div>
                <TypographyP
                  size={16}
                  classname={`!mb-0 leading-normal pr-[8px] ml-[11px]`}
                >
                  {item.title}
                </TypographyP>
              </div>
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Step;

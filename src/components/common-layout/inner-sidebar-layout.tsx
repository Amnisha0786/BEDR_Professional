'use client';

import { Dispatch, SetStateAction, useCallback } from 'react';

import { cn } from '@/lib/utils';
import { NavItem } from '@/models/types/shared';
import Icon from '../custom-components/custom-icon';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { COLORS } from '@/lib/constants/color';

interface DashboardNavProps {
  items: NavItem[];
  children: React.ReactNode;
  currentStep: string;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  completedSteps?: string[];
  hideCheckMark?: boolean;
}

export default function InnerSidebarLayout({
  items,
  children,
  currentStep,
  setCurrentStep,
  completedSteps,
  hideCheckMark = false,
}: DashboardNavProps) {
  const handleStepClick = useCallback((title: string) => {
    setCurrentStep(title);
  }, []);

  return (
    <FlexBox classname='mt-5 md:gap-x-5'>
      <div className='rounded-[10px] bg-white pl-[14px] pr-[12px] md:pb-[27px] md:pl-0 md:pt-3'>
        <nav className='flex scroll-m-0 scroll-p-0 overflow-x-auto scroll-smooth md:!grid md:items-start md:gap-2 md:overflow-hidden'>
          {items?.map((item, index) => {
            return (
              <>
                <p
                  key={index}
                  className={cn(
                    `!md:rounded-r-[7px] !max-ms:mx-[0px] group m-[10px] flex cursor-pointer items-center rounded-[7px] py-[15px] pl-[16px] pr-[9px] font-medium md:m-0 md:w-[240px] md:rounded-l-none  md:pl-[16px] ${item?.alignTop ? 'items-start' : 'items-center'} rounded-r-[7px] py-[9px] pb-[15px] pt-[14px] font-medium`,
                    currentStep === item?.title && 'bg-lightPrimary',
                    item?.disabled ||
                      item?.textOnly ||
                      (!hideCheckMark && !completedSteps?.includes(item?.title))
                      ? 'cursor-default hover:!bg-none'
                      : 'hover:bg-lightPrimary',
                  )}
                  onClick={() => {
                    if (
                      !item?.disabled &&
                      !item?.textOnly &&
                      (completedSteps?.includes(item?.title) || hideCheckMark)
                    ) {
                      handleStepClick(item?.title);
                    }
                  }}
                >
                  <div className='flex w-max items-center justify-center md:w-full md:justify-between'>
                    <div className='flex h-[23px] w-max items-center max-md:flex-none md:w-full '>
                      {item?.textOnly ? (
                        <TypographyP
                          size={16}
                          noBottom
                          classname={`pr-[8px] max-ms:ml-[-15px] !text-primary`}
                        >
                          {`${item.title}: ${item.value}`}
                        </TypographyP>
                      ) : (
                        <>
                          <div
                            className={`flex ${item?.alignTop ? 'mb-auto' : 'my-auto'} w-[23px]`}
                          >
                            <Icon
                              name={item?.icon || ''}
                              width={23}
                              height={23}
                              color={
                                currentStep === item?.title
                                  ? COLORS.PRIMARY
                                  : 'transparent'
                              }
                              className={`
                        ${item?.padding}
                          ${
                            currentStep === item?.title
                              ? 'svgBlue'
                              : 'transparent'
                          }`}
                            />
                          </div>
                          <TypographyP
                            size={16}
                            noBottom
                            classname={`pr-[8px] ml-[11px]  ${currentStep === item?.title && '!text-primary'}`}
                          >
                            {item.title}
                          </TypographyP>
                        </>
                      )}
                    </div>
                    {completedSteps?.includes(item?.title) && (
                      <div className='h-4 w-4'>
                        <Icon name={'solid-tick'} width={18} height={18} />
                      </div>
                    )}
                  </div>
                </p>
              </>
            );
          })}
        </nav>
      </div>
      <div className='mt-5 w-full md:mt-0'>{children}</div>
    </FlexBox>
  );
}

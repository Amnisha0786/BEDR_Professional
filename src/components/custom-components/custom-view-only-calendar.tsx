'use client';

import React from 'react';
import { Calendar } from 'react-multi-date-picker';
import dayjs from 'dayjs';

import { CALENDAR_HEADER, WEEKDAYS } from '@/lib/constants/shared';
import Icon from './custom-icon';
import { TBooking } from '@/models/types/planner';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import FlexBox from '../ui/flexbox';

type TProps = {
  bookings: TBooking[];
  onChangeDate: (date?: string) => void;
};

const CustomViewOnlyCalendar = ({ bookings, onChangeDate }: TProps) => {
  const getStatusIcon = (date: string) => {
    let iconName: string | undefined = 'blue-dot';
    const highLight: string[] = [];
    bookings?.map((item) => {
      if (
        date > dayjs().format(DATE_FORMAT) ||
        date === dayjs().format(DATE_FORMAT)
      ) {
        if (item?.bookingDate === date) {
          iconName = undefined;
          highLight.push(item?.bookingDate);
        } else {
          iconName = 'blue-dot';
        }
      } else {
        iconName = undefined;
      }
    });

    return { iconName, highLight };
  };
  return (
    <Calendar
      weekDays={WEEKDAYS}
      headerOrder={CALENDAR_HEADER}
      className='multi-locale-days !z-10 min-h-[330px] !w-full !max-w-full bg-white !shadow-none hover:bg-none hover:text-current'
      minDate={dayjs().format(DATE_FORMAT)}
      onFocusedDateChange={(value) => {
        onChangeDate(value?.format(DATE_FORMAT));
      }}
      onChange={() => {
        return false;
      }}
      highlightToday={false}
      maxDate={dayjs().add(2, 'month').endOf('month').format(DATE_FORMAT)}
      renderButton={(
        direction: string,
        handleClick: () => void,
        disable: boolean,
      ) => {
        return (
          <button onClick={handleClick} className='disabled:!opacity-5'>
            {direction === 'right' ? (
              <FlexBox disable={disable}>
                <Icon name='calendar-right-arrow' />
              </FlexBox>
            ) : (
              <FlexBox disable={disable}>
                <Icon name='calendar-left-arrow' />
              </FlexBox>
            )}
          </button>
        );
      }}
      mapDays={({ date }) => {
        const { iconName, highLight } = getStatusIcon(
          date?.format(DATE_FORMAT),
        );
        return {
          children: (
            <div
              className={`flex ${highLight.includes(date?.format(DATE_FORMAT)) && 'highLight !w-[24px] py-0.5 !pr-2'} m-auto !w-[24px] flex-col items-center pl-[8px] py-0.5 !pr-2 text-[12px]`}
            >
              <div className='text-start'>{date ? date?.format('D') : '-'}</div>
              {!highLight.includes(date?.format(DATE_FORMAT)) &&
                iconName &&
                (date.format(DATE_FORMAT) === dayjs().format(DATE_FORMAT) ||
                  date.format(DATE_FORMAT) > dayjs().format(DATE_FORMAT)) && (
                  <div className='m-auto h-[0px] w-[6px]'>
                    <Icon name={iconName || ''} width={14} height={14} />
                  </div>
                )}
            </div>
          ),
        };
      }}
    />
  );
};

export default CustomViewOnlyCalendar;

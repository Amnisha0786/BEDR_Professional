import React from 'react';
import { FieldError } from 'react-hook-form';
import DatePicker, { DatePickerProps } from 'react-multi-date-picker';
import Toolbar from 'react-multi-date-picker/plugins/toolbar';
import 'react-multi-date-picker/styles/layouts/mobile.css';

import { cn } from '@/lib/utils';

interface IProps extends DatePickerProps {
  classname?: string;
  label?: string;
  error?: FieldError;
}

const CustomDatepicker = React.forwardRef<
  HTMLInputElement & DatePickerProps,
  IProps
>(({ classname, label, error, ...props }) => {
  const defaultClasses = `flex peer !min-h-[55px] w-full relative rounded-md px-3 bg-secondary  border-[1.7px] text-darkGray text-[18px] ${error && 'border-error ring-red-300'} font-medium pt-6 pb-1 text-darkGray focus-visible:outline-none  focus-visible:ring-2  focus-visible:ring-2   focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-90 disabled:darkGray transition-all`;
  return (
    <div className='relative'>
      <DatePicker
        {...props}
        className='!block w-full'
        inputClass={cn(defaultClasses, classname)}
        format='DD/MM/YYYY'
        highlightToday={false}
        onOpenPickNewDate={false}
        placeholder=''
        monthYearSeparator='|'
        maxDate={new Date()}
        containerClassName='hover:bg-lightPrimary'
        showOtherDays
        weekDays={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
        plugins={[
          <Toolbar
            key={'1'}
            position='bottom'
            className='flex !justify-between'
            sort={['today', 'deselect']}
            names={{ today: 'Today', deselect: 'Clear', close: '' }}
          />,
        ]}
      />
      <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-[0] top-[6px]  flex h-full w-full select-none !overflow-visible truncate text-[14px] leading-tight text-gray transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:block  before:h-1.5 before:w-2.5 before:transition-all  after:pointer-events-none after:ml-1 after:mt-[6.5px] after:block  after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:transition-all peer-placeholder-shown:leading-[3.15] peer-focus:text-[14px] peer-focus:!font-extralight peer-focus:leading-normal">
        {label}
      </label>
    </div>
  );
});

CustomDatepicker.displayName = 'CustomDatepicker';

export { CustomDatepicker };

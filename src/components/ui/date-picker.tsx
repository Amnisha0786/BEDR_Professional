import React from 'react';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { FieldError } from 'react-hook-form';
import { SelectSingleEventHandler } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { FormControl } from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';

export interface InputProps {
  label: string;
  value: string;
  onChange?: SelectSingleEventHandler;
  error?: FieldError;
}

const DatePicker = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label = '', error, ...props }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <div className='relative'>
              <div
                className={cn(
                  `h-15 disabled:darkGray relative flex w-full rounded-md  border-[1.7px] bg-secondary px-3 pb-1 pt-6 text-[18px] ${error && '!border-error !ring-red-300'} font-medium text-darkGray focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-90`,
                )}
              >
                {props?.value ? (
                  dayjs(props?.value)?.format('DD/MM/YYYY')
                ) : (
                  <span className='font-semibold text-darkGray opacity-50'>
                    Pick a date
                  </span>
                )}
                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
              </div>
              <label className='absolute left-[0.90rem] top-[5px] text-[14px] text-gray'>
                {label}
              </label>
            </div>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={new Date(props?.value)}
            onSelect={props.onChange}
            disabled={(date) =>
              date > new Date() || date < new Date('1900-01-01')
            }
            className='rounded-md'
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };

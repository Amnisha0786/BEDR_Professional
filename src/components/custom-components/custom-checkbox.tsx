'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getColorCode } from '../file-in-progress/get-color-code';
import { COLORS } from '@/lib/constants/color';

interface IProps {
  label?: React.ReactNode;
  id?: string;
  checked?: boolean;
  disableCursorAllowed?: boolean;
  fieldColor?: string;
  labelClass?: string;
}

const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & IProps
>(
  (
    {
      className,
      label,
      id,
      checked,
      disableCursorAllowed,
      disabled,
      fieldColor,
      labelClass,
      ...props
    },
    ref,
  ) => {
    const colorCode = React.useMemo(() => {
      if (fieldColor) {
        return getColorCode(fieldColor);
      }
    }, [fieldColor]);
    return (
      <>
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            `data-[state=checked]:text-primary-foreground peer hidden !h-[18px] !w-[18px] shrink-0 rounded-[2px] border border-primary ring-primary ring-offset-background focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:opacity-50 disabled:!cursor-${disableCursorAllowed ? 'auto' : 'not-allowed'} data-[state=checked]:bg-primary`,
            className,
          )}
          id={id}
          disabled={disabled}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn('flex items-center justify-center text-current')}
          >
            <Check className='h-4 w-4 text-white' />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <label
          htmlFor={id}
          className={cn(
            `hover:text-gray-600 hover:bg-gray-100 max-ms:peer inline-flex min-h-9 w-full cursor-pointer items-center justify-center rounded-[4px] border border-transparent bg-backgroundGray px-6 py-[6px] text-[16px] text-gray peer-checked:border max-sm:justify-start max-ms:flex md:!min-w-40 ${checked && 'border-primary bg-lightPrimary text-primary '} peer-checked:border-primary peer-checked:bg-lightPrimary peer-checked:text-primary dark:hover:text-gray`,
            disabled && disableCursorAllowed ? 'cursor-auto' : 'not-allowed',
            labelClass,
          )}
          style={{
            backgroundColor: checked ? colorCode?.background : '',
            color: checked ? colorCode?.border : '',
            borderColor: checked ? colorCode?.border || COLORS.PRIMARY : '',
          }}
        >
          <div className='block max-ms:w-full'>
            <div className='w-full'>{label}</div>
          </div>
        </label>
      </>
    );
  },
);
CustomCheckbox.displayName = CheckboxPrimitive.Root.displayName;

export { CustomCheckbox };

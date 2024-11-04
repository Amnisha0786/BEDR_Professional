'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getColorCode } from '../file-in-progress/get-color-code';
import { COLORS } from '@/lib/constants/color';

type Iprops = {
  label: React.ReactNode;
  disableCursorAllowed?: boolean;
  fieldColor?: string;
  labelClass?: string;
};

const CustomRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('peer grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
CustomRadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const CustomRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & Iprops
>(
  (
    {
      className,
      label,
      fieldColor,
      disableCursorAllowed,
      disabled,
      checked,
      labelClass,
      ...props
    },
    ref,
  ) => {
    const { id } = props;
    const colorCode = React.useMemo(() => {
      if (fieldColor) {
        return getColorCode(fieldColor);
      }
    }, [fieldColor]);

    return (
      <>
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cn('peer hidden rounded-full', className)}
          disabled={disabled}
          {...props}
        >
          <RadioGroupPrimitive.Indicator>
            <Circle className='h-2.5 w-2.5 fill-current text-current' />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>

        <label
          htmlFor={id}
          className={cn(
            `hover:text-gray-600 hover:bg-gray-100 min-md:text-[16px] inline-flex min-h-9 cursor-pointer items-center justify-center rounded-[4px] border border-transparent bg-backgroundGray px-6 py-[6px] text-gray peer-checked:border max-ms:text-[14px] md:!min-w-40 ${checked && 'border-primary bg-lightPrimary text-primary '} peer-checked:border-primary peer-checked:bg-lightPrimary peer-checked:text-primary dark:hover:text-gray`,
            disabled && disableCursorAllowed ? 'cursor-auto' : 'not-allowed',
            labelClass,
          )}
          style={{
            backgroundColor: checked ? colorCode?.background : '',
            color: checked ? colorCode?.border : '',
            borderColor: checked ? colorCode?.border || COLORS.PRIMARY : '',
          }}
        >
          <div className='block'>
            <div className='w-full'>{label}</div>
          </div>
        </label>
      </>
    );
  },
);
CustomRadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { CustomRadioGroup, CustomRadioGroupItem };

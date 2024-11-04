'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';
import { getColorCode } from '../file-in-progress/get-color-code';
import { COLORS } from '@/lib/constants/color';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  error?: FieldError;
  checked?: boolean;
  rightLabel?: string;
  rightLabelClass?: string;
  leftLabel?: string;
  containerClass?: string;
  defaultVal?: string;
  isIOP?: boolean;
  disableCursorAllowed?: boolean;
  fieldColor?: string;
  hideOutline?: boolean;
}

const ReferralFormInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = 'secondary',
      rightLabel,
      checked,
      error,
      placeholder = 'Type here...',
      rightLabelClass = '',
      leftLabel = '',
      containerClass,
      defaultVal,
      isIOP = false,
      disabled,
      disableCursorAllowed = false,
      fieldColor,
      hideOutline = false,
      ...props
    },
    ref,
  ) => {
    const colorCode = React.useMemo(() => {
      if (fieldColor) {
        return getColorCode(fieldColor);
      }
    }, [fieldColor]);

    const { value } = props;
    const variantClasses = {
      primary: 'bg-primary text-white outline-none',
      secondary: `bg-backgroundGray ${(checked || value) && 'bg-lightPrimary text-primary'} ml-2  text-darkGray`,
      outlined: 'border border-input bg-transparent text-sm',
    };

    const defaultClasses = `flex font-normal peer ${rightLabel && 'pe-[25%]'} relative hover:!outline-none !outline-none focus:!outline-none px-0 !ml-0 max-ms:text-[14px] ms:text-[16px] ${error && 'border-error ring-red-300'} font-normal text-darkGray ${disabled && 'cursor-not-allowed'}  ${disabled && disableCursorAllowed && 'cursor-auto'} disabled:opacity-90 disabled:darkGray focus:border-transparent transition-all`;

    return (
      <div
        className={`relative flex items-center border border-transparent ${value && !isIOP && 'border-primary bg-lightPrimary'} ${containerClass}`}
        style={{
          backgroundColor: checked || value ? colorCode?.background : '',
          color: checked || value ? colorCode?.border || COLORS.PRIMARY : '',
          borderColor:
            (checked || value) && !hideOutline
              ? colorCode?.border || COLORS.PRIMARY
              : 'transparent',
        }}
      >
        {rightLabel && (
          <span
            className={`absolute right-[3px] z-10 text-gray max-ms:text-[14px] ms:text-[16px] ${rightLabelClass} ${value && 'text-primary'}`}
            style={{
              backgroundColor: checked || value ? colorCode?.background : '',
              color:
                checked || value ? colorCode?.border || COLORS.PRIMARY : '',
              borderColor:
                checked || value ? colorCode?.border || COLORS.PRIMARY : '',
            }}
          >
            {rightLabel}
          </span>
        )}

        {leftLabel && (
          <span
            className={`text-gray max-ms:text-[14px] ms:text-[16px] ${rightLabelClass} ${value && 'text-primary'}`}
            style={{
              backgroundColor: checked || value ? colorCode?.background : '',
              color:
                checked || value ? colorCode?.border || COLORS.PRIMARY : '',
              borderColor:
                checked || value ? colorCode?.border || COLORS.PRIMARY : '',
            }}
          >
            {leftLabel}
          </span>
        )}
        <span
          className={`z-10 ml-2 mr-0${defaultVal ? 'min-w-[20px]' : 'min-w-[10px]'} text-[16px] text-gray  ${value && 'text-primary'}`}
        >
          {defaultVal}
        </span>

        <input
          type={type}
          className={cn(defaultClasses, variantClasses[variant], className)}
          ref={ref}
          {...props}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete='off'
          style={{
            backgroundColor: checked || value ? colorCode?.background : '',
            color: checked || value ? colorCode?.border || COLORS.PRIMARY : '',
            borderColor:
              (checked || value) && !hideOutline
                ? colorCode?.border || COLORS.PRIMARY
                : 'transparent',
          }}
        />
      </div>
    );
  },
);

ReferralFormInput.displayName = 'Input';

export { ReferralFormInput };

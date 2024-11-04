import * as React from 'react';

import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

export interface InputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  error?: FieldError;
  checked?: boolean;
  rightLabel?: string;
  rightLabelClass?: string;
  leftLabel?: string;
  containerClass?: string;
  defaultVal?: string;
}

const ReferralFormTextarea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      variant = 'secondary',
      rightLabel,
      checked,
      error,
      placeholder = 'Type here...',
      containerClass,
      ...props
    },
    ref,
  ) => {
    const { value } = props;
    const variantClasses = {
      primary: 'bg-primary text-white outline-none',
      secondary: `bg-backgroundGray ${(checked || value) && 'bg-lightPrimary !text-primary'}  text-darkGray`,
      outlined: 'border border-input bg-transparent text-sm',
    };

    const defaultClasses = `flex font-normal peer ${rightLabel && 'pe-[25%]'} max-ms:w-full  max-h-[141px]  relative hover:!outline-none !outline-none  focus:!outline-none px-0 !ml-0 text-[16px] ${error && 'border-error ring-red-300'} font-normal  text-darkGray  disabled:cursor-not-allowed disabled:opacity-90 disabled:darkGray  transition-all`;

    return (
      <div
        className={`relative  flex items-center border border-transparent max-ms:w-full ${value && '!border-primary bg-lightPrimary'} ${containerClass}`}
      >
        <textarea
          className={cn(defaultClasses, variantClasses[variant], className)}
          ref={ref}
          {...props}
          placeholder={placeholder}
          autoComplete='off'
        />
      </div>
    );
  },
);

ReferralFormTextarea.displayName = 'Input';

export { ReferralFormTextarea };

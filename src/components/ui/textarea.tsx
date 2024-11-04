import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  label?: string;
  showCount?: boolean;
  count?: number;
  error?: string;
  containerClass?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      showCount,
      maxLength,
      variant = 'secondary',
      label,
      error,
      count = 0,
      containerClass = '',
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary text-darkGray',
      outlined: 'border border-input bg-transparent text-sm',
    };

    const defaultClasses = `peer !min-h-[40px] focus:outline-none w-full relative rounded-md px-3 text-[16px] ${count > 0 && '!bg-lightPrimary !text-primary'} ${error && 'border-error ring-red-300'} py-5  text-darkGray focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-90 disabled:darkGray`;

    return (
      <div
        className={cn(
          'relative rounded-[4px] border border-transparent bg-secondary pb-5 md:max-w-[717px]',
          {
            '!border-primary !bg-lightPrimary': count > 0,
          },
          containerClass
        )}
      >
        {showCount && (
          <p
            className={`absolute bottom-[3px] right-[10px] z-10 mb-1 ${count > 0 ? '!bg-lightPrimary !text-primary' : 'bg-secondary'} bg-secondary text-right text-[12px] text-gray `}
          >
            {`${count || 0}  / ${maxLength}`}
          </p>
        )}
        <textarea
          className={cn(defaultClasses, variantClasses[variant], className)}
          ref={ref}
          maxLength={maxLength}
          {...props}
        />

        {label && (
          <label className='absolute left-[0.90rem] top-[5px] text-xs'>
            {label}
          </label>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };

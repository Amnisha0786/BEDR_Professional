import * as React from 'react';
import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  label: string;
  error?: FieldError;
}

const MobileInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'secondary', label = '', error, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary border-[1.7px] ps-[3.3rem] text-darkGray',
      outlined: 'border border-input bg-transparent text-sm',
    };

    const defaultClasses = `peer !min-h-[55px]  w-full relative rounded-md px-3 text-[18px] ${error && 'border-error ring-red-300'} font-medium pt-6 pb-1  text-darkGray focus-visible:outline-none focus-visible:ring-2  focus-visible:ring-2   focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-90 disabled:darkGray`;

    return (
      <div className='relative w-full'>
        <span className='absolute left-[0.90rem] top-[25px] z-10 text-[18px] font-bold text-[#474f69] '>
          +44
        </span>
        <input
          type={'text'}
          className={cn(defaultClasses, variantClasses[variant], className)}
          ref={ref}
          {...props}
          placeholder=''
        />

        <label className='absolute left-[0.90rem] top-[5px] text-[14px] text-gray'>
          {label}
        </label>
      </div>
    );
  },
);

MobileInput.displayName = 'MobileInput';

export { MobileInput };

import * as React from 'react';

import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  label?: string;
  error?: FieldError;
  isContactNumber?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = 'secondary',
      label = '',
      isContactNumber = false,
      error,
      placeholder = '',
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      primary: 'bg-primary text-white',
      secondary: `bg-secondary border-[1.7px] border-lightGray ${isContactNumber && 'ps-[3.3rem]'}  text-darkGray`,
      outlined: 'border border-input bg-transparent text-sm',
    };

    const defaultClasses = `flex peer min-h-[55px] w-full relative rounded-md px-3 text-[18px]   ${error && '!border-error ring-red-300'} font-medium pt-6 pb-1  text-darkGray focus:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-90 disabled:darkGray `;

    return (
      <div className='relative w-full'>
        {isContactNumber && (
          <span className='absolute left-[0.90rem] top-[25px] z-[1] text-[18px] font-bold text-[#474f69]'>
            +44
          </span>
        )}
        <input
          type={type}
          className={cn(defaultClasses, variantClasses[variant], className)}
          ref={ref}
          {...props}
          placeholder={placeholder}
          autoComplete='off'
        />
        {label && (
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-[0] top-[7px]  flex h-full w-full select-none !overflow-visible truncate text-[14px] text-darkGray transition-all before:pointer-events-none before:mr-1 before:mt-[6px]  before:block before:h-1.5 before:w-2.5  before:transition-all after:pointer-events-none after:ml-1 after:mt-[6px]  after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:transition-all  peer-focus:leading-normal peer-focus:!text-gray">
            {label}
          </label>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };

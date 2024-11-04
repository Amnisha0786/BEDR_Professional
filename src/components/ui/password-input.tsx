import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FieldError } from 'react-hook-form';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  label: string;
  error?: FieldError;
}

const Password = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant = 'secondary', label = '', error, ...props },
    ref,
  ) => {
    const variantClasses = {
      primary: 'bg-primary text-white',
      secondary: 'bg-secondary border-[1.7px] border-lightGray   text-darkGray',
      outlined: 'border border-input bg-transparent text-sm',
    };

    const defaultClasses = `flex  w-full relative rounded-md px-3 text-[18px]  font-medium pt-6 pb-1  ${error && '!border-error ring-red-300'} text-darkGray focus:border-primary focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-90 disabled:darkGray  `;

    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(defaultClasses, variantClasses[variant], className)}
          ref={ref}
          {...props}
          placeholder=''
          autoComplete="new-password"
        />
        {type === 'password' && (
          <div
            className='absolute right-3 top-[22px] cursor-pointer'
            onClick={togglePasswordVisibility}
          >
            <Image
              src={showPassword ? '/assets/eye-on.svg' : '/assets/eye-off.svg'}
              alt='icon'
              height={20}
              width={23}
            />
          </div>
        )}
        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-[0] top-[7px]  flex h-full w-full select-none !overflow-visible truncate text-[14px] text-darkGray transition-all before:pointer-events-none before:mr-1 before:mt-[6px]  before:block before:h-1.5 before:w-2.5  before:transition-all after:pointer-events-none after:ml-1 after:mt-[6px]  after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:transition-all peer-placeholder-shown:leading-[3.17] peer-focus:leading-normal peer-focus:!text-gray">
          {label}
        </label>
      </div>
    );
  },
);

Password.displayName = 'PasswordInput';

export { Password };

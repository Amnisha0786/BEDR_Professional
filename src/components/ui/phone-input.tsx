'use client';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';

import * as RPNInput from 'react-phone-number-input';

import flags from 'react-phone-number-input/flags';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input, InputProps } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void;
    label?: string;
    error?: FieldError;
    inputClass?: string;
    isFocus?: boolean;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    (
      { className, error, onChange, label, isFocus, inputClass, ...props },
      ref,
    ) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn('flex', className)}
          flagComponent={FlagComponent}
          countrySelectComponent={(countrySelectProps) => (
            <CountrySelect
              {...countrySelectProps}
              error={error}
              isFocus={isFocus}
            />
          )}
          focusInputOnCountrySelection
          inputComponent={InputComponent}
          onChange={(value) => {
            onChange?.(value || ('' as RPNInput.Value));
          }}
          defaultCountry='GB'
          label={label}
          error={error}
          inputClass={inputClass}
          international
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = 'PhoneInput';

type IProps = {
  inputClass?: string;
};

const InputComponent = React.forwardRef<HTMLInputElement, InputProps & IProps>(
  ({ label, className, inputClass, error, ...props }, ref) => {
    return (
      <div className='relative w-full'>
        <Input
          className={cn(
            `!focus:ring-0 peer rounded-e-lg rounded-s-none  ring-0 ring-transparent ${error && '!border-error'}`,
            `${className} ${inputClass}`,
          )}
          autoComplete='off'
          {...props}
          ref={ref}
        />
        <label className='absolute left-[0.90rem] top-[5px] text-[14px] text-darkGray'>
          {label}
        </label>
      </div>
    );
  },
);
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
  error: FieldError;
  isFocus: boolean;
};

const CountrySelect = ({
  value,
  onChange,
  options,
  error,
  disabled,
  isFocus,
}: CountrySelectProps) => {
  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  return (
    <div>
      <Popover>
        <PopoverTrigger
          asChild
          disabled={disabled}
          className='disabled:!cursor-not-allowed disabled:!opacity-90'
        >
          <Button
            type='button'
            variant={'outline'}
            className={cn(
              `flex !h-full gap-1 rounded-e-none rounded-s-lg border-[1.7px] !border-r-0  ${isFocus ? '!border-primary' : 'border-[#dddfe4] '}   bg-secondary px-3 pb-1 hover:bg-lightPrimary hover:text-primary focus:bg-lightPrimary focus:text-primary ${error && '!border-error'}`,
            )}
          >
            <FlagComponent country={value} countryName={value} />
            <ChevronsUpDown className={cn('-mr-2 h-4 w-4')} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='max-h-[400px] w-[300px] overflow-x-auto p-0'>
          <Command defaultValue={'UK'}>
            <CommandList>
              <>
                <CommandInput
                  placeholder='Search country...'
                  className='!sticky'
                />
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup className='h-[400px] overflow-y-auto'>
                  {options
                    .filter((x) => x.value)
                    .map((option) => (
                      <CommandItem
                        className='gap-2 py-2'
                        key={option.value}
                        disabled={false}
                        onSelect={() => handleSelect(option.value)}
                        defaultValue={'UK'}
                      >
                        <FlagComponent
                          country={option.value}
                          countryName={option.label}
                        />
                        <span className='flex-1 text-sm'>{option.label}</span>
                        {option.value && (
                          <span className='text-sm'>
                            {`+${RPNInput.getCountryCallingCode(option.value)}`}
                          </span>
                        )}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            option.value === value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className='flex h-4 w-6 overflow-hidden rounded-sm'>
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };

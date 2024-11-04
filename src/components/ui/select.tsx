'use client';

import * as React from 'react';
import { FieldError } from 'react-hook-form';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp, LoaderIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import styles from '../custom-components/styles.module.css';
import LimitedText from '../custom-components/limited-text';
import Icon from '../custom-components/custom-icon';
export interface Options {
  label: string;
  value: string;
}

export interface IProps {
  hideArrow?: boolean;
}

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & IProps
>(({ className, children, hideArrow = false, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full max-ms:w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm text-darkGray ring-offset-background placeholder:text-lightGray focus:outline-none focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}

    {!hideArrow && (
      <SelectPrimitive.Icon asChild>
        <Icon name={'chevron-down'} />
      </SelectPrimitive.Icon>
    )}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp className='h-4 w-6' />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown className='h-4 w-4' />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 mt-2 max-h-96 min-w-[0] overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md placeholder:text-lightGray data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-2',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-2 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative mb-1  flex w-full cursor-pointer select-none items-center rounded-sm py-3 pl-6 pr-2 text-[16px] font-medium outline-none placeholder:text-lightGray focus:bg-primary focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  label?: string;
  options?: Options[];
  value?: string;
  placeholder?: string;
  defaultValue?: string;
  onChangeValue?: (value?: string) => void;
  icon?: React.ReactNode;
  error?: FieldError;
  customDropdown?: React.ReactNode;
  containerClass?: string;
  loading?: boolean;
}

const SelectDropDown = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      variant = 'secondary',
      label = '',
      options,
      placeholder = 'Select',
      onChangeValue,
      defaultValue = '',
      error,
      icon,
      customDropdown,
      containerClass = '',
      loading = false,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      primary: 'bg-primary text-white',
      secondary:
        'bg-secondary  focus:outline-none select:outline-none placeholder:text-lightGray',
      outlined: 'border border-input bg-transparent text-sm',
    };
    const defaultClasses = `flex !min-h-[55px] h-15 w-full placeholder:text-lightGray border-[1.7px] relative rounded-md px-3 text-[18px] ${error && '!border-error !ring-red-300'}  pt-6 pb-1 text-darkGray focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-90`;

    return (
      <div className={`relative ${containerClass}`}>
        <Select onValueChange={onChangeValue} defaultValue={defaultValue}>
          <SelectTrigger
            className={cn(defaultClasses, variantClasses[variant], className)}
            disabled={props?.disabled}
          >
            {loading ? (
              <LoaderIcon size={15} className='m-auto h-4 w-4 animate-spin' />
            ) : (
              <SelectValue
                {...props}
                ref={ref}
                placeholder={placeholder}
                className='placeholder:!text-lightGray'
              />
            )}
          </SelectTrigger>
          {customDropdown ? (
            customDropdown
          ) : (
            <SelectContent className='border'>
              {options?.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <span className={styles.selectMenuListSm}>
                    <LimitedText text={category.label} textLength={18} />
                  </span>
                  <span className={styles.selectMenuListMd}>
                    <LimitedText text={category.label} />
                  </span>
                  <span className={styles.selectMenuList}>
                    <LimitedText text={category.label} textLength={22} />
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>

        {label && (
          <label className='absolute left-[0.90rem] top-[5px] flex items-center text-[14px] text-gray'>
            {label}
            {icon && <span className='ml-1 cursor-pointer'>{icon}</span>}
          </label>
        )}
      </div>
    );
  },
);

SelectDropDown.displayName = 'SelectDropDown';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectDropDown,
};

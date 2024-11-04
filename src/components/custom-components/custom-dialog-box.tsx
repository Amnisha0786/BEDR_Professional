'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { TypographyH2 } from '../ui/typography/h2';
import { TypographyP } from '../ui/typography/p';

type TProps = {
  loading: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleConfirm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  cancelButtomClass?: string;
  confirmButtonClass?: string;
  className?: string;
  hideCancelButton?: boolean;
  heading: string;
  icon?: string;
  hiddencross?: boolean;
  subModal?: boolean;
  maxWidth?: number;
};

const CustomDialogBox = ({
  loading,
  setOpen,
  handleConfirm,
  title = '',
  cancelButtonText = 'No',
  confirmButtonText = 'Yes',
  cancelButtomClass,
  confirmButtonClass,
  className,
  hideCancelButton,
  heading = '',
  icon,
  hiddencross = false,
  maxWidth = 350,
}: TProps) => {
  return (
    <DialogContent
      onFocusOutside={(e) => e.preventDefault()}
      className={`!max-w-[${maxWidth}px] p-7 ${className} rounded-[6px]`}
      oulinedCross
      onInteractOutside={(e) => (hiddencross ? e.preventDefault() : true)}
      hidecross={hiddencross}
      autoFocus={false}
    >
      <DialogHeader>
        <DialogTitle className='text-center'>
          {icon && (
            <Image
              src={`/assets/${icon}.svg`}
              alt={icon}
              width={56}
              height={56}
              className='mx-auto mb-3 h-14 w-14'
            />
          )}
          <TypographyH2 size={20} classname='mb-3'>
            {heading}
          </TypographyH2>
          <TypographyP size={14} noBottom primary classname='font-normal'>
            {title}
          </TypographyP>
        </DialogTitle>
      </DialogHeader>
      <DialogFooter
        className={`${hideCancelButton && '!flex-col !justify-center'} m-auto justify-center`}
      >
        {!hideCancelButton && (
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            className={
              cancelButtomClass
                ? cancelButtomClass
                : ' min-w-[120px] !bg-primary text-[16px] text-white outline-none'
            }
          >
            {cancelButtonText}
          </Button>
        )}
        <Button
          variant={'outline'}
          className={
            confirmButtonClass
              ? confirmButtonClass
              : 'min-w-[120px] border-[1.7px] text-[16px] font-medium outline-none'
          }
          onClick={(e) => handleConfirm(e)}
          disabled={loading}
          loading={loading}
          center
        >
          {confirmButtonText}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CustomDialogBox;

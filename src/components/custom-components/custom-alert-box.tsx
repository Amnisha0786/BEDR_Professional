import React, { Dispatch, SetStateAction } from 'react';
import { LoaderIcon } from 'lucide-react';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { TypographyP } from '../ui/typography/p';
import i18next from '@/localization';
import { cn } from '@/lib/utils';

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
  saveLaterText?: string;
  saving?: boolean;
  handleSave?: () => void;
};

const t = i18next.t;

const CustomAlertBox = ({
  loading,
  setOpen,
  handleConfirm,
  title = t('translation.areYouSureToLogOut'),
  cancelButtonText = t('translation.no'),
  confirmButtonText = t('translation.yes'),
  cancelButtomClass,
  confirmButtonClass,
  className,
  saveLaterText,
  handleSave,
  saving,
}: TProps) => {
  return (
    <AlertDialogContent
      onFocusOutside={(e) => e.preventDefault()}
      className={`w-[464px] px-[54px] pb-[52px] pt-[40px] focus:outline-none max-ms:w-[90%] ${className}`}
    >
      <AlertDialogHeader>
        <AlertDialogTitle className='text-center text-[20px] font-medium text-gray'>
          {title}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          disabled={loading || saving}
          onClick={() => setOpen(false)}
          className={
            cancelButtomClass
              ? cancelButtomClass
              : 'w-full !bg-primary text-white outline-none'
          }
        >
          {cancelButtonText}
        </AlertDialogCancel>
        <AlertDialogAction
          className={
            confirmButtonClass
              ? confirmButtonClass
              : 'w-full border-[1.7px]  !bg-white text-primary outline-none hover:text-primary hover:opacity-80 focus:text-primary'
          }
          onClick={(e) => handleConfirm(e)}
          disabled={loading || saving}
        >
          {loading ? (
            <LoaderIcon className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            confirmButtonText
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
      {saveLaterText &&
        (saving ? (
          <TypographyP
            center
            noBottom
            classname='text-primary pointer-events-none underline'
          >
            {t('translation.saving')}
          </TypographyP>
        ) : (
          <TypographyP
            center
            noBottom
            classname={cn(`text-primary underline cursor-pointer`, {
              'pointer-events-none': loading,
            })}
            onClick={handleSave}
          >
            {saveLaterText}
          </TypographyP>
        ))}
    </AlertDialogContent>
  );
};

export default CustomAlertBox;

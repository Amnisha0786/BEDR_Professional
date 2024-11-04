'use client';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FlexBox from '@/components/ui/flexbox';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import CustomAlertBox from '@/components/custom-components/custom-alert-box';
import { cancelFileIpad } from '@/app/api/create-patient-request';
import { getErrorMessage } from '@/lib/utils';

type TProps = {
  fileId?: string;
  onDiscardFileSuccess: () => void;
};

const CloseFileIpad = ({ fileId, onDiscardFileSuccess = () => {} }: TProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const handleConfirm = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      try {
        if (!fileId) {
          return;
        }
        setOpen(true);
        setLoading(true);
        const response = await cancelFileIpad(fileId);
        if (response?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          toast.success(t('translation.fileClosed'));
          onDiscardFileSuccess();
          router.push('/ipad/practice');
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
        setOpen(false);
      }
    },
    [fileId],
  );

  return (
    <FlexBox flex classname='justify-end'>
      <FlexBox flex centerContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger className='!outline-none'>
            <Button className='peer rounded-[4px] border border-error bg-white px-3 text-[16px] text-error !outline-none hover:bg-error hover:text-white focus:bg-error focus:text-white xs:text-[14px] md:!px-6'>
              <X className='mr-1 h-5 w-5 xs:h-4 xs:w-4' />
              {t('translation.closeFile')}
            </Button>
          </AlertDialogTrigger>

          <CustomAlertBox
            loading={loading}
            setOpen={setOpen}
            handleConfirm={handleConfirm}
            title={t('translation.closeFileConfirmation')}
            cancelButtonText={t('translation.cancel')}
            confirmButtonText={t('translation.confirm')}
            cancelButtomClass='w-full !bg-error border-error text-white outline-none'
            confirmButtonClass='w-full border-[1.7px] border-error !bg-white text-error outline-none hover:text-error hover:opacity-80 focus:text-error'
          />
        </AlertDialog>
      </FlexBox>
    </FlexBox>
  );
};

export default CloseFileIpad;

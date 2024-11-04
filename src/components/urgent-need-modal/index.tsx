'use client';

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { CircleX } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import FlexBox from '@/components/ui/flexbox';
import { DialogContent } from '@/components/ui/dialog';
import { TypographyP } from '../ui/typography/p';
import { getErrorMessage } from '@/lib/utils';
import Icon from '../custom-components/custom-icon';
import { urgentAlertStatus } from '@/app/api/todays-clinics';
import { ALERT_STATUS } from '@/enums/todays-clinics';

type TProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  urgentBookingId: string;
};

const UrgentNeedForBookings = ({
  setOpen = () => {},
  urgentBookingId,
}: TProps) => {
  const [confirming, setConfirming] = useState(false);
  const [cancelingRequest, setCancelingRequest] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const handleConfirm = useCallback(
    async (status: ALERT_STATUS) => {
      if (!urgentBookingId) {
        return;
      }

      if (status === ALERT_STATUS.ACCEPTED) {
        setConfirming(true);
      } else {
        setCancelingRequest(true);
      }

      try {
        const response = await urgentAlertStatus({
          urgentRequestId: urgentBookingId,
          bookingAlertStatus: status,
        });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        if (status === ALERT_STATUS.ACCEPTED) {
          router.push('/planner');
        }
        setOpen(false);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setConfirming(false);
        setCancelingRequest(false);
      }
    },
    [urgentBookingId],
  );

  return (
    <DialogContent
      autoFocus={false}
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      onFocusOutside={(e) => e.preventDefault()}
      onClick={(e) => e.preventDefault()}
      className={`max-h-[600px] w-[380px]  !gap-0 border-none !p-0 px-0 pb-[25px] text-left outline-none md:min-w-[600px]`}
      hidecross
    >
      <div className='mb-5 bg-error !p-0'>
        <FlexBox flex justify='between'>
          <FlexBox flex centerItems centerContent classname='flex-1'>
            <Icon name='urgent' color='transparent' />
            <TypographyP
              size={16}
              center
              noBottom
              classname='px-1 py-4 text-center font-medium text-white'
            >
              {t('translation.urgent')}
            </TypographyP>
          </FlexBox>
          <div
            onClick={() => {
              setOpen(false);
            }}
            className='cursor-pointer'
          >
            <CircleX className='mr-4 mt-5 h-4 w-4' color='white' />
          </div>
        </FlexBox>
      </div>
      <div className='flex justify-center'>
        <TypographyP
          size={14}
          noBottom
          primary
          center
          classname='font-normal w-[90%]'
        >
          {t('translation.uergentBookingDescription')}
        </TypographyP>
      </div>
      <FlexBox
        flex
        centerContent
        centerItems
        classname='gap-4 mt-8 pb-6 md:flex-row flex-col'
      >
        <Button
          className='min-w-[200px] text-[16px]'
          variant={'outline'}
          loading={cancelingRequest}
          disabled={confirming || cancelingRequest}
          onClick={() => handleConfirm(ALERT_STATUS.REJECTED)}
        >
          {t('translation.sorryIamUnableToHelp')}
        </Button>
        <Button
          className='min-w-[200px] text-[16px]'
          loading={confirming}
          disabled={confirming || cancelingRequest}
          onClick={() => handleConfirm(ALERT_STATUS.ACCEPTED)}
        >
          {t('translation.yesIcanHelp')}
        </Button>
      </FlexBox>
    </DialogContent>
  );
};

export default UrgentNeedForBookings;

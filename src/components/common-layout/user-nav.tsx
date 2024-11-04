'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@/ui/avatar';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { UserData } from '@/lib/userProfile/userProfileSlice';
import { AlertDialog } from '../ui/alert-dialog';
import { logOutUser } from '@/app/api/auth';
import { getErrorMessage } from '@/lib/utils';
import CustomAlertBox from '../custom-components/custom-alert-box';
import { getImageUrl } from '@/lib/common/getImageUrl';
import LimitedText from '../custom-components/limited-text';
import { clearDataOnLogout } from '@/lib/common/clear-data-on-logout';
import useSocket from '@/hooks/useSocket';

type TProps = {
  userProfile?: UserData | null;
  isIpadView?: boolean;
};

export function UserNav({ userProfile, isIpadView = false }: TProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshToken = useMemo(() => {
    return Cookies.get(`${isIpadView ? 'ipadRefreshToken' : 'refreshToken'}`);
  }, []);

  const handleLogout = async () => {
    try {
      if (!refreshToken) {
        return;
      }
      setOpen(true);
      setLoading(true);
      const response = await logOutUser(refreshToken);
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      toast.success(t('translation.logoutSuccessful'));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
      setOpen(false);
      clearDataOnLogout(isIpadView);
      if (socket?.connected) {
        socket.disconnect();
      }
      router.push(isIpadView ? '/ipad/login' : '/login');
    }
  };

  const getUserProfile =
    useMemo(
      () => getImageUrl(userProfile?.s3BucketUrl, userProfile?.profilePicture),
      [userProfile],
    ) || '/assets/default-user.svg';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='border-none outline-none'>
          <Button
            variant='ghost'
            className='relative h-8 w-8 rounded-full border-none outline-none'
          >
            <Avatar>
              <div className='h-[42px] w-[42px]'>
                <img
                  src={getUserProfile}
                  alt='user'
                  className='h-full w-full'
                />
              </div>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-full mt-1 border-none'
          align='end'
          alignOffset={-100}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <LimitedText
                className='truncate py-1 text-sm font-medium capitalize leading-none text-darkGray'
                text={`${userProfile?.firstName || userProfile?.practiceName || ''} ${userProfile?.lastName || ''}`}
              />
              <LimitedText
                textLength={50}
                className='truncate py-1 text-xs leading-none text-darkGray'
                text={
                  userProfile?.email || userProfile?.contactPersonEmail || ''
                }
              />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className='mb-0 h-[1.7px]' />
          <DropdownMenuGroup>
            {!isIpadView && (
              <DropdownMenuItem
                className='cursor-pointer py-3'
                onClick={() => router.push('/settings')}
              >
                {t('translation.settings')}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className='cursor-pointer py-3 text-error hover:!text-red-400'
            >
              {t(`translation.logOutWithSpace`)}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <CustomAlertBox
          loading={loading}
          setOpen={setOpen}
          handleConfirm={handleLogout}
        />
      </AlertDialog>
    </>
  );
}

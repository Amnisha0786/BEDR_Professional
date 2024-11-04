'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';

import { cn, getErrorMessage } from '@/lib/utils';
import { TypographyP } from '../ui/typography/p';
import { NavItem } from '@/models/types/shared';
import Icon from '../custom-components/custom-icon';
import { AlertDialog } from '../ui/alert-dialog';
import CustomAlertBox from '../custom-components/custom-alert-box';
import { logOutUser } from '@/app/api';
import { getValueFromCookies } from '@/lib/common/manage-cookies';
import { clearDataOnLogout } from '@/lib/common/clear-data-on-logout';
import useSocket from '@/hooks/useSocket';
import useFileStatusTracker from '@/hooks/useFileStatusTracker';
import {
  POSSIBLE_STATUS,
  REMOVE_FROM_FILE_STATUS_TRACKER_COUNT,
} from '@/enums/file-status-tracker';
import useChatUsers from '@/hooks/useChatUsers';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  logoutMobileSidebar?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  logoutMobileSidebar,
}: DashboardNavProps) {
  const path = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState<boolean>(false);

  const refreshToken = useMemo(() => {
    return getValueFromCookies('refreshToken');
  }, []);

  const { t } = useTranslation();
  const socket = useSocket();
  const fileStatusTrackerList = useFileStatusTracker();
  const allChatUsers = useChatUsers();

  const handleLogout = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      try {
        if (!refreshToken) {
          return;
        }
        setLogoutOpen(true);
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
        setLogoutOpen(false);
        clearDataOnLogout();
        if (socket?.connected) {
          socket.disconnect();
        }
        router.push('/login');
      }
    },
    [refreshToken, socket],
  );

  const showBannerCount = useMemo(() => {
    const filteredList = fileStatusTrackerList?.filter(
      (item) =>
        !REMOVE_FROM_FILE_STATUS_TRACKER_COUNT?.includes(
          item?.fileStatus as POSSIBLE_STATUS,
        ) && !item?.readByOptometrist,
    );
    return filteredList?.length || 0;
  }, [fileStatusTrackerList]);

  const showMessageCount = useMemo(() => {
    let count = 0;
    allChatUsers?.forEach((item) => (count += item?.unreadMessages));
    return count;
  }, [allChatUsers]);

  const renderCount = (item: NavItem) => {
    if (item?.href === '/file-status-tracker' && showBannerCount > 0) {
      return (
        <span className='absolute -right-4 top-1 h-5 min-w-5 truncate rounded-full bg-pastelRed px-[3px] pt-[2px] pb-[1px] text-center !text-[12px] text-white'>
          {showBannerCount || 0}
        </span>
      );
    } else if (item?.href === '/chat-messages' && showMessageCount > 0) {
      return (
        <span className='absolute -right-4 top-1 h-5 min-w-5 truncate rounded-full bg-pastelRed px-[3px] pt-[2px] pb-[1px] text-center !text-[12px] text-white'>
          {showMessageCount || 0}
        </span>
      );
    }
    return null;
  };

  if (!items?.length) {
    return null;
  }

  return (
    <nav className='fixed grid items-start gap-2'>
      {items.map((item, index) => {
        return (
          item.href && (
            <Link
              key={index}
              href={{
                pathname: item.disabled ? '' : item.href,
              }}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  'group flex w-[249.72px] items-center rounded-r-[7px] pb-[15px] pl-[25px] pt-[14px] font-medium',
                  path === item.href || path?.includes(item?.href as string)
                    ? 'hover:none bg-primary !text-white'
                    : 'transparent',
                  path !== item.href &&
                  !path?.includes(item?.href as string) &&
                  'hover:bg-lightPrimary',
                  item.disabled && 'opacity-80',
                )}
              >
                <div className='h-5 w-5'>
                  <Icon
                    name={item?.icon || 'availablity'}
                    width={30}
                    height={22}
                    color={'transparent'}
                    className={
                      (path === item.href ||
                        path?.includes(item?.href as string)) &&
                        item?.href !== '/file-status-tracker' &&
                        item?.href !== '/practice/file-status-tracker' &&
                        item?.href !== '/overview'
                        ? 'svgIcon'
                        : (path === item.href ||
                          path?.includes(item?.href as string)) &&
                          (item?.href === '/file-status-tracker' ||
                            item?.href === '/practice/file-status-tracker' ||
                            item?.href === '/overview')
                          ? 'svgStroke'
                          : 'transparent'
                    }
                  />
                </div>
                <div className='relative'>
                  <TypographyP
                    size={16}
                    classname={`!mb-0 leading-normal pr-[8px] ml-[11px] ${path === item.href || path?.includes(item?.href as string) ? 'text-white' : 'text-secondaryBlue'}`}
                  >
                    {item.title}
                  </TypographyP>
                  {renderCount(item)}
                </div>
              </span>
            </Link>
          )
        );
      })}
      {logoutMobileSidebar && (
        <div
          onClick={() => setLogoutOpen(true)}
          className={cn(
            'group flex w-[249.72px] cursor-pointer items-center rounded-r-[7px] pb-[15px] pl-[25px] pt-[14px] font-medium',
          )}
        >
          <div className='h-5 w-5'>
            <Icon
              name={'log-out-active'}
              width={30}
              height={22}
              color={'transparent'}
              className={'transparent'}
            />
          </div>
          <TypographyP
            size={16}
            classname={`!mb-0 leading-normal pr-[8px] ml-[11px] text-secondaryBlue`}
          >
            {t('translation.logOutWithSpace')}
          </TypographyP>
        </div>
      )}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <CustomAlertBox
          loading={loading}
          setOpen={setLogoutOpen}
          handleConfirm={handleLogout}
        />
      </AlertDialog>
    </nav>
  );
}

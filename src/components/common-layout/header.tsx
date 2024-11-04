'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { cn, goToDefaultRoutes } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import { TypographyP } from '../ui/typography/p';
import { TypographyH2 } from '../ui/typography/h2';
import TimeClock from './clock';
import useUserProfile from '@/hooks/useUserProfile';
import useOptometristPractice from '@/hooks/useOptometristPractice';
import { LOGINS } from '@/enums/auth';
import { IPAD_HOMEPAGE } from '@/lib/constants/shared';

type Iprops = {
  isIpadView?: boolean;
};

export default function Header({ isIpadView = false }: Iprops) {
  const userProfile = useUserProfile();
  const optometristPractice = useOptometristPractice();
  const { t } = useTranslation();
  const getRoute = isIpadView
    ? IPAD_HOMEPAGE
    : goToDefaultRoutes(userProfile?.role || LOGINS.DOCTOR);

  const showBanner = useMemo(
    () => ((userProfile?.unreadNotificationsCount || 0) > 0 ? true : false),
    [userProfile],
  );

  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 bg-background/95 drop-shadow-md backdrop-blur'>
      <nav
        className={`m-auto flex h-[80px] items-center ${isIpadView && 'max-w-[1050px] !px-[30px]'} justify-between pl-[11px] pr-6`}
      >
        <div
          className={`${isIpadView ? 'ml-[0px] block' : 'ml-[50px] hidden lg:block'} `}
        >
          <Link href={(getRoute as unknown) || '/settings'}>
            <Image
              src={'/assets/logo-blue.svg'}
              height={66}
              width={109}
              alt='logo'
            />
          </Link>
        </div>
        {!isIpadView && (
          <div className={cn('block w-full px-5 lg:!hidden')}>
            <MobileSidebar />
          </div>
        )}

        <div
          className={`ml-[136px] w-full items-center gap-2 ${isIpadView ? 'flex justify-end' : 'hidden justify-between lg:flex'}`}
        >
          {!isIpadView && (
            <TypographyH2 classname='text-primary truncate leading-normal capitalize text-[22px] max-w-[400px]'>
              {t('translation.welcome')},
              {` ${userProfile?.firstName || userProfile?.practiceName || ''}`}
            </TypographyH2>
          )}
          {optometristPractice?.practiceName && !isIpadView && (
            <div className='rounded border border-primary px-[36px] pb-[10px] pt-2'>
              <TypographyP
                size={16}
                classname='!mb-0 text-primary leading-normal truncate'
              >
                {optometristPractice?.practiceName}
              </TypographyP>
            </div>
          )}
          <div className='flex items-center justify-end'>
            <div className='flex items-center rounded-full border border-primary px-[15px] py-[5px]'>
              <Image
                src={'/assets/clock.svg'}
                height={18}
                width={18}
                alt='clock'
              />
              <TypographyP
                size={16}
                classname='ml-[3px] !mb-0 !py-[4.5px] !px-[5px] leading-[20px] text-primary'
              >
                <TimeClock />
              </TypographyP>
            </div>
            {!isIpadView && (
              <Link href={'/notifications'}>
                <div className='relative mx-[25px] cursor-pointer rounded-full bg-lightPrimary p-2'>
                  <Image
                    src={'/assets/bell.svg'}
                    height={16}
                    width={16}
                    alt='bell'
                  />
                  {showBanner && (
                    <div className='absolute left-6 top-[3px] h-2 w-2 rounded-full bg-pastelRed'></div>
                  )}
                </div>
              </Link>
            )}
            <div
              className={`${isIpadView ? 'ml-8' : 'ml-1'} flex items-center`}
            >
              <UserNav userProfile={userProfile} isIpadView={isIpadView} />
              <div className='ml-3 mr-4'>
                <TypographyP
                  size={16}
                  classname='!mb-0 mt-0 leading-normal !truncate font-semibold capitalize max-w-[400px] !text-darkGray'
                >
                  {`${userProfile?.firstName || userProfile?.practiceName || ''}`}
                </TypographyP>
                <TypographyP
                  size={16}
                  classname='!mb-0 font-normal mt-0 capitalize leading-normal !text-gray'
                >
                  {userProfile?.role || ''}
                </TypographyP>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

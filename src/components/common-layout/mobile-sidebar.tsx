'use client';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { DashboardNav } from '@/components/common-layout/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet';
import useUserProfile from '@/hooks/useUserProfile';
import { cn, getSideBarContent, goToDefaultRoutes } from '@/lib/utils';
import { LOGINS } from '@/enums/auth';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const userProfile = useUserProfile();
  const getRoute = goToDefaultRoutes(userProfile?.role || LOGINS.DOCTOR);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <div className='flex items-center justify-between'>
          <Link href={(getRoute as unknown) || '/settings'}>
            <Image
              src={'/assets/logo-blue.svg'}
              alt='logo'
              width={100}
              height={100}
              className=''
            />
          </Link>
          <SheetTrigger
            asChild
            className={cn('cursor-pointer outline-none', {
              'pointer-events-none cursor-not-allowed opacity-50':
                !userProfile?.role,
            })}
          >
            <MenuIcon className='outline-none' />
          </SheetTrigger>
        </div>
        <SheetContent
          side='left'
          className='flex flex-col justify-between !pl-0 !pr-[14px]'
        >
          <div className='space-y-4 py-4'>
            <DashboardNav
              items={getSideBarContent(userProfile?.role || LOGINS.DOCTOR)}
              setOpen={setOpen}
              logoutMobileSidebar={true}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

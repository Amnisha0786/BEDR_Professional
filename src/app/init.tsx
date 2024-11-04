'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Route } from 'next';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import Loader from '@/components/custom-loader';
import useAccessToken from '@/hooks/useAccessToken';
import { getErrorMessage, goToDefaultRoutes } from '@/lib/utils';
import I18Provider from '@/lib/I18Provider';
import useIpadAccessToken from '@/hooks/useIpadAccessToken';
import { IPAD_HOMEPAGE } from '@/lib/constants/shared';
import { AUTH_ROUTES, IPAD_AUTH_ROUTES } from '@/lib/constants/shared';
import { possibleUserRoutes } from '@/lib/common/route-protection';

export default function Init({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [inited, setInited] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const userAccessToken = useAccessToken();
  const userIpadAccessToken = useIpadAccessToken();

  const isAuthenticated = useMemo(() => {
    if (userAccessToken?.accessToken) {
      return userAccessToken?.accessToken;
    }
  }, [userAccessToken?.accessToken]);

  const isIpadAuthenticated = useMemo(() => {
    if (userIpadAccessToken?.accessToken) {
      return userIpadAccessToken?.accessToken;
    }
  }, [userIpadAccessToken?.accessToken]);

  const userRole = useMemo(() => {
    if (userAccessToken?.role) {
      return userAccessToken?.role;
    }
  }, [userAccessToken?.role]);

  const getRoute = goToDefaultRoutes(userRole || 'doctor', pathname);
  const userRoutes = useMemo(
    () => possibleUserRoutes(userRole || ''),
    [userRole],
  );

  const containesRoute = useMemo(
    () =>
      userRoutes?.some((element) =>
        pathname?.includes(element) ? true : false,
      ),
    [pathname, isAuthenticated],
  );

  useEffect(() => {
    try {
      if (
        isAuthenticated?.length &&
        (!containesRoute ||
          AUTH_ROUTES.includes(pathname || '') ||
          pathname === '/')
      ) {
        router.push(getRoute as Route);
      } else if (
        !isAuthenticated?.length &&
        (
          AUTH_ROUTES.includes(pathname || '') ||
          pathname === '/') && containesRoute
      ) {
        router.push(pathname as Route)
      }
      else if (
        isIpadAuthenticated?.length &&
        (IPAD_AUTH_ROUTES.includes(pathname || '') || pathname === '/')
      ) {
        router.push(IPAD_HOMEPAGE);
      } else if (
        !IPAD_AUTH_ROUTES.includes(pathname as string) &&
        pathname?.split('/')?.[1] === 'ipad' &&
        !isIpadAuthenticated?.length
      ) {
        router.push('/ipad/login');
      } else if (
        !isAuthenticated?.length &&
        pathname?.split('/')?.[1] !== 'ipad'
      ) {
        router.push('/login');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setInited(true);
    }
  }, [isAuthenticated, userRole, isIpadAuthenticated, containesRoute]);

  return !inited || (isAuthenticated?.length && !containesRoute) ? (
    <Loader />
  ) : (
    <I18Provider>{children}</I18Provider>
  );
}

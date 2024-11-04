'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Route } from 'next';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import { Card } from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography/p';
import FlexBox from '@/components/ui/flexbox';
import { Button } from '@/components/ui/button';
import NoDataFound from '@/components/custom-components/custom-no-data-found';
import useUserProfile from '@/hooks/useUserProfile';
import { getErrorMessage, goToDefaultRoutes } from '@/lib/utils';
import Loader from '@/components/custom-loader';
import { TNotifications } from '@/models/types/notifications';
import { getNotifications } from '@/app/api/notifications';
import { useAppDispatch } from '@/lib/hooks';
import { UserData, userProfile } from '@/lib/userProfile/userProfileSlice';

const DEFAULT_OFFSET = 12;
const DEFAULT_PAGE = 1;

const Notifications = () => {
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [notifications, setNotifications] = useState<TNotifications[]>([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();
  const user = useUserProfile();
  const dispatch = useAppDispatch();
  const defaultRoute = useMemo(
    () => goToDefaultRoutes(user?.role || ''),
    [user],
  );

  const fetchAllNotifications = useCallback(async (hideLoading = false) => {
    try {
      if (!hideLoading) {
        setLoading(true);
      }
      const response = await getNotifications({
        page: DEFAULT_PAGE,
        offset: DEFAULT_OFFSET,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      const data = {
        ...user,
        unreadNotificationsCount: 0,
      } as UserData;
      dispatch(userProfile({ data, status: 200 }));

      if (response?.data?.data?.length < DEFAULT_OFFSET) {
        setHideLoadMore(true);
      } else {
        setHideLoadMore(false);
      }
      setNotifications(response.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
      setPageCount(DEFAULT_PAGE);
    }
  }, []);

  useEffect(() => {
    fetchAllNotifications();
  }, [fetchAllNotifications]);

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      try {
        setLoadingMore(true);
        const response = await getNotifications({
          offset: DEFAULT_OFFSET,
          page: count,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }
        setPageCount(count);
        if (response?.data?.data) {
          setNotifications((prev) => [...prev, ...response.data.data]);
          if (response?.data?.data?.length < DEFAULT_OFFSET) {
            setHideLoadMore(true);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
        setHideLoadMore(true);
      } finally {
        setLoadingMore(false);
      }
    },
    [],
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('translation.notifications')}</title>
      </Head>
      <div className='px-5 py-[30px] md:px-[43px]'>
        <Card className='w-full p-5 pb-20'>
          <FlexBox flex centerItems classname='justify-between'>
            <TypographyP noBottom primary size={20} classname='font-semibold'>
              {t('translation.notifications')}
            </TypographyP>
            <Button
              variant={'error'}
              className='text-[16px]'
              onClick={() => router.push(defaultRoute as Route)}
            >
              {t('translation.close')}
            </Button>
          </FlexBox>
          <div className='mt-[10px] md:w-[85%]'>
            <TypographyP size={16} classname='font-normal mb-[30px]'>
              {t('translation.notificationsWelcomeDescription')}
            </TypographyP>
            {notifications?.length > 0 ? (
              notifications?.map((item, index) => (
                <div key={index}>
                  <Card className='mb-5 p-5 shadow-medium'>
                    <FlexBox
                      flex
                      centerItems
                      justify='between'
                      classname='max-ms:flex-col-reverse max-ms:items-start'
                    >
                      <TypographyP
                        classname='font-semibold truncate w-full'
                        primary
                        noBottom
                      >
                        {item?.title || ''}
                      </TypographyP>
                      <TypographyP
                        classname='font-normal max-ms:ml-auto max-ms:mb-2 w-full text-right'
                        size={16}
                        primary
                        noBottom
                      >
                        {item?.createdAt
                          ? dayjs(item?.createdAt)?.format('DD/MM/YYYY h:mm A')
                          : ''}
                      </TypographyP>
                    </FlexBox>
                    <TypographyP
                      size={16}
                      primary
                      noBottom
                      classname='w-full break-words'
                    >
                      {item?.body || ''}
                    </TypographyP>
                  </Card>
                </div>
              ))
            ) : (
              <NoDataFound
                title={t('translation.noNotificationsFound')}
                heading={t('translation.noNotification')}
                hideButton
              />
            )}
          </div>
          {!hideLoadMore && notifications?.length > 0 && (
            <FlexBox flex centerItems centerContent classname='mt-[40px]'>
              <Button
                variant={'outline'}
                className='min-h-[40px] min-w-[114px] text-[16px]'
                onClick={(e) => {
                  handleLoadMore(e, pageCount + DEFAULT_PAGE);
                }}
                loading={loadingMore}
                center
              >
                {t('translation.loadMore')}
              </Button>
            </FlexBox>
          )}
        </Card>
      </div>
    </>
  );
};

export default Notifications;

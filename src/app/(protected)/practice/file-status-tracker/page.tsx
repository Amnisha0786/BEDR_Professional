'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Head from 'next/head';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import { COMMON_ACTION_TO_BE_TAKEN_OPTIONS } from '@/enums/file-in-progress';
import { FILE_STATUSES, POSSIBLE_STATUS } from '@/enums/file-status-tracker';
import { TFileStatusTrackerList } from '@/models/types/file-status-tracker';
import { getPracticeFileStatusTrackerList } from '@/app/api/file-status-tracker';
import SharedTable from '@/components/common-layout/shared-table';
import Icon from '@/components/custom-components/custom-icon';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { debounce } from '@/lib/common/debounce';
import { Button } from '@/components/ui/button';
import FlexBox from '@/components/ui/flexbox';
import { Input } from '@/components/ui/input';
import { cn, getErrorMessage } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import useSocket from '@/hooks/useSocket';
import useRefreshStates from '@/hooks/useRefreshStates';
import { useAppDispatch } from '@/lib/hooks';
import { setRefreshData } from '@/lib/updateReduxState/updateReduxStateSlice';

const DEFAULT_ITEMS = 15;
const DEFAULT_PAGE_COUNT = 1;

const PracticeFileStatusTracker = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE_COUNT);
  const [searchInput, setSearchInput] = useState<string>('');
  const [fileStatusTrackerList, setFileStatusTrackerList] = useState<
    TFileStatusTrackerList[]
  >([]);

  const { t } = useTranslation();
  const socket = useSocket();
  const isRefresh = useRefreshStates();
  const dispatch = useAppDispatch();

  const fetchFileStatusTrackerList = useCallback(
    async (hideLoading = false) => {
      if (!hideLoading) {
        setLoading(true);
      }
      try {
        const response = await getPracticeFileStatusTrackerList({
          offset: DEFAULT_ITEMS,
          page: DEFAULT_PAGE_COUNT,
          searchQuery: searchInput,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        setFileStatusTrackerList(response?.data?.data);
        if (response?.data?.data?.length < DEFAULT_ITEMS) {
          setHideLoadMore(true);
        } else {
          setHideLoadMore(false);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
        setHideLoadMore(true);
      } finally {
        setLoading(false);
        setPageCount(DEFAULT_PAGE_COUNT);
        dispatch(setRefreshData({ ...isRefresh, isRefreshPractice: false }));
      }
    },
    [searchInput],
  );

  useEffect(() => {
    fetchFileStatusTrackerList();
  }, [fetchFileStatusTrackerList]);

  useEffect(() => {
    if (isRefresh?.isRefreshPractice) {
      fetchFileStatusTrackerList(true);
    }
  }, [isRefresh]);

  useEffect(() => {
    const handleSocketEvent = () => fetchFileStatusTrackerList(true);
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.FILE_MOVED_TO_PATIENT_FILES, handleSocketEvent);
      socket.on(SOCKET_EVENTS.REFERRED_PATIENT, handleSocketEvent);

      return () => {
        socket.off(SOCKET_EVENTS.FILE_MOVED_TO_PATIENT_FILES);
        socket.off(SOCKET_EVENTS.REFERRED_PATIENT);
      };
    }
  }, [socket]);

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      try {
        setLoadingMore(true);
        const response = await getPracticeFileStatusTrackerList({
          offset: DEFAULT_ITEMS,
          page: count,
          searchQuery: searchInput,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }
        setPageCount(count);
        if (response?.data?.data) {
          setFileStatusTrackerList((prev) => [...prev, ...response.data.data]);
          if (response?.data?.data?.length < DEFAULT_ITEMS) {
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
    [searchInput],
  );

  const diagnosisEyeAction = (detail: TFileStatusTrackerList) => {
    const leftEyeAction = detail?.actionToBeTakenForLeftEye;
    const rightEyeAction = detail?.actionToBeTakenForRightEye;
    const isLeftEyeUrgent =
      leftEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
      leftEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL;
    const isRightEyeUrgent =
      rightEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
      rightEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL;
    return (
      <div className='bottom-2 flex min-w-[300px] max-w-[300px] flex-col gap-1'>
        {leftEyeAction && (
          <FlexBox
            flex
            classname={cn('gap-2 items-start text-darkGray font-normal', {
              '!text-error font-semibold': isLeftEyeUrgent,
            })}
          >
            <TypographyP
              size={16}
              primary
              noBottom
              classname={cn('min-w-[80px] text-darkGray', {
                '!text-error': isLeftEyeUrgent,
              })}
            >
              {t('translation.leftEye')}
            </TypographyP>
            <FlexBox flex classname='gap-3 max-w-[300px] break-words'>
              <span>
                {`${COMMON_ACTION_TO_BE_TAKEN_OPTIONS?.find((option) => option.value === leftEyeAction)?.label || leftEyeAction || ''}`}{' '}
              </span>
            </FlexBox>
          </FlexBox>
        )}
        {rightEyeAction && rightEyeAction?.length > 0 && (
          <FlexBox
            flex
            classname={cn('gap-2 items-start text-darkGray font-normal', {
              '!text-error font-semibold': isRightEyeUrgent,
            })}
          >
            <TypographyP
              noBottom
              size={16}
              primary
              classname={cn('min-w-[80px] text-darkGray', {
                '!text-error': isRightEyeUrgent,
              })}
            >
              {t('translation.rightEye')}
            </TypographyP>
            <FlexBox flex classname='gap-3 max-w-[300px] break-words'>
              <span>
                {`${COMMON_ACTION_TO_BE_TAKEN_OPTIONS?.find((option) => option.value === rightEyeAction)?.label || rightEyeAction || ''}`}{' '}
              </span>
            </FlexBox>
          </FlexBox>
        )}
      </div>
    );
  };

  const columns: ColumnDef<TFileStatusTrackerList>[] = useMemo(
    () => [
      {
        accessorKey: 'idNumber',
        header: t('translation.idNumberSentenceCase'),
        cell: ({ row }) => (
          <div className='w-[120px] truncate capitalize max-ms:w-[90px]'>
            {row?.getValue('idNumber') || ''}
          </div>
        ),
      },
      {
        accessorKey: 'lastName',
        header: t('translation.lastName'),
        cell: ({ row }) => (
          <div className='w-[120px] truncate capitalize'>
            {row?.getValue('lastName') || ''}
          </div>
        ),
      },
      {
        accessorKey: 'firstName',
        header: t('translation.firstName'),
        cell: ({ row }) => (
          <div className='w-[120px] truncate capitalize'>
            {row?.getValue('firstName') || ''}
          </div>
        ),
      },
      {
        accessorKey: 'optometristName',
        header: t('translation.optomName'),
        cell: ({ row }) => (
          <div className='truncate capitalize'>
            {`${row?.original?.optometristFirstName || ''} ${row?.original?.optometristLastName || ''}` ||
              ''}
          </div>
        ),
      },
      {
        accessorKey: 'fileStatus',
        header: t('translation.statusOrAction'),
        cell: ({ row }) => {
          const status = row?.getValue('fileStatus');
          const isApproved = row?.original?.fileStatus === 'approved';
          const leftEyeAction = row?.original?.actionToBeTakenForLeftEye;
          const rightEyeAction = row?.original?.actionToBeTakenForRightEye;
          const dateSubmitted = row?.original?.submittedAt;
          const statusLabel =
            FILE_STATUSES?.find((item) => item.value === status)?.label || '';
          let currentStatus: string | React.ReactNode = '';
          if (
            status !== POSSIBLE_STATUS.REFERRED &&
            status === POSSIBLE_STATUS.APPROVED
          ) {
            currentStatus = diagnosisEyeAction(row?.original);
          } else if (
            dateSubmitted &&
            (status === POSSIBLE_STATUS.SUBMITTED ||
              status === POSSIBLE_STATUS.IN_REVIEW_BY_READER ||
              status === POSSIBLE_STATUS.PENDING_APPROVAL ||
              status === POSSIBLE_STATUS.IN_REVIEW_BY_DOCTOR)
          ) {
            currentStatus = `${statusLabel} ${dayjs(dateSubmitted)?.format('DD.MM.YY')}`;
          } else {
            currentStatus = statusLabel;
          }
          return (
            <div
              className={cn('w-[210px] font-normal', {
                'font-semibold !text-error':
                  status !== POSSIBLE_STATUS.REFERRED &&
                  (status === POSSIBLE_STATUS.URGENT_REFERRAL ||
                    status === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                    leftEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
                    rightEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
                    leftEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                    rightEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL),
              })}
            >
              {currentStatus ? currentStatus : isApproved || '-'}
            </div>
          );
        },
      },
    ],
    [fileStatusTrackerList],
  );

  const onChangeInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchInput(value);
    },
    1000,
  );

  return (
    <>
      <Head>
        <title>{t('translation.fileStatusTrackerHead')}</title>
      </Head>
      <div className='px-[30px] py-[30px] md:px-[56px]'>
        <Card className='min-h-[200px] justify-start bg-white px-5 py-[30px] md:px-[40px] md:pb-[40px]'>
          <FlexBox classname='flex items-center justify-between max-ms:flex-col max-ms:gap-4 max-ms:items-start'>
            <FlexBox classname='flex items-center'>
              <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Image
                  src='../../assets/file-status-tracker.svg'
                  alt={t('translation.fileStatusTracker')}
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>
                {t('translation.fileStatusTrackerTitle')}
              </TypographyH2>
            </FlexBox>
            <div className='flex items-center gap-4'>
              <div className='relative flex-1 md:w-[275px] md:flex-none'>
                <Input
                  label={''}
                  placeholder={t('translation.searchHerePlaceholder')}
                  onChange={(event) => onChangeInput(event)}
                  disabled={
                    !fileStatusTrackerList?.length &&
                    !searchInput?.trim()?.length
                  }
                  className='min-h-[44px] !border-lightGray bg-transparent py-[0.4rem] ps-[1.8rem] !text-[16px] ring-transparent placeholder:font-normal focus:bg-lightPrimary md:max-w-[530px]'
                />
                <span className='absolute left-[9px] top-[14px]'>
                  <Icon name='search' width={16} height={16} />
                </span>
              </div>
            </div>
          </FlexBox>
          <div className='mt-[25px]'>
            <div className='flex flex-col items-end gap-5'>
              <SharedTable
                data={fileStatusTrackerList}
                columns={columns}
                loading={loading}
                noResultsMessage='No files found!'
              />
            </div>

            {!loading && !hideLoadMore && fileStatusTrackerList?.length > 0 && (
              <FlexBox flex centerItems centerContent>
                <Button
                  variant={'outline'}
                  className='mt-[58px] min-h-[40px] min-w-[114px] text-[16px]'
                  onClick={(e) =>
                    handleLoadMore(e, pageCount + DEFAULT_PAGE_COUNT)
                  }
                  loading={loadingMore}
                  center
                >
                  {t('translation.loadMore')}
                </Button>
              </FlexBox>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default PracticeFileStatusTracker;
